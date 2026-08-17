// Access-gated. Lists payments for one application (confirm/reject happens via confirm-payment.js).
export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ ok: false, error: "not_configured" }, 500);
  const applicationId = Number(new URL(request.url).searchParams.get("application_id"));
  if (!applicationId) return json({ ok: false, error: "missing_id" }, 400);
  const { results } = await env.DB
    .prepare("SELECT id, amount_cents, payment_method, proof_original_filename, status, created_at FROM stella_payments WHERE application_id = ? ORDER BY created_at DESC")
    .bind(applicationId)
    .all();
  return json({ ok: true, payments: results });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
}
