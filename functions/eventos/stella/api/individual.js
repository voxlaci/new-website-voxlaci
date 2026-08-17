// STELLA 2026 individual singers — interest capture only. No approved pricing yet, so no
// application lifecycle and no payment: just a confirmed, ID'd record and two emails.
import {
  sanitize, sendEmail, FROM, VOXLACI_EMAIL,
  generateIndividualInterestId, individualInterestReceivedEmail, individualInterestInternalEmail,
} from "../../../_shared/stella.js";

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}

const rateLimiter = new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimiter.get(ip);
  if (!entry || now - entry.start > 60 * 60 * 1000) {
    rateLimiter.set(ip, { start: now, count: 1 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

export async function onRequestPost({ request, env }) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (!checkRateLimit(ip)) return json({ ok: false, error: "rate_limit" }, 429);
  if (!env.DB) return json({ ok: false, error: "not_configured" }, 500);

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return json({ ok: false, error: "invalid_request" }, 400);
  }

  if (formData.get("website") || formData.get("campo-secreto")) {
    return json({ ok: true, stellaId: "OK" });
  }

  const language = formData.get("language") === "en" ? "en" : "pt";
  const fullName = sanitize(formData.get("full_name"), 200);
  const email = sanitize(formData.get("email"), 200);
  const country = sanitize(formData.get("country"), 100);
  const phone = sanitize(formData.get("phone"), 60);
  const interests = formData.getAll("interests").map((v) => sanitize(v, 60)).filter(Boolean).join(", ");
  const notes = sanitize(formData.get("notes"), 1000);

  if (!fullName || !email) return json({ ok: false, error: "missing_fields" }, 400);

  const db = env.DB;
  let insertedId;
  try {
    const result = await db
      .prepare(
        `INSERT INTO stella_individual_interest (language, full_name, email, country, phone, interests, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(language, fullName, email, country, phone, interests, notes)
      .run();
    insertedId = result.meta.last_row_id;
  } catch (err) {
    console.error(`[stella] falha ao gravar interesse individual: ${err.message}`);
    return json({ ok: false, error: "db_failed" }, 500);
  }

  const stellaId = await generateIndividualInterestId(db, insertedId);
  const entry = { stella_id: stellaId, full_name: fullName, email, country, phone, interests, notes };

  if (env.RESEND_API_KEY) {
    try {
      const { subject, html } = individualInterestReceivedEmail(language, entry);
      await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [email], reply_to: VOXLACI_EMAIL, subject, html });
    } catch (err) {
      console.error(`[stella] ${stellaId} — email de interesse individual falhou: ${err.message}`);
    }
    try {
      const { subject, html } = individualInterestInternalEmail(entry);
      await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [VOXLACI_EMAIL], reply_to: email, subject, html });
    } catch (err) {
      console.error(`[stella] ${stellaId} — email interno de interesse individual falhou: ${err.message}`);
    }
  }

  return json({ ok: true, stellaId });
}
