export async function onRequestGet({ request }) {
  return Response.redirect(new URL("/#inscricao", request.url), 303);
}

// Rate limiter em memória por instância (proteção básica; para produção use KV)
const rateLimiter = new Map();
const RATE_LIMIT    = 3;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hora

function checkRateLimit(ip) {
  const now   = Date.now();
  const entry = rateLimiter.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW_MS) {
    rateLimiter.set(ip, { start: now, count: 1 });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

function errorRedirect(base, code) {
  return Response.redirect(new URL(`/#inscricao?erro=${code}`, base), 303);
}

// ID no formato #AAAAMMDD-HHMMSS (UTC)
function gerarId() {
  const now = new Date();
  const pad = (n, l = 2) => String(n).padStart(l, "0");
  const data = now.getUTCFullYear() + pad(now.getUTCMonth() + 1) + pad(now.getUTCDate());
  const hora = pad(now.getUTCHours()) + pad(now.getUTCMinutes()) + pad(now.getUTCSeconds());
  return `#${data}-${hora}`;
}

// Converte #AAAAMMDD-HHMMSS → "DD/MM/AAAA às HH:MM:SS UTC"
function dataHoraFormatada(id) {
  const m = id.match(/^#(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})$/);
  if (!m) return id;
  return `${m[3]}/${m[2]}/${m[1]} às ${m[4]}:${m[5]}:${m[6]} UTC`;
}

// Relatório estruturado emitido para os logs do Cloudflare (Workers → Logs)
function logRelatorio(id, interno, candidato) {
  const sep  = "─".repeat(44);
  const sep2 = "─".repeat(40);
  const linhas = [`[casting] ${sep}`, `[casting] RELATÓRIO ${id}`];

  if (interno.ok) {
    linhas.push(
      `[casting] ✓ Email interno enviado`,
      `[casting]   Destinatário : info@voxlaci.com`,
      `[casting]   Assunto      : [VoxLaci] Nova candidatura de Casting (${id})`,
      `[casting]   Status       : Accepted`,
      `[casting]   Message ID   : ${interno.id}`,
    );
  } else {
    linhas.push(
      `[casting] ✗ Email interno FALHOU — candidatura NÃO registada`,
      `[casting]   Destinatário : info@voxlaci.com`,
      `[casting]   Erro         : ${interno.erro}`,
    );
  }

  linhas.push(`[casting]   ${sep2}`);

  if (candidato === null) {
    linhas.push(`[casting] — Email ao candidato: não enviado (email interno falhou)`);
  } else if (candidato.ok) {
    linhas.push(
      `[casting] ✓ Email ao candidato enviado`,
      `[casting]   Destinatário : ${candidato.to}`,
      `[casting]   Assunto      : [VoxLaci] Cópia da sua candidatura (${id})`,
      `[casting]   Status       : Accepted`,
      `[casting]   Message ID   : ${candidato.id}`,
    );
  } else {
    linhas.push(
      `[casting] ✗ Email ao candidato FALHOU (candidatura mantida válida)`,
      `[casting]   Destinatário : ${candidato.to}`,
      `[casting]   Erro         : ${candidato.erro}`,
    );
  }

  linhas.push(`[casting] ${sep}`);
  console.info(linhas.join("\n"));
}

// Linha HTML de campo para os corpos de email
function linha(label, valor) {
  return `<tr>
    <td style="padding:9px 12px;background:#f5f5f5;font-weight:700;width:38%;vertical-align:top">${label}</td>
    <td style="padding:9px 12px;border-bottom:1px solid #eee;white-space:pre-wrap">${esc(valor || "—")}</td>
  </tr>`;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const base          = new URL(request.url);
  const candidaturaId = gerarId();
  const from          = "VoxLaci <info@voxlaci.com>";

  // ── Rate limiting por IP ─────────────────────────────────────────────
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (!checkRateLimit(ip)) {
    console.warn(`[casting] rate-limit atingido — IP: ${ip}`);
    return errorRedirect(base, "rate");
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    console.error(`[casting] ${candidaturaId} — erro ao ler formData`);
    return new Response("Pedido inválido.", { status: 400 });
  }

  // ── Honeypots ────────────────────────────────────────────────────────
  if (formData.get("website") || formData.get("campo-secreto")) {
    console.info(`[casting] ${candidaturaId} — honeypot ativado, IP: ${ip}`);
    return Response.redirect(new URL("/obrigado.html", base), 303);
  }

  // ── Validar Turnstile ────────────────────────────────────────────────
  const turnstileToken = formData.get("cf-turnstile-response");
  if (!turnstileToken) {
    console.warn(`[casting] ${candidaturaId} — Turnstile token ausente`);
    return errorRedirect(base, "captcha");
  }

  const secretKey = env.TURNSTILE_SECRET_KEY;
  if (secretKey) {
    const tsResult = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: secretKey, response: turnstileToken, remoteip: ip }),
    });
    const tsJson = await tsResult.json();
    if (!tsJson.success) {
      console.warn(`[casting] ${candidaturaId} — Turnstile falhou: ${JSON.stringify(tsJson["error-codes"])}`);
      return errorRedirect(base, "captcha");
    }
  }

  // ── Campos de texto ──────────────────────────────────────────────────
  const nome            = sanitize(formData.get("nome"));
  const idade           = sanitize(formData.get("idade"));
  const pais            = sanitize(formData.get("pais"));
  const telefone        = sanitize(formData.get("telefone"));
  const email           = sanitize(formData.get("email"));
  const morada          = sanitize(formData.get("morada"));
  const ensemble        = sanitize(formData.get("ensemble"));
  const experiencia     = sanitize(formData.get("experiencia"));
  const leituraMusical  = sanitize(formData.get("leitura-musical"));
  const origem          = sanitize(formData.get("origem"));
  const motivacao       = sanitize(formData.get("motivacao"));
  const pagamentoMetodo = sanitize(formData.get("pagamento-inscricao"));
  const nomePagamento   = sanitize(formData.get("nome-pagamento"));

  if (!nome || !idade || !telefone || !email) {
    console.warn(`[casting] ${candidaturaId} — campos obrigatórios em falta`);
    return errorRedirect(base, "campos-obrigatorios");
  }

  console.info(`[casting] ${candidaturaId} — candidatura recebida · nome=${nome} · email=${email} · IP=${ip}`);

  // ── Validar comprovativo de pagamento (obrigatório) ──────────────────
  const comprovativo = formData.get("comprovativo");
  if (!comprovativo || typeof comprovativo !== "object" || !("arrayBuffer" in comprovativo) || comprovativo.size === 0) {
    console.warn(`[casting] ${candidaturaId} — comprovativo ausente`);
    return errorRedirect(base, "comprovativo-ausente");
  }

  if (!env.RESEND_API_KEY) {
    console.error(`[casting] ${candidaturaId} — RESEND_API_KEY não configurada`);
    return new Response(
      "O envio de email ainda não está configurado. Contacte info@voxlaci.com diretamente.",
      { status: 500 }
    );
  }

  // ── Preparar anexo ───────────────────────────────────────────────────
  const comprovanteBuffer = await comprovativo.arrayBuffer();
  const attachments = [{
    filename: comprovativo.name || `comprovativo-${nome.replace(/[^a-zA-Z0-9\-_]/g, "-").slice(0, 40).toLowerCase()}`,
    content: toBase64(comprovanteBuffer),
  }];

  const dataHora = dataHoraFormatada(candidaturaId);

  // ── Corpo: email interno ─────────────────────────────────────────────
  const corpoInterno = `<div style="font-family:sans-serif;max-width:680px;margin:0 auto">
  <h2 style="margin-bottom:4px;color:#111">Nova candidatura de Casting</h2>
  <p style="color:#888;font-size:13px;margin-top:0">VoxLaci · ${esc(dataHora)}</p>
  <table style="width:100%;border-collapse:collapse;margin-top:20px;font-size:14px">
    ${linha("ID da candidatura", candidaturaId)}
    ${linha("Nome", nome)}
    ${linha("Email", email)}
    ${linha("Telefone", telefone)}
    ${linha("Idade", idade)}
    ${linha("País", pais)}
    ${linha("Morada", morada)}
    ${linha("Ensemble pretendido", ensemble)}
    ${linha("Experiência coral", experiencia)}
    ${linha("Leitura musical", leituraMusical)}
    ${linha("Como conheceu a VoxLaci", origem)}
    ${linha("Motivação", motivacao)}
    ${linha("Forma de pagamento", pagamentoMetodo)}
    ${linha("Nome no pagamento", nomePagamento)}
  </table>
  <p style="margin-top:20px;font-size:13px;color:#555"><i>Comprovativo de pagamento em anexo.</i></p>
  <p style="font-size:12px;color:#aaa;border-top:1px solid #eee;padding-top:12px">Reply-To automático para o candidato: ${esc(email)}</p>
</div>`;

  // ── Corpo: email ao candidato ────────────────────────────────────────
  const corpoConfirmacao = `<div style="font-family:sans-serif;max-width:680px;margin:0 auto">
  <h2 style="margin-bottom:4px;color:#111">VoxLaci — Cópia da sua candidatura</h2>
  <p style="color:#888;font-size:13px;margin-top:0">Recebida em ${esc(dataHora)}</p>

  <p>Olá, ${esc(nome)},</p>
  <p>Segue em baixo a cópia completa da candidatura que submeteu ao VoxLaci.</p>

  <table style="width:100%;border-collapse:collapse;margin-top:20px;font-size:14px">
    ${linha("ID da candidatura", candidaturaId)}
    ${linha("Data e hora", dataHora)}
    ${linha("Nome", nome)}
    ${linha("Email", email)}
    ${linha("Telefone", telefone)}
    ${linha("Idade", idade)}
    ${linha("País", pais)}
    ${linha("Morada", morada)}
    ${linha("Ensemble pretendido", ensemble)}
    ${linha("Experiência coral", experiencia)}
    ${linha("Leitura musical", leituraMusical)}
    ${linha("Como conheceu a VoxLaci", origem)}
    ${linha("Motivação", motivacao)}
    ${linha("Forma de pagamento", pagamentoMetodo)}
    ${linha("Nome no pagamento", nomePagamento)}
  </table>

  <p style="margin-top:24px">Os ficheiros anexados foram recebidos com sucesso e fazem parte da sua candidatura.</p>

  <p>A nossa equipa irá analisar cuidadosamente a sua candidatura e entraremos em contacto consigo assim que possível.</p>
  <p>Obrigado pelo seu interesse no VoxLaci.</p>

  <p style="margin-top:32px"><b>VoxLaci</b><br><a href="https://www.voxlaci.com">www.voxlaci.com</a></p>
  <p style="font-size:12px;color:#aaa;margin-top:24px;border-top:1px solid #eee;padding-top:12px">
    Referência: ${esc(candidaturaId)} · Se não submeteu esta candidatura, por favor ignore este email.
  </p>
</div>`;

  // ── ENVIO CRÍTICO: email interno ─────────────────────────────────────
  let emailInternoStatus;
  try {
    const r1 = await sendEmail(env.RESEND_API_KEY, {
      from,
      to: ["info@voxlaci.com"],
      reply_to: email,
      subject: `[VoxLaci] Nova candidatura de Casting (${candidaturaId})`,
      html: corpoInterno,
      attachments,
    });
    emailInternoStatus = { ok: true, id: r1.id };
  } catch (err) {
    emailInternoStatus = { ok: false, erro: err.message };
    logRelatorio(candidaturaId, emailInternoStatus, null);
    return errorRedirect(base, "envio-falhou");
  }

  // ── ENVIO SECUNDÁRIO: email ao candidato (falha não bloqueia) ────────
  let emailCandidatoStatus;
  try {
    const r2 = await sendEmail(env.RESEND_API_KEY, {
      from,
      to: [email],
      reply_to: "info@voxlaci.com",
      subject: `[VoxLaci] Cópia da sua candidatura (${candidaturaId})`,
      html: corpoConfirmacao,
    });
    emailCandidatoStatus = { ok: true, id: r2.id, to: email };
  } catch (err) {
    emailCandidatoStatus = { ok: false, erro: err.message, to: email };
  }

  logRelatorio(candidaturaId, emailInternoStatus, emailCandidatoStatus);

  return Response.redirect(new URL("/obrigado.html", base), 303);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function sendEmail(apiKey, payload) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Resend HTTP ${res.status}: ${JSON.stringify(body)}`);
  return body; // { id: "..." }
}

function sanitize(value) {
  return (value || "").toString().trim().slice(0, 2000);
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

function toBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}
