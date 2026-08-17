import {
  TOTAL_ROOMS, PRICE_SINGLE_CENTS, PRICE_SHARED_CENTS, HELD_STATUSES,
  FROM, VOXLACI_EMAIL,
  sanitize, sendEmail, generateReference, validateProofFile, randomKey,
  submittedEmail, internalNotificationEmail,
} from "../../../_shared/ramos-residency.js";

export async function onRequestGet({ request }) {
  return Response.redirect(new URL("/ramos/residencia-artistica/", request.url), 303);
}

// Rate limiter em memória por instância (mesmo padrão de functions/enviar-casting.js;
// para maior robustez, considerar migrar para KV no futuro).
const rateLimiter = new Map();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

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

function jsonError(code, status = 400) {
  return new Response(JSON.stringify({ ok: false, error: code }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const base = new URL(request.url);
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";

  if (!checkRateLimit(ip)) {
    console.warn(`[residency] rate-limit atingido — IP: ${ip}`);
    return jsonError("rate_limit", 429);
  }

  if (!env.DB) {
    console.error("[residency] binding D1 'DB' em falta");
    return jsonError("not_configured", 500);
  }
  if (!env.RESIDENCY_PROOFS) {
    console.error("[residency] binding R2 'RESIDENCY_PROOFS' em falta");
    return jsonError("not_configured", 500);
  }
  if (!env.RESEND_API_KEY) {
    console.error("[residency] RESEND_API_KEY em falta");
    return jsonError("not_configured", 500);
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("invalid_request", 400);
  }

  // Honeypot
  if (formData.get("website") || formData.get("campo-secreto")) {
    console.info(`[residency] honeypot ativado — IP: ${ip}`);
    return new Response(JSON.stringify({ ok: true, reference: "OK" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Turnstile (mesmo padrão de functions/enviar-casting.js)
  const turnstileToken = formData.get("cf-turnstile-response");
  const secretKey = env.TURNSTILE_SECRET_KEY;
  if (secretKey) {
    if (!turnstileToken) return jsonError("captcha", 400);
    const tsResult = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: secretKey, response: turnstileToken, remoteip: ip }),
    });
    const tsJson = await tsResult.json();
    if (!tsJson.success) return jsonError("captcha", 400);
  }

  const language = formData.get("language") === "en" ? "en" : "pt";
  const fullName = sanitize(formData.get("full_name"), 200);
  const email = sanitize(formData.get("email"), 200);
  const country = sanitize(formData.get("country"), 100);
  const mobile = sanitize(formData.get("mobile"), 60);
  const choirInstitution = sanitize(formData.get("choir_institution"), 200);
  const role = sanitize(formData.get("role"), 60);
  const roomType = formData.get("room_type") === "shared" ? "shared" : "single";
  const shareKnownRaw = formData.get("share_known");
  const shareKnown = roomType === "shared" ? (shareKnownRaw === "yes" ? 1 : 0) : null;
  const shareNames = shareKnown === 1 ? sanitize(formData.get("share_names"), 300) : "";
  const paymentMethod = sanitize(formData.get("payment_method"), 30);

  if (!fullName || !email || !mobile || !role) return jsonError("missing_fields", 400);
  if (!["single", "shared"].includes(roomType)) return jsonError("invalid_room", 400);
  if (!["bank_transfer", "paypal", "revolut"].includes(paymentMethod)) return jsonError("invalid_payment_method", 400);
  if (roomType === "shared" && shareKnown === 1 && !shareNames) return jsonError("missing_share_names", 400);

  // Proof of payment is mandatory for every manually-verified method today.
  const proofFile = formData.get("proof");
  const validation = await validateProofFile(proofFile);
  if (!validation.ok) return jsonError(`invalid_proof_${validation.reason}`, 400);

  const amountDueCents = roomType === "single" ? PRICE_SINGLE_CENTS : PRICE_SHARED_CENTS;
  const db = env.DB;

  // Refuse if the residency is already at capacity.
  const placeholders = HELD_STATUSES.map(() => "?").join(",");
  const { count } = await db
    .prepare(`SELECT COUNT(*) AS count FROM residency_registrations WHERE status IN (${placeholders})`)
    .bind(...HELD_STATUSES)
    .first();
  if (count >= TOTAL_ROOMS) {
    console.warn(`[residency] residência esgotada — tentativa de inscrição recusada`);
    return jsonError("sold_out", 409);
  }

  const reference = await generateReference(db);
  const key = randomKey(reference, validation.ext);

  try {
    await env.RESIDENCY_PROOFS.put(key, proofFile.stream(), {
      httpMetadata: { contentType: proofFile.type || "application/octet-stream" },
    });
  } catch (err) {
    console.error(`[residency] ${reference} — falha ao guardar comprovativo no R2: ${err.message}`);
    return jsonError("upload_failed", 500);
  }

  try {
    await db
      .prepare(
        `INSERT INTO residency_registrations
         (reference, language, full_name, email, country, mobile, choir_institution, role,
          room_type, amount_due_cents, share_known, share_names, payment_method,
          proof_key, proof_original_filename, proof_mime, proof_size, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'payment_submitted')`
      )
      .bind(
        reference, language, fullName, email, country, mobile, choirInstitution, role,
        roomType, amountDueCents, shareKnown, shareNames, paymentMethod,
        key, proofFile.name || null, proofFile.type || null, proofFile.size
      )
      .run();
  } catch (err) {
    console.error(`[residency] ${reference} — falha ao gravar inscrição na D1: ${err.message}`);
    // Best-effort cleanup of the orphaned upload.
    await env.RESIDENCY_PROOFS.delete(key).catch(() => {});
    return jsonError("db_failed", 500);
  }

  console.info(`[residency] ${reference} — inscrição criada · nome=${fullName} · email=${email} · quarto=${roomType} · pagamento=${paymentMethod} · IP=${ip}`);

  const reg = {
    reference, full_name: fullName, email, room_type: roomType,
    amount_due_cents: amountDueCents, payment_method: paymentMethod,
    share_known: shareKnown, share_names: shareNames, status: "payment_submitted",
  };

  // Participant email — non-blocking; the registration is already saved.
  try {
    const { subject, html } = submittedEmail(language, reference);
    await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [email], reply_to: VOXLACI_EMAIL, subject, html });
  } catch (err) {
    console.error(`[residency] ${reference} — email ao participante falhou: ${err.message}`);
  }

  // Internal VoxLaci notification — non-blocking.
  try {
    const adminUrl = new URL("/ramos/residency/admin/", base).toString();
    const { subject, html } = internalNotificationEmail(reg, adminUrl);
    await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [VOXLACI_EMAIL], reply_to: email, subject, html });
  } catch (err) {
    console.error(`[residency] ${reference} — email interno falhou: ${err.message}`);
  }

  return new Response(JSON.stringify({ ok: true, reference }), {
    headers: { "Content-Type": "application/json" },
  });
}
