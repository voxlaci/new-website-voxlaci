export async function onRequestGet({ request }) {
  return Response.redirect(new URL("/#inscricao", request.url), 303);
}

// Rate limiter em memória por instância (proteção básica; para produção use KV)
const rateLimiter = new Map();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hora

function checkRateLimit(ip) {
  const now = Date.now();
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

export async function onRequestPost(context) {
  const { request, env } = context;
  const base = new URL(request.url);

  // ── Rate limiting por IP ────────────────────────────────────────────
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (!checkRateLimit(ip)) {
    return errorRedirect(base, "rate");
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return new Response("Pedido inválido.", { status: 400 });
  }

  // ── Honeypots ────────────────────────────────────────────────────────
  if (formData.get("website") || formData.get("campo-secreto")) {
    return Response.redirect(new URL("/obrigado.html", base), 303);
  }

  // ── Validar Turnstile ────────────────────────────────────────────────
  const turnstileToken = formData.get("cf-turnstile-response");
  if (!turnstileToken) {
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
      return errorRedirect(base, "captcha");
    }
  }

  // ── Campos de texto ──────────────────────────────────────────────────
  const nome          = sanitize(formData.get("nome"));
  const idade         = sanitize(formData.get("idade"));
  const pais          = sanitize(formData.get("pais"));
  const telefone      = sanitize(formData.get("telefone"));
  const email         = sanitize(formData.get("email"));
  const morada        = sanitize(formData.get("morada"));
  const ensemble      = sanitize(formData.get("ensemble"));
  const experiencia   = sanitize(formData.get("experiencia"));
  const leituraMusical= sanitize(formData.get("leitura-musical"));
  const origem        = sanitize(formData.get("origem"));
  const motivacao     = sanitize(formData.get("motivacao"));
  const pagamentoMetodo = sanitize(formData.get("pagamento-inscricao"));
  const nomePagamento = sanitize(formData.get("nome-pagamento"));

  if (!nome || !idade || !telefone || !email) {
    return errorRedirect(base, "campos-obrigatorios");
  }

  // ── Validar fotografia (obrigatória) ─────────────────────────────────
  const fotografia = formData.get("fotografia");
  if (!fotografia || typeof fotografia !== "object" || !("arrayBuffer" in fotografia) || fotografia.size === 0) {
    return errorRedirect(base, "foto-ausente");
  }

  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const MAX_FOTO_SIZE = 5 * 1024 * 1024; // 5 MB

  if (fotografia.size > MAX_FOTO_SIZE) {
    return errorRedirect(base, "foto-tamanho");
  }

  const fotoType = fotografia.type?.toLowerCase() || "";
  const fotoName = (fotografia.name || "").toLowerCase();
  const extOk = /\.(jpg|jpeg|png|webp)$/.test(fotoName);
  if (!ALLOWED_TYPES.includes(fotoType) && !extOk) {
    return errorRedirect(base, "foto-tipo");
  }

  // ── Validar comprovativo de pagamento (obrigatório) ───────────────────
  const comprovativo = formData.get("comprovativo");
  if (!comprovativo || typeof comprovativo !== "object" || !("arrayBuffer" in comprovativo) || comprovativo.size === 0) {
    return errorRedirect(base, "comprovativo-ausente");
  }

  if (!env.RESEND_API_KEY) {
    return new Response(
      "O envio de email ainda não está configurado. Contacte info@voxlaci.com diretamente.",
      { status: 500 }
    );
  }

  // ── Preparar anexos ───────────────────────────────────────────────────
  const attachments = [];

  // Fotografia do candidato
  const fotoBuffer = await fotografia.arrayBuffer();
  attachments.push({
    filename: `foto-${sanitizeFilename(nome)}.${extFromMime(fotografia.type, fotoName)}`,
    content: toBase64(fotoBuffer),
  });

  // Comprovativo de pagamento (obrigatório — já validado acima)
  const comprovanteBuffer = await comprovativo.arrayBuffer();
  attachments.push({
    filename: comprovativo.name || `comprovativo-${sanitizeFilename(nome)}`,
    content: toBase64(comprovanteBuffer),
  });

  // ── Corpo do email ────────────────────────────────────────────────────
  const resumo = `
    <h2>Novo casting VoxLaci</h2>
    <p><b>Nome:</b> ${esc(nome)}</p>
    <p><b>Idade:</b> ${esc(idade)}</p>
    <p><b>País:</b> ${esc(pais)}</p>
    <p><b>Telefone:</b> ${esc(telefone)}</p>
    <p><b>Email:</b> ${esc(email)}</p>
    <p><b>Morada:</b> ${esc(morada)}</p>
    <p><b>Ensemble de interesse:</b> ${esc(ensemble)}</p>
    <p><b>Já cantou num coro?:</b> ${esc(experiencia)}</p>
    <p><b>Sabe ler música?:</b> ${esc(leituraMusical)}</p>
    <p><b>Como conheceu a VoxLaci?:</b> ${esc(origem)}</p>
    <p><b>Motivação:</b><br>${esc(motivacao).replace(/\n/g, "<br>")}</p>
    <hr>
    <p><b>Forma de pagamento:</b> ${esc(pagamentoMetodo)}</p>
    <p><b>Nome usado no pagamento:</b> ${esc(nomePagamento)}</p>
    <p><i>Fotografia de candidato incluída em anexo.</i></p>
  `;

  const from = env.FROM_EMAIL || "VoxLaci <casting@voxlaci.com>";

  try {
    await sendEmail(env.RESEND_API_KEY, {
      from,
      to: ["info@voxlaci.com"],
      reply_to: email,
      subject: `Casting — ${nome}`,
      html: resumo,
      attachments,
    });

    await sendEmail(env.RESEND_API_KEY, {
      from,
      to: [email],
      subject: "Casting VoxLaci — recebemos a tua candidatura",
      html: `
        <p>Olá ${esc(nome)},</p>
        <p>Recebemos o teu casting. A equipa VoxLaci entrará em contacto para indicar o próximo passo.</p>
        ${resumo}
      `,
      attachments,
    });
  } catch (err) {
    console.error("Erro ao enviar email do casting:", err);
    return new Response(
      "Não foi possível enviar o casting. Tente novamente ou contacte info@voxlaci.com diretamente.",
      { status: 502 }
    );
  }

  return Response.redirect(new URL("/obrigado.html", base), 303);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function sendEmail(apiKey, payload) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

function sanitize(value) {
  return (value || "").toString().trim().slice(0, 2000);
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9\-_]/g, "-").slice(0, 40).toLowerCase();
}

function extFromMime(mime, filename) {
  const mimeMap = { "image/jpeg": "jpg", "image/jpg": "jpg", "image/png": "png", "image/webp": "webp" };
  if (mimeMap[mime]) return mimeMap[mime];
  const m = filename.match(/\.(jpg|jpeg|png|webp)$/i);
  return m ? m[1] : "jpg";
}

function toBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}
