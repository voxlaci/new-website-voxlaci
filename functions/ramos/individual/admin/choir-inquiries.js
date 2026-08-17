// Access-gated. List/update RAMOS choir participation inquiries (no payment lifecycle — just a status flag).
export async function onRequestGet({ env }) {
  if (!env.DB) return json({ ok: false, error: "not_configured" }, 500);
  const { results } = await env.DB.prepare("SELECT * FROM ramos_choir_inquiries ORDER BY created_at DESC").all();
  return json({ ok: true, inquiries: results });
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
  const id = Number(body.id);
  const status = body.status;
  if (!id || !["received", "contacted", "closed"].includes(status)) return json({ ok: false, error: "invalid_request" }, 400);

  await env.DB.prepare("UPDATE ramos_choir_inquiries SET status = ? WHERE id = ?").bind(status, id).run();
  console.info(`[ramos-choir] inquérito #${id} — estado alterado para ${status} por ${actor}`);
  return json({ ok: true });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
}
