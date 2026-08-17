// Public, read-only — powers the Concerts/Performances section of the STELLA marketing page.
export async function onRequestGet({ env }) {
  if (!env.DB) return json({ ok: true, concerts: [] });
  const { results } = await env.DB
    .prepare("SELECT id, title, date, start_time, venue, description, price_cents, capacity, tickets_sold FROM stella_concerts ORDER BY date, start_time")
    .all();
  return json({ ok: true, concerts: results || [] });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=120" } });
}
