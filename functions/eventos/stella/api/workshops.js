// Public, read-only — powers the Workshops section of the STELLA marketing page.
export async function onRequestGet({ env }) {
  if (!env.DB) return json({ ok: true, workshops: [] });
  const { results } = await env.DB
    .prepare("SELECT id, title, leader, language, date, start_time, duration_minutes, capacity, price_cents, registered_count FROM stella_workshops ORDER BY date, start_time")
    .all();
  return json({ ok: true, workshops: results || [] });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=120" } });
}
