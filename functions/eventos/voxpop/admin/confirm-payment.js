// Access-gated. Confirms or rejects a submitted proof of payment. Does NOT itself confirm the
// registration/occupy a seat — that is always a separate, explicit admin action via
// update-status.js, so a payment being validated never silently reserves capacity.
import { FROM, VOXLACI_EMAIL, sendEmail, paymentReceivedEmail } from "../../../_shared/voxpop.js";

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}

export async function onRequestPost({ request, env }) {
  const actor = request.headers.get("Cf-Access-Authenticated-User-Email") || "unknown-admin";
  if (!env.DB) return json({ ok: false, error: "not_configured" }, 500);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_request" }, 400);
  }
  const paymentId = Number(body.payment_id);
  const action = body.action === "reject" ? "reject" : "confirm";
  if (!paymentId) return json({ ok: false, error: "missing_id" }, 400);

  const payment = await env.DB.prepare("SELECT * FROM voxpop_payments WHERE id = ?").bind(paymentId).first();
  if (!payment) return json({ ok: false, error: "not_found" }, 404);
  if (payment.status !== "submitted") return json({ ok: false, error: "already_processed" }, 409);

  if (action === "reject") {
    await env.DB.prepare("UPDATE voxpop_payments SET status = 'rejected' WHERE id = ?").bind(paymentId).run();
    console.info(`[voxpop] pagamento #${paymentId} REJEITADO por ${actor}`);
    return json({ ok: true });
  }

  const reg = await env.DB.prepare("SELECT * FROM voxpop_registrations WHERE id = ?").bind(payment.registration_id).first();
  if (!reg) return json({ ok: false, error: "not_found" }, 404);
  const edition = await env.DB.prepare("SELECT * FROM voxpop_editions WHERE id = ?").bind(reg.edition_id).first();

  const newPaidCents = (reg.amount_paid_cents || 0) + payment.amount_cents;
  await env.DB.batch([
    env.DB.prepare("UPDATE voxpop_payments SET status = 'confirmed' WHERE id = ?").bind(paymentId),
    env.DB.prepare("UPDATE voxpop_registrations SET amount_paid_cents = ?, updated_at = datetime('now') WHERE id = ?").bind(newPaidCents, reg.id),
  ]);
  console.info(`[voxpop] ${reg.voxpop_id} — pagamento #${paymentId} de ${(payment.amount_cents / 100).toFixed(2)} € confirmado por ${actor}`);

  if (env.RESEND_API_KEY && edition) {
    try {
      const { subject, html } = paymentReceivedEmail(reg.language, reg, edition, payment.amount_cents);
      await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [reg.email], reply_to: VOXLACI_EMAIL, subject, html });
    } catch (err) {
      console.error(`[voxpop] ${reg.voxpop_id} — email de pagamento confirmado falhou: ${err.message}`);
    }
  }

  return json({ ok: true, amountPaidCents: newPaidCents });
}
