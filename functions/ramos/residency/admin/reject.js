// Access-gated. Rejects a submitted proof of payment: releases the room hold
// (status leaves the "held" set) and asks the participant for a new proof.
import { FROM, VOXLACI_EMAIL, sendEmail, rejectedEmail } from "../../../_shared/ramos-residency.js";

export async function onRequestPost({ request, env }) {
  const actor = request.headers.get("Cf-Access-Authenticated-User-Email") || "unknown-admin";
  if (!env.DB) return json({ ok: false, error: "not_configured" }, 500);

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
    .prepare("UPDATE residency_registrations SET status = 'pending_payment', updated_at = datetime('now') WHERE id = ?")
    .bind(id)
    .run();
  console.info(`[residency] ${reg.reference} — comprovativo REJEITADO por ${actor}, quarto libertado`);

  if (env.RESEND_API_KEY) {
    try {
      const { subject, html } = rejectedEmail(reg.language, reg.reference);
      await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [reg.email], reply_to: VOXLACI_EMAIL, subject, html });
    } catch (err) {
      console.error(`[residency] ${reg.reference} — email de rejeição falhou: ${err.message}`);
    }
  }

  return json({ ok: true });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}
