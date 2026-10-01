export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ error: "not_configured" }, 500);
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || "";
  const token = url.searchParams.get("token") || "";
  if (!id || !token) return json({ error: "invalid_request" }, 400);
  const application = await env.DB.prepare(`SELECT id, full_name, status, payment_label, amount_cents, currency, paid_at
    FROM casting_applications WHERE id = ? AND private_token = ?`).bind(id, token).first();
  if (!application) return json({ error: "not_found" }, 404);
  return json({
    id: application.id,
    name: application.full_name,
    status: application.status,
    label: application.payment_label,
    amount: application.amount_cents,
    currency: application.currency,
    paidAt: application.paid_at,
  });
}

function json(value, status = 200) {
  return new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
}
