// Access-gated (see /ramos/individual/admin/index.html + Cloudflare Access policy on /ramos/individual/admin*).
export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ ok: false, error: "not_configured" }, 500);
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const track = url.searchParams.get("track");

  let sql = "SELECT * FROM ramos_individual_applications WHERE 1=1";
  const binds = [];
  if (status) { sql += " AND status = ?"; binds.push(status); }
  if (track) { sql += " AND track = ?"; binds.push(track); }
  sql += " ORDER BY created_at DESC";

  const { results } = await env.DB.prepare(sql).bind(...binds).all();
  return json({ ok: true, applications: results });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
}
