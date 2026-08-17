// Access-gated. CRUD for the concerts/performances catalogue shown on the public STELLA page.
export async function onRequestGet({ env }) {
  if (!env.DB) return json({ ok: false, error: "not_configured" }, 500);
  const { results } = await env.DB.prepare("SELECT * FROM stella_concerts ORDER BY date, start_time").all();
  return json({ ok: true, concerts: results });
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

  if (body.action === "delete") {
    const id = Number(body.id);
    if (!id) return json({ ok: false, error: "missing_id" }, 400);
    await env.DB.prepare("DELETE FROM stella_concerts WHERE id = ?").bind(id).run();
    console.info(`[stella] concerto #${id} removido por ${actor}`);
    return json({ ok: true });
  }

  const title = (body.title || "").toString().trim().slice(0, 200);
  if (!title) return json({ ok: false, error: "missing_title" }, 400);
  const date = (body.date || "").toString().slice(0, 20);
  const startTime = (body.start_time || "").toString().slice(0, 10);
  const venue = (body.venue || "").toString().slice(0, 200);
  const description = (body.description || "").toString().slice(0, 1000);
  const priceCents = Math.max(0, Math.round(Number(body.price_cents) || 0));
  const capacity = parseInt(body.capacity, 10) || null;

  const id = Number(body.id);
  if (id) {
    await env.DB
      .prepare(`UPDATE stella_concerts SET title=?, date=?, start_time=?, venue=?, description=?, price_cents=?, capacity=? WHERE id=?`)
      .bind(title, date, startTime, venue, description, priceCents, capacity, id)
      .run();
    console.info(`[stella] concerto #${id} atualizado por ${actor}`);
    return json({ ok: true, id });
  }

  const result = await env.DB
    .prepare(`INSERT INTO stella_concerts (title, date, start_time, venue, description, price_cents, capacity) VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .bind(title, date, startTime, venue, description, priceCents, capacity)
    .run();
  console.info(`[stella] concerto criado por ${actor}`);
  return json({ ok: true, id: result.meta.last_row_id });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}
