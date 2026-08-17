// Access-gated (see /eventos/stella/admin/index.html + Cloudflare Access policy on /eventos/stella/admin*).
export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ ok: false, error: "not_configured" }, 500);

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const type = url.searchParams.get("type");

  let sql = `SELECT * FROM stella_applications WHERE 1=1`;
  const binds = [];
  if (status) { sql += " AND status = ?"; binds.push(status); }
  if (type) { sql += " AND application_type = ?"; binds.push(type); }
  sql += " ORDER BY created_at DESC";

  const { results } = await env.DB.prepare(sql).bind(...binds).all();
  return json({ ok: true, applications: results });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
}
