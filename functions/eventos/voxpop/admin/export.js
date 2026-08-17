// Access-gated. CSV export of voX±Pop registrations or city proposals.
function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escapeCell = (v) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => escapeCell(r[h])).join(","))].join("\n");
}

export async function onRequestGet({ request, env }) {
  if (!env.DB) return new Response("Not configured", { status: 500 });
  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "registrations";

  let rows, filename;
  if (type === "proposals") {
    const { results } = await env.DB.prepare("SELECT * FROM voxpop_city_proposals ORDER BY created_at DESC").all();
    rows = results;
    filename = "voxpop-city-proposals.csv";
  } else {
    const editionSlug = url.searchParams.get("edition");
    const status = url.searchParams.get("status");
    let sql = `SELECT r.*, e.slug AS edition_slug, e.city AS edition_city
               FROM voxpop_registrations r LEFT JOIN voxpop_editions e ON e.id = r.edition_id WHERE 1=1`;
    const binds = [];
    if (editionSlug) { sql += " AND e.slug = ?"; binds.push(editionSlug); }
    if (status) { sql += " AND r.status = ?"; binds.push(status); }
    sql += " ORDER BY r.created_at DESC";
    const { results } = await env.DB.prepare(sql).bind(...binds).all();
    rows = results;
    filename = `voxpop-registrations${editionSlug ? "-" + editionSlug : ""}${status ? "-" + status : ""}.csv`;
  }

  // UTF-8 BOM so Excel opens accented PT characters correctly.
  return new Response("﻿" + toCsv(rows || []), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
