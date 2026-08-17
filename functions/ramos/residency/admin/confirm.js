// Access-gated. Confirms a registration, emails the participant, and — exactly once —
// notifies the Seminário with accommodation-only details (no financial data).
import {
  FROM, VOXLACI_EMAIL, SEMINARIO_EMAIL,
  sendEmail, confirmedEmail, seminarioEmail,
} from "../../../_shared/ramos-residency.js";

export async function onRequestPost({ request, env }) {
  const actor = request.headers.get("Cf-Access-Authenticated-User-Email") || "unknown-admin";
  if (!env.DB || !env.RESEND_API_KEY) {
    return json({ ok: false, error: "not_configured" }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_request" }, 400);
  }
  const id = Number(body.id);
  if (!id) return json({ ok: false, error: "missing_id" }, 400);

  const reg = await env.DB.prepare("SELECT * FROM residency_registrations WHERE id = ?").bind(id).first();
  if (!reg) return json({ ok: false, error: "not_found" }, 404);

  await env.DB
    .prepare("UPDATE residency_registrations SET status = 'confirmed', updated_at = datetime('now') WHERE id = ?")
    .bind(id)
    .run();
  console.info(`[residency] ${reg.reference} — CONFIRMADO por ${actor}`);

  try {
    const { subject, html } = confirmedEmail(reg.language, reg);
    await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [reg.email], reply_to: VOXLACI_EMAIL, subject, html });
  } catch (err) {
    console.error(`[residency] ${reg.reference} — email de confirmação ao participante falhou: ${err.message}`);
  }

  if (!reg.seminario_email_sent_at) {
    try {
      const { subject, html } = seminarioEmail(reg);
      await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [SEMINARIO_EMAIL], reply_to: VOXLACI_EMAIL, subject, html });
      await env.DB
        .prepare("UPDATE residency_registrations SET seminario_email_sent_at = datetime('now') WHERE id = ?")
        .bind(id)
        .run();
      console.info(`[residency] ${reg.reference} — email ao Seminário enviado por confirmação de ${actor}`);
    } catch (err) {
      console.error(`[residency] ${reg.reference} — email ao Seminário falhou: ${err.message}`);
    }
  } else {
    console.info(`[residency] ${reg.reference} — email ao Seminário já tinha sido enviado, não reenviado`);
  }

  return json({ ok: true });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}
