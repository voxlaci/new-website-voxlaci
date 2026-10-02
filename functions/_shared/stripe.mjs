const encoder = new TextEncoder();

export function stripeFormBody(entries) {
  const body = new URLSearchParams();
  for (const [key, value] of entries) {
    if (value !== undefined && value !== null && value !== "") body.append(key, String(value));
  }
  return body;
}

export async function stripeRequest(secretKey, path, entries) {
  if (!secretKey || !/^(sk|rk)_(test|live)_/.test(secretKey)) {
    throw new Error("A valid Stripe secret key is not configured.");
  }
  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": "2025-06-30.basil",
    },
    body: stripeFormBody(entries),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Stripe HTTP ${response.status}: ${payload?.error?.message || "unknown error"}`);
  }
  return payload;
}

function parseStripeSignature(header) {
  const values = { t: null, v1: [] };
  for (const part of String(header || "").split(",")) {
    const separator = part.indexOf("=");
    if (separator < 1) continue;
    const key = part.slice(0, separator);
    const value = part.slice(separator + 1);
    if (key === "t") values.t = value;
    if (key === "v1") values.v1.push(value);
  }
  return values;
}

function hexToBytes(hex) {
  if (!/^[a-f0-9]{64}$/i.test(hex)) return null;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

export async function verifyStripeWebhook(rawBody, signatureHeader, endpointSecret, nowSeconds = Math.floor(Date.now() / 1000)) {
  if (!endpointSecret || !endpointSecret.startsWith("whsec_")) return false;
  const { t, v1 } = parseStripeSignature(signatureHeader);
  const timestamp = Number(t);
  if (!Number.isFinite(timestamp) || Math.abs(nowSeconds - timestamp) > 300 || v1.length === 0) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(endpointSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const signedPayload = encoder.encode(`${t}.${rawBody}`);
  for (const signature of v1) {
    const bytes = hexToBytes(signature);
    if (bytes && await crypto.subtle.verify("HMAC", key, bytes, signedPayload)) return true;
  }
  return false;
}

export function castingCheckoutEntries({ applicationId, privateToken, name, email, ensemble, language, origin }) {
  const metadata = [
    ["metadata[inscricao_id]", applicationId],
    ["metadata[nome]", name],
    ["metadata[email]", email],
    ["metadata[grupo]", ensemble || "nao_indicado"],
    ["metadata[tipo]", "casting"],
    ["payment_intent_data[metadata][inscricao_id]", applicationId],
    ["payment_intent_data[metadata][nome]", name],
    ["payment_intent_data[metadata][email]", email],
    ["payment_intent_data[metadata][grupo]", ensemble || "nao_indicado"],
    ["payment_intent_data[metadata][tipo]", "casting"],
  ];
  return [
    ["mode", "payment"],
    ["payment_method_types[0]", "card"],
    ["payment_method_types[1]", "mb_way"],
    ["wallet_options[link][display]", "never"],
    ["client_reference_id", applicationId],
    ["customer_email", email],
    ["locale", language === "en" ? "en" : "pt"],
    ["line_items[0][quantity]", "1"],
    ["line_items[0][price_data][currency]", "eur"],
    ["line_items[0][price_data][unit_amount]", "2000"],
    ["line_items[0][price_data][product_data][name]", "Casting VoxLaci"],
    ["line_items[0][price_data][product_data][description]", "Inscrição no Casting VoxLaci · pagamento único"],
    ["success_url", `${origin}/casting-pagamento.html?id=${encodeURIComponent(applicationId)}&token=${encodeURIComponent(privateToken)}&session_id={CHECKOUT_SESSION_ID}`],
    ["cancel_url", `${origin}/casting-pagamento.html?id=${encodeURIComponent(applicationId)}&token=${encodeURIComponent(privateToken)}&cancelled=1`],
    ...metadata,
  ];
}
