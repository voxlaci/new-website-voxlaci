// Access-gated. Admin view/edit of the rooming list for one application (same shape as the organizer portal).
const ROOM_TYPES = ["single", "twin", "double", "triple"];

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ ok: false, error: "not_configured" }, 500);
  const applicationId = Number(new URL(request.url).searchParams.get("application_id"));
  if (!applicationId) return json({ ok: false, error: "missing_id" }, 400);
  const { results } = await env.DB
    .prepare("SELECT * FROM stella_rooms WHERE application_id = ? ORDER BY id")
    .bind(applicationId)
    .all();
  return json({ ok: true, rooms: results });
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
  const rooms = Array.isArray(body.rooms) ? body.rooms : [];
  if (rooms.length > 60) return json({ ok: false, error: "too_many_rooms" }, 400);

  const app = await env.DB.prepare("SELECT id, num_singers, num_companions FROM stella_applications WHERE id = ?").bind(applicationId).first();
  if (!app) return json({ ok: false, error: "not_found" }, 404);

  let guestTotal = 0;
  const stmts = [env.DB.prepare("DELETE FROM stella_rooms WHERE application_id = ?").bind(applicationId)];
  rooms.forEach((r, i) => {
    const roomType = ROOM_TYPES.includes(r.room_type) ? r.room_type : "twin";
    const g1 = (r.guest1 || "").toString().slice(0, 200), g2 = (r.guest2 || "").toString().slice(0, 200), g3 = (r.guest3 || "").toString().slice(0, 200);
    guestTotal += [g1, g2, g3].filter(Boolean).length;
    stmts.push(
      env.DB.prepare(
        `INSERT INTO stella_rooms (application_id, room_ref, room_type, guest1, guest1_role, guest2, guest2_role, guest3, guest3_role, share_with, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        applicationId, (r.room_ref || `R${i + 1}`).toString().slice(0, 30), roomType,
        g1, (r.guest1_role || "").toString().slice(0, 60), g2, (r.guest2_role || "").toString().slice(0, 60), g3, (r.guest3_role || "").toString().slice(0, 60),
        (r.share_with || "").toString().slice(0, 200), (r.notes || "").toString().slice(0, 500)
      )
    );
  });
  await env.DB.batch(stmts);
  console.info(`[stella] rooms atualizadas para candidatura #${applicationId} por ${actor} (${rooms.length} quartos)`);

  const expected = app.num_singers + (app.num_companions || 0);
  return json({ ok: true, guestTotal, expected, warning: guestTotal !== expected ? `guest_count_mismatch:${guestTotal}:${expected}` : null });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}
