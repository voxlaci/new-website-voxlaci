// Access-gated (see /eventos/voxpop/admin/index.html + Cloudflare Access policy on /eventos/voxpop/admin*).
export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ ok: false, error: "not_configured" }, 500);
  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "registrations";

  if (type === "proposals") {
    const { results } = await env.DB.prepare("SELECT * FROM voxpop_city_proposals ORDER BY created_at DESC").all();
    return json({ ok: true, proposals: results });
  }

  const editionSlug = url.searchParams.get("edition");
  const status = url.searchParams.get("status");
  let sql = `SELECT r.*, e.slug AS edition_slug, e.city AS edition_city
             FROM voxpop_registrations r LEFT JOIN voxpop_editions e ON e.id = r.edition_id WHERE 1=1`;
  const binds = [];
  if (editionSlug) { sql += " AND e.slug = ?"; binds.push(editionSlug); }
  if (status) { sql += " AND r.status = ?"; binds.push(status); }
  sql += " ORDER BY r.created_at DESC";

  const { results } = await env.DB.prepare(sql).bind(...binds).all();
  return json({ ok: true, registrations: results });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
}
