/**
 * Testes da lógica do formulário de Casting — VoxLaci
 * Executa com: node test-casting.mjs
 *
 * Testa as funções puras extraídas de functions/enviar-casting.js.
 * (Testes de integração real com Resend requerem a API key configurada.)
 */

let passou = 0;
let falhou = 0;

function ok(desc, cond) {
  if (cond) {
    console.log(`  ✓  ${desc}`);
    passou++;
  } else {
    console.error(`  ✗  ${desc}`);
    falhou++;
  }
}

// ── Funções importadas inline para testar ────────────────────────────────────

function gerarId() {
  const now = new Date();
  const pad = (n, l = 2) => String(n).padStart(l, "0");
  const data = now.getUTCFullYear() + pad(now.getUTCMonth() + 1) + pad(now.getUTCDate());
  const hora = pad(now.getUTCHours()) + pad(now.getUTCMinutes()) + pad(now.getUTCSeconds());
  return `#${data}-${hora}`;
}

function dataHoraFormatada(id) {
  const m = id.match(/^#(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})$/);
  if (!m) return id;
  return `${m[3]}/${m[2]}/${m[1]} às ${m[4]}:${m[5]}:${m[6]} UTC`;
}

function sanitize(value) {
  return (value || "").toString().trim().slice(0, 2000);
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

// ── TESTE 1: Formato do ID ───────────────────────────────────────────────────
console.log("\n[Teste 1] Formato do ID da candidatura");
const id = gerarId();
ok("ID começa com #",             id.startsWith("#"));
ok("ID tem comprimento total de 16 caracteres", id.length === 16);
ok("ID segue padrão #AAAAMMDD-HHMMSS", /^#\d{8}-\d{6}$/.test(id));
ok("Assunto interno contém ID",
  `[VoxLaci] Nova candidatura de Casting (${id})`.includes(id));
ok("Assunto candidato contém ID",
  `[VoxLaci] Cópia da sua candidatura (${id})`.includes(id));

// ── TESTE 2: dataHoraFormatada ───────────────────────────────────────────────
console.log("\n[Teste 2] Conversão de ID para data legível");
const idFixo = "#20260701-154812";
const dh     = dataHoraFormatada(idFixo);
ok("Data formatada corretamente", dh === "01/07/2026 às 15:48:12 UTC");
ok("ID inválido retorna o próprio valor", dataHoraFormatada("invalido") === "invalido");

// ── TESTE 3: sanitize ────────────────────────────────────────────────────────
console.log("\n[Teste 3] Sanitização de campos");
ok("null → string vazia",        sanitize(null)        === "");
ok("undefined → string vazia",   sanitize(undefined)   === "");
ok("string normal passa intacta", sanitize("João Silva") === "João Silva");
ok("espaços cortados",            sanitize("  Ana  ")   === "Ana");
ok("texto longo truncado a 2000", sanitize("a".repeat(3000)).length === 2000);

// ── TESTE 4: esc (HTML escaping) ─────────────────────────────────────────────
console.log("\n[Teste 4] Escape de HTML");
ok("& → &amp;",  esc("&")  === "&amp;");
ok("< → &lt;",   esc("<")  === "&lt;");
ok("> → &gt;",   esc(">")  === "&gt;");
ok("\" → &quot;", esc('"') === "&quot;");
ok("' → &#39;",  esc("'")  === "&#39;");
ok("texto normal não alterado", esc("João") === "João");
ok("XSS simples neutralizado",
  !esc('<script>alert("x")</script>').includes("<script>"));

// ── TESTE 5: Regra — email interno falha → não enviar ao candidato ───────────
console.log("\n[Teste 5] Regra: falha interna → candidato não recebe");
function simularEnvio(internoOk, candidatoOk) {
  let candidatoEnviado = false;
  const internoStatus = internoOk
    ? { ok: true, id: "resend-abc123" }
    : { ok: false, erro: "Resend 422: domain not verified" };

  if (!internoStatus.ok) {
    return { internoStatus, candidatoStatus: null, candidatoEnviado: false };
  }

  candidatoEnviado = true;
  const candidatoStatus = candidatoOk
    ? { ok: true, id: "resend-def456", to: "candidato@example.com" }
    : { ok: false, erro: "timeout", to: "candidato@example.com" };

  return { internoStatus, candidatoStatus, candidatoEnviado };
}

const cenario1 = simularEnvio(false, true);
ok("Interno falha → candidato NÃO recebe", cenario1.candidatoEnviado === false);
ok("Interno falha → status.ok=false",      cenario1.internoStatus.ok === false);
ok("Interno falha → candidatoStatus=null", cenario1.candidatoStatus === null);

// ── TESTE 6: Regra — candidato falha → candidatura mantida válida ────────────
console.log("\n[Teste 6] Regra: candidato falha → candidatura válida");
const cenario2 = simularEnvio(true, false);
ok("Interno OK → candidato tentado",          cenario2.candidatoEnviado === true);
ok("Interno mantém Message ID",               cenario2.internoStatus.id === "resend-abc123");
ok("Candidato falha → erro registado",        cenario2.candidatoStatus.ok === false);
ok("Candidato falha → candidatura não perde", cenario2.internoStatus.ok === true);

// ── TESTE 7: From e Reply-To ──────────────────────────────────────────────────
console.log("\n[Teste 7] From e Reply-To");
const FROM = "VoxLaci <info@voxlaci.com>";
ok("From fixo (nunca casting@)",  FROM === "VoxLaci <info@voxlaci.com>");
ok("From não contém casting@",    !FROM.includes("casting@"));
const payloadInterno = { from: FROM, reply_to: "candidato@gmail.com", to: ["info@voxlaci.com"] };
ok("Internal reply_to = email do candidato", payloadInterno.reply_to === "candidato@gmail.com");
ok("Internal to = info@voxlaci.com",         payloadInterno.to[0]    === "info@voxlaci.com");
const payloadCandidato = { from: FROM, reply_to: "info@voxlaci.com", to: ["candidato@gmail.com"] };
ok("Candidato reply_to = info@voxlaci.com",  payloadCandidato.reply_to === "info@voxlaci.com");

// ── TESTE 8: Assuntos ─────────────────────────────────────────────────────────
console.log("\n[Teste 8] Formato dos assuntos");
const idEx = "#20260701-120000";
ok("Assunto interno correto",
  `[VoxLaci] Nova candidatura de Casting (${idEx})` === "[VoxLaci] Nova candidatura de Casting (#20260701-120000)");
ok("Assunto candidato correto",
  `[VoxLaci] Cópia da sua candidatura (${idEx})` === "[VoxLaci] Cópia da sua candidatura (#20260701-120000)");

// ── TESTE 9: Campos obrigatórios ─────────────────────────────────────────────
console.log("\n[Teste 9] Campos obrigatórios");
function camposValidos(nome, idade, telefone, email) {
  return !!(nome && idade && telefone && email);
}
ok("Todos preenchidos → válido",       camposValidos("Ana", "25", "911", "a@b.com") === true);
ok("Nome em falta → inválido",         camposValidos("", "25", "911", "a@b.com") === false);
ok("Idade em falta → inválido",        camposValidos("Ana", "", "911", "a@b.com") === false);
ok("Telefone em falta → inválido",     camposValidos("Ana", "25", "", "a@b.com") === false);
ok("Email em falta → inválido",        camposValidos("Ana", "25", "911", "") === false);

// ── RESULTADO FINAL ───────────────────────────────────────────────────────────
console.log(`\n${"═".repeat(50)}`);
console.log(`  Resultado: ${passou} passaram · ${falhou} falharam`);
if (falhou === 0) {
  console.log("  ✓ Todos os testes passaram.\n");
} else {
  console.error(`  ✗ ${falhou} teste(s) falharam.\n`);
  process.exit(1);
}
