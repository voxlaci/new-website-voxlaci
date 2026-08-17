// Access-gated. Confirms or rejects a submitted proof of payment for one ramos_individual_payments row.
import { FROM, VOXLACI_EMAIL, sendEmail, paymentConfirmedEmail } from "../../../_shared/ramos-individual.js";

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

  const payment = await env.DB.prepare("SELECT * FROM ramos_individual_payments WHERE id = ?").bind(paymentId).first();
  if (!payment) return json({ ok: false, error: "not_found" }, 404);
  if (payment.status !== "submitted") return json({ ok: false, error: "already_processed" }, 409);

  if (action === "reject") {
    await env.DB.prepare("UPDATE ramos_individual_payments SET status = 'rejected' WHERE id = ?").bind(paymentId).run();
    console.info(`[ramos-individual] pagamento #${paymentId} REJEITADO por ${actor}`);
    return json({ ok: true });
  }

  const app = await env.DB.prepare("SELECT * FROM ramos_individual_applications WHERE id = ?").bind(payment.application_id).first();
  if (!app) return json({ ok: false, error: "not_found" }, 404);

  const newPaidCents = app.amount_paid_cents + payment.amount_cents;
  let newStatus = app.status;
  if (newPaidCents >= app.amount_total_cents) newStatus = "paid";
  else if (newPaidCents > 0 && ["accepted", "payment_pending"].includes(app.status)) newStatus = "partially_paid";

  await env.DB.batch([
    env.DB.prepare("UPDATE ramos_individual_payments SET status = 'confirmed' WHERE id = ?").bind(paymentId),
    env.DB.prepare("UPDATE ramos_individual_applications SET amount_paid_cents = ?, status = ?, updated_at = datetime('now') WHERE id = ?")
      .bind(newPaidCents, newStatus, app.id),
  ]);
  console.info(`[ramos-individual] ${app.ramos_id} — pagamento #${paymentId} de ${(payment.amount_cents / 100).toFixed(2)} € confirmado por ${actor} (estado: ${newStatus})`);

  if (env.RESEND_API_KEY) {
    try {
      const updatedApp = { ...app, amount_paid_cents: newPaidCents, status: newStatus };
      const { subject, html } = paymentConfirmedEmail(app.language, updatedApp, payment.amount_cents);
      await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [app.email], reply_to: VOXLACI_EMAIL, subject, html });
    } catch (err) {
      console.error(`[ramos-individual] ${app.ramos_id} — email de confirmação de pagamento falhou: ${err.message}`);
    }
  }

  return json({ ok: true, status: newStatus, amountPaidCents: newPaidCents });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}
