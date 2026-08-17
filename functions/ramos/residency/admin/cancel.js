// Access-gated. Cancels a registration and releases its room hold.
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

  const reg = await env.DB.prepare("SELECT reference FROM residency_registrations WHERE id = ?").bind(id).first();
  if (!reg) return json({ ok: false, error: "not_found" }, 404);

  await env.DB
    .prepare("UPDATE residency_registrations SET status = 'cancelled', updated_at = datetime('now') WHERE id = ?")
    .bind(id)
    .run();
  console.info(`[residency] ${reg.reference} — CANCELADO por ${actor}, quarto libertado`);

  return json({ ok: true });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}
