import { verifyStripeWebhook } from "../../_shared/stripe.mjs";

export async function onRequestPost({ request, env }) {
  if (!env.DB || !env.STRIPE_WEBHOOK_SECRET) return json({ error: "not_configured" }, 500);
  const rawBody = await request.text();
  const signature = request.headers.get("Stripe-Signature");
  if (!await verifyStripeWebhook(rawBody, signature, env.STRIPE_WEBHOOK_SECRET)) {
    return json({ error: "invalid_signature" }, 400);
  }

  let event;
  try { event = JSON.parse(rawBody); }
  catch { return json({ error: "invalid_json" }, 400); }

  const session = event?.data?.object;
  const supported = new Set([
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
    "checkout.session.async_payment_failed",
    "checkout.session.expired",
  ]);
  if (!supported.has(event.type)) return json({ received: true });
  if (session?.metadata?.tipo !== "casting") return json({ received: true });

  const applicationId = session.metadata.inscricao_id || session.client_reference_id;
  if (!applicationId || session.amount_total !== 2000 || String(session.currency).toLowerCase() !== "eur") {
    return json({ error: "invalid_casting_payment" }, 400);
  }

  const existing = await env.DB.prepare("SELECT event_id FROM casting_stripe_events WHERE event_id = ?")
    .bind(event.id).first();
  if (existing) return json({ received: true, duplicate: true });

  const paid = event.type === "checkout.session.async_payment_succeeded"
    || (event.type === "checkout.session.completed" && session.payment_status === "paid");
  const failed = event.type === "checkout.session.async_payment_failed" || event.type === "checkout.session.expired";

  const statements = [env.DB.prepare(`INSERT INTO casting_stripe_events
    (event_id, event_type, checkout_session_id, application_id) VALUES (?, ?, ?, ?)`)
    .bind(event.id, event.type, session.id || null, applicationId)];

  if (paid) {
    statements.push(env.DB.prepare(`UPDATE casting_applications
      SET status = 'paid', payment_label = 'PAGO / Casting pago', stripe_payment_intent_id = ?,
          paid_at = COALESCE(paid_at, datetime('now')), updated_at = datetime('now')
      WHERE id = ? AND stripe_checkout_session_id = ?`)
      .bind(session.payment_intent || null, applicationId, session.id));
  } else if (failed) {
    statements.push(env.DB.prepare(`UPDATE casting_applications
      SET status = 'payment_pending', payment_label = 'Pagamento pendente', updated_at = datetime('now')
      WHERE id = ? AND stripe_checkout_session_id = ? AND status != 'paid'`)
      .bind(applicationId, session.id));
  }
  await env.DB.batch(statements);
  console.info(JSON.stringify({ scope: "casting_webhook", event: event.id, type: event.type, applicationId, paid }));
  return json({ received: true });
}

export function onRequestGet() {
  return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
}

function json(value, status = 200) {
  return new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
}
