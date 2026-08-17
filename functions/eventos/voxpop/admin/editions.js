// Access-gated. Manage voX±Pop editions — capacity, status, pricing — without touching code.
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
}

export async function onRequestGet({ env }) {
  if (!env.DB) return json({ ok: false, error: "not_configured" }, 500);

  const [editionsResult, statsResult] = await Promise.all([
    env.DB.prepare("SELECT * FROM voxpop_editions ORDER BY start_date IS NULL, start_date").all(),
    env.DB.prepare(
      `SELECT edition_id,
        SUM(CASE WHEN status IN ('received','payment_pending','payment_review') THEN num_participants ELSE 0 END) AS pending,
        SUM(CASE WHEN status = 'waitlist' THEN num_participants ELSE 0 END) AS waitlisted
       FROM voxpop_registrations GROUP BY edition_id`
    ).all(),
  ]);

  const statsByEdition = {};
  (statsResult.results || []).forEach((r) => { statsByEdition[r.edition_id] = r; });

  const editions = (editionsResult.results || []).map((e) => ({
    ...e,
    addons: e.addons_json ? JSON.parse(e.addons_json) : [],
    available: Math.max(0, e.capacity - e.confirmed_count),
    pending: (statsByEdition[e.id] && statsByEdition[e.id].pending) || 0,
    waitlisted: (statsByEdition[e.id] && statsByEdition[e.id].waitlisted) || 0,
  }));

  return json({ ok: true, editions });
}

const EDITABLE_FIELDS = [
  "city", "country", "venue", "address", "start_date", "end_date", "status", "capacity",
  "price_individual_cents", "price_group_cents", "dinner_addon_cents", "dinner_standalone_cents",
  "registration_deadline", "eventbrite_url",
];

export async function onRequestPost({ request, env }) {
  const actor = request.headers.get("Cf-Access-Authenticated-User-Email") || "unknown-admin";
  if (!env.DB) return json({ ok: false, error: "not_configured" }, 500);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_request" }, 400);
  }
  const id = Number(body.id);
  if (!id) return json({ ok: false, error: "missing_id" }, 400);

  const edition = await env.DB.prepare("SELECT * FROM voxpop_editions WHERE id = ?").bind(id).first();
  if (!edition) return json({ ok: false, error: "not_found" }, 404);

  // Never allow capacity to drop below what's already confirmed — no silent participant loss.
  if (body.capacity !== undefined) {
    const newCapacity = Number(body.capacity);
    if (!Number.isFinite(newCapacity) || newCapacity < 0) return json({ ok: false, error: "invalid_capacity" }, 400);
    if (newCapacity < edition.confirmed_count) {
      return json({ ok: false, error: "capacity_below_confirmed", confirmed: edition.confirmed_count }, 409);
    }
  }

  const sets = [];
  const binds = [];
  for (const field of EDITABLE_FIELDS) {
    if (body[field] !== undefined) {
      sets.push(`${field} = ?`);
      binds.push(body[field] === "" ? null : body[field]);
    }
  }
  if (body.addons !== undefined) {
    sets.push("addons_json = ?");
    binds.push(JSON.stringify(body.addons));
  }
  if (!sets.length) return json({ ok: false, error: "no_changes" }, 400);

  sets.push("updated_at = datetime('now')");
  binds.push(id);

  await env.DB.prepare(`UPDATE voxpop_editions SET ${sets.join(", ")} WHERE id = ?`).bind(...binds).run();
  console.info(`[voxpop] edição #${id} (${edition.slug}) atualizada por ${actor}: ${Object.keys(body).filter((k) => k !== "id").join(", ")}`);

  return json({ ok: true });
}
