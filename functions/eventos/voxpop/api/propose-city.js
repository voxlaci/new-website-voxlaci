// voX±Pop — "Bring voX±Pop to your city" proposal form.
import {
  sanitize, sendEmail, FROM, VOXLACI_EMAIL,
  generateProposalId, proposalReceivedEmail, proposalInternalEmail,
} from "../../../_shared/voxpop.js";

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
    return json({ ok: true, voxpopId: "OK" });
  }

  const language = formData.get("language") === "en" ? "en" : "pt";
  const fullName = sanitize(formData.get("full_name"), 200);
  const email = sanitize(formData.get("email"), 200);
  const city = sanitize(formData.get("city"), 100);
  if (!fullName || !email || !city) return json({ ok: false, error: "missing_fields" }, 400);

  const organisation = sanitize(formData.get("organisation"), 200);
  const role = sanitize(formData.get("role"), 100);
  const country = sanitize(formData.get("country"), 100);
  const whatsapp = sanitize(formData.get("whatsapp"), 60);
  const message = sanitize(formData.get("message"), 2000);

  const db = env.DB;
  let insertedId;
  try {
    const result = await db
      .prepare(
        `INSERT INTO voxpop_city_proposals (full_name, organisation, role, city, country, email, whatsapp, message)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(fullName, organisation, role, city, country, email, whatsapp, message)
      .run();
    insertedId = result.meta.last_row_id;
  } catch (err) {
    console.error(`[voxpop] falha ao gravar proposta de cidade: ${err.message}`);
    return json({ ok: false, error: "db_failed" }, 500);
  }

  const voxpopId = await generateProposalId(db, insertedId);
  console.info(`[voxpop] ${voxpopId} — proposta de cidade criada · cidade=${city} · nome=${fullName} · IP=${ip}`);

  const proposal = { voxpop_id: voxpopId, full_name: fullName, organisation, role, city, country, email, whatsapp, message };

  if (env.RESEND_API_KEY) {
    try {
      const { subject, html } = proposalReceivedEmail(language, proposal);
      await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [email], reply_to: VOXLACI_EMAIL, subject, html });
    } catch (err) {
      console.error(`[voxpop] ${voxpopId} — email de proposta falhou: ${err.message}`);
    }
    try {
      const { subject, html } = proposalInternalEmail(proposal);
      await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [VOXLACI_EMAIL], reply_to: email, subject, html });
    } catch (err) {
      console.error(`[voxpop] ${voxpopId} — email interno de proposta falhou: ${err.message}`);
    }
  }

  return json({ ok: true, voxpopId });
}
