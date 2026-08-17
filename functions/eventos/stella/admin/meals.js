// Access-gated. Admin view/edit of dietary counts for one application.
const MEAL_KEYS = ["dinner_friday", "dinner_saturday", "dinner_sunday", "choir_day_dinner"];

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ ok: false, error: "not_configured" }, 500);
  const applicationId = Number(new URL(request.url).searchParams.get("application_id"));
  if (!applicationId) return json({ ok: false, error: "missing_id" }, 400);
  const { results } = await env.DB
    .prepare("SELECT * FROM stella_meals WHERE application_id = ? ORDER BY id")
    .bind(applicationId)
    .all();
  return json({ ok: true, meals: results });
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
  const applicationId = Number(body.application_id);
  if (!applicationId) return json({ ok: false, error: "missing_id" }, 400);
  const meals = Array.isArray(body.meals) ? body.meals : [];
  if (meals.length > 20) return json({ ok: false, error: "too_many_meals" }, 400);

  const app = await env.DB.prepare("SELECT id FROM stella_applications WHERE id = ?").bind(applicationId).first();
  if (!app) return json({ ok: false, error: "not_found" }, 404);

  const stmts = [env.DB.prepare("DELETE FROM stella_meals WHERE application_id = ?").bind(applicationId)];
  meals.forEach((m) => {
    if (!MEAL_KEYS.includes(m.meal_key)) return;
    stmts.push(
      env.DB.prepare(
        `INSERT INTO stella_meals (application_id, meal_key, count, vegetarian, vegan, gluten_free, other_allergies)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        applicationId, m.meal_key, parseInt(m.count, 10) || 0,
        parseInt(m.vegetarian, 10) || 0, parseInt(m.vegan, 10) || 0, parseInt(m.gluten_free, 10) || 0,
        (m.other_allergies || "").toString().slice(0, 500)
      )
    );
  });
  if (stmts.length > 1) await env.DB.batch(stmts);
  else await stmts[0].run();
  console.info(`[stella] meals atualizadas para candidatura #${applicationId} por ${actor}`);

  return json({ ok: true });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}
