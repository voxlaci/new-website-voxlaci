import { castingCheckoutEntries, stripeRequest } from "./_shared/stripe.mjs";

const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const rateLimiter = new Map();
const FROM = "VoxLaci <info@voxlaci.com>";

export async function onRequestGet({ request }) {
  return Response.redirect(new URL("/#inscricao", request.url), 303);
}

export async function onRequestPost({ request, env }) {
  const base = new URL(request.url);
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (!checkRateLimit(ip)) return errorRedirect(base, "rate");
  if (!env.DB || !env.STRIPE_SECRET_KEY) return errorRedirect(base, "configuracao");

  let formData;
  try { formData = await request.formData(); }
  catch { return new Response("Pedido inválido.", { status: 400 }); }
  if (formData.get("website") || formData.get("campo-secreto")) return Response.redirect(new URL("/", base), 303);
  if (!await verifyTurnstile(formData, env, ip)) return errorRedirect(base, "captcha");

  const application = {
    id: createApplicationId(), privateToken: crypto.randomUUID(),
    name: clean(formData.get("nome"), 200), age: clean(formData.get("idade"), 40),
    country: clean(formData.get("pais"), 100), telephone: clean(formData.get("telefone"), 80),
    email: clean(formData.get("email"), 254).toLowerCase(), address: clean(formData.get("morada"), 400),
    ensemble: clean(formData.get("ensemble"), 160), experience: clean(formData.get("experiencia"), 2000),
    musicReading: clean(formData.get("leitura-musical"), 100), source: clean(formData.get("origem"), 200),
    recommendation: clean(formData.get("recomendacao"), 200), motivation: clean(formData.get("motivacao"), 2000),
    language: detectLanguage(formData, request),
  };
  if (!application.name || !application.age || !application.telephone || !validEmail(application.email)) {
    return errorRedirect(base, "campos-obrigatorios");
  }

  await env.DB.prepare(`INSERT INTO casting_applications
    (id, private_token, full_name, age, country, telephone, email, address, ensemble, experience,
     music_reading, source, recommendation, motivation, language, status, payment_label, amount_cents, currency)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'payment_pending', 'Pagamento pendente', 2000, 'eur')`
  ).bind(application.id, application.privateToken, application.name, application.age, application.country,
    application.telephone, application.email, application.address, application.ensemble, application.experience,
    application.musicReading, application.source, application.recommendation, application.motivation,
    application.language).run();

  let checkout;
  try {
    checkout = await stripeRequest(env.STRIPE_SECRET_KEY, "/checkout/sessions", castingCheckoutEntries({
      applicationId: application.id, privateToken: application.privateToken, name: application.name,
      email: application.email, ensemble: application.ensemble, language: application.language, origin: base.origin,
    }));
    const checkoutPrefix = /^(sk|rk)_live_/.test(env.STRIPE_SECRET_KEY) ? "cs_live_" : "cs_test_";
    if (!checkout.id?.startsWith(checkoutPrefix) || !checkout.url || checkout.mode !== "payment") {
      throw new Error("Stripe did not return a one-time Checkout Session for the configured mode.");
    }
    await env.DB.prepare(`UPDATE casting_applications SET stripe_checkout_session_id = ?, updated_at = datetime('now') WHERE id = ?`)
      .bind(checkout.id, application.id).run();
  } catch (error) {
    console.error(JSON.stringify({ scope: "casting", id: application.id, error: "checkout_creation_failed", detail: error.message }));
    return errorRedirect(base, "pagamento-indisponivel");
  }

  if (env.RESEND_API_KEY) {
    await sendCastingEmails(env.RESEND_API_KEY, application, checkout.url).catch((error) => {
      console.error(JSON.stringify({ scope: "casting", id: application.id, error: "email_failed", detail: error.message }));
    });
  }
  console.info(JSON.stringify({ scope: "casting", id: application.id, status: "payment_pending", checkout: checkout.id }));
  return Response.redirect(checkout.url, 303);
}

function createApplicationId() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `CAST-${date}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}
function detectLanguage(formData, request) {
  const explicit = clean(formData.get("idioma"), 10).toLowerCase();
  if (["pt", "en"].includes(explicit)) return explicit;
  return (request.headers.get("Referer") || "").includes("/en/") ? "en" : "pt";
}
async function verifyTurnstile(formData, env, ip) {
  if (env.CASTING_TEST_MODE === "true") return true;
  const token = formData.get("cf-turnstile-response");
  if (!token) return false;
  if (!env.TURNSTILE_SECRET_KEY) return true;
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: String(token), remoteip: ip }),
  });
  return (await response.json().catch(() => ({}))).success === true;
}
async function sendCastingEmails(apiKey, application, checkoutUrl) {
  const rows = [["ID da inscrição", application.id], ["Nome", application.name], ["Email", application.email],
    ["Telefone", application.telephone], ["Idade", application.age], ["País", application.country],
    ["Morada", application.address], ["Grupo/coro", application.ensemble], ["Experiência", application.experience],
    ["Leitura musical", application.musicReading], ["Origem", application.source],
    ["Recomendação", application.recommendation], ["Motivação", application.motivation],
    ["Pagamento", "Pagamento pendente · Stripe Checkout · 20,00 EUR"]]
    .map(([label, value]) => `<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:700">${esc(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(value || "—")}</td></tr>`).join("");
  const common = `<table style="width:100%;border-collapse:collapse">${rows}</table><p><a href="${esc(checkoutUrl)}">Concluir pagamento seguro de 20 €</a></p><p>O casting só será marcado como pago depois da confirmação segura do Stripe.</p>`;
  await sendEmail(apiKey, { from: FROM, to: ["info@voxlaci.com"], reply_to: application.email,
    subject: `[VoxLaci] Novo Casting · pagamento pendente (${application.id})`, html: common });
  await sendEmail(apiKey, { from: FROM, to: [application.email], reply_to: "info@voxlaci.com",
    subject: `[VoxLaci] Casting recebido · pagamento pendente (${application.id})`,
    html: `<p>Olá, ${esc(application.name)}.</p><p>Recebemos a sua inscrição.</p>${common}` });
}
async function sendEmail(apiKey, payload) {
  const response = await fetch("https://api.resend.com/emails", { method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  if (!response.ok) throw new Error(`Resend HTTP ${response.status}`);
}
function checkRateLimit(ip) {
  const now = Date.now(); const current = rateLimiter.get(ip);
  if (!current || now - current.start > RATE_WINDOW_MS) { rateLimiter.set(ip, { start: now, count: 1 }); return true; }
  if (current.count >= RATE_LIMIT) return false;
  current.count += 1; return true;
}
function errorRedirect(base, code) { return Response.redirect(new URL(`/#inscricao?erro=${code}`, base), 303); }
function clean(value, limit) { return String(value || "").trim().slice(0, limit); }
function validEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function esc(value) { return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
