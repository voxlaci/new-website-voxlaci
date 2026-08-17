// Access-gated (see /eventos/voxpop/admin/index.html + Cloudflare Access policy on /eventos/voxpop/admin*).
export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ ok: false, error: "not_configured" }, 500);
  const type = new URL(request.url).searchParams.get("type") || "registrations";

  if (type === "proposals") {
    const { results } = await env.DB.prepare("SELECT * FROM voxpop_city_proposals ORDER BY created_at DESC").all();
    return json({ ok: true, proposals: results });
  }

  const { results } = await env.DB.prepare("SELECT * FROM voxpop_registrations ORDER BY created_at DESC").all();
  return json({ ok: true, registrations: results });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
}
