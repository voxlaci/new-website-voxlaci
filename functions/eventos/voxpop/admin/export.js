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
  const type = new URL(request.url).searchParams.get("type") || "registrations";

  let rows, filename;
  if (type === "proposals") {
    const { results } = await env.DB.prepare("SELECT * FROM voxpop_city_proposals ORDER BY created_at DESC").all();
    rows = results;
    filename = "voxpop-city-proposals.csv";
  } else {
    const { results } = await env.DB.prepare("SELECT * FROM voxpop_registrations ORDER BY created_at DESC").all();
    rows = results;
    filename = "voxpop-registrations.csv";
  }

  return new Response(toCsv(rows || []), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
