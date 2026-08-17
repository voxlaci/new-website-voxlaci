// Access-gated. CRUD for the workshops catalogue shown on the public STELLA page.
export async function onRequestGet({ env }) {
  if (!env.DB) return json({ ok: false, error: "not_configured" }, 500);
  const { results } = await env.DB.prepare("SELECT * FROM stella_workshops ORDER BY date, start_time").all();
  return json({ ok: true, workshops: results });
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
    await env.DB.prepare("DELETE FROM stella_workshops WHERE id = ?").bind(id).run();
    console.info(`[stella] workshop #${id} removido por ${actor}`);
    return json({ ok: true });
  }

  const title = (body.title || "").toString().trim().slice(0, 200);
  if (!title) return json({ ok: false, error: "missing_title" }, 400);
  const leader = (body.leader || "").toString().slice(0, 200);
  const language = (body.language || "").toString().slice(0, 10);
  const date = (body.date || "").toString().slice(0, 20);
  const startTime = (body.start_time || "").toString().slice(0, 10);
  const durationMinutes = parseInt(body.duration_minutes, 10) || null;
  const capacity = parseInt(body.capacity, 10) || null;
  const priceCents = Math.max(0, Math.round(Number(body.price_cents) || 0));

  const id = Number(body.id);
  if (id) {
    await env.DB
      .prepare(
        `UPDATE stella_workshops SET title=?, leader=?, language=?, date=?, start_time=?, duration_minutes=?, capacity=?, price_cents=? WHERE id=?`
      )
      .bind(title, leader, language, date, startTime, durationMinutes, capacity, priceCents, id)
      .run();
    console.info(`[stella] workshop #${id} atualizado por ${actor}`);
    return json({ ok: true, id });
  }

  const result = await env.DB
    .prepare(
      `INSERT INTO stella_workshops (title, leader, language, date, start_time, duration_minutes, capacity, price_cents)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(title, leader, language, date, startTime, durationMinutes, capacity, priceCents)
    .run();
  console.info(`[stella] workshop criado por ${actor}`);
  return json({ ok: true, id: result.meta.last_row_id });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}
