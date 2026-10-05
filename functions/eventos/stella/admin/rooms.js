// Access-gated. Admin view/edit of the rooming list for one application (same shape as the organizer portal).
import { calculateChoirResidenceTotal } from "../../../_shared/stella.js";

const ROOM_TYPES = ["single", "twin", "double", "triple"];
const EXTRA_NIGHT_OPTIONS = ["none", "with_dinner", "without_dinner"];

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

  const normalizedRooms = rooms.map((r) => ({
    ...r,
    room_type: ROOM_TYPES.includes(r.room_type) ? r.room_type : "twin",
    extra_night_option: EXTRA_NIGHT_OPTIONS.includes(r.extra_night_option) ? r.extra_night_option : "none",
    guest1: (r.guest1 || "").toString().slice(0, 200),
    guest2: (r.guest2 || "").toString().slice(0, 200),
    guest3: (r.guest3 || "").toString().slice(0, 200),
  }));
  const totals = calculateChoirResidenceTotal(normalizedRooms);
  const stmts = [env.DB.prepare("DELETE FROM stella_rooms WHERE application_id = ?").bind(applicationId)];
  normalizedRooms.forEach((r, i) => {
    stmts.push(
      env.DB.prepare(
        `INSERT INTO stella_rooms (application_id, room_ref, room_type, guest1, guest1_role, guest2, guest2_role, guest3, guest3_role, share_with, notes, extra_night_option)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        applicationId, (r.room_ref || `R${i + 1}`).toString().slice(0, 30), r.room_type,
        r.guest1, (r.guest1_role || "").toString().slice(0, 60), r.guest2, (r.guest2_role || "").toString().slice(0, 60), r.guest3, (r.guest3_role || "").toString().slice(0, 60),
        (r.share_with || "").toString().slice(0, 200), (r.notes || "").toString().slice(0, 500), r.extra_night_option
      )
    );
  });
  stmts.push(env.DB.prepare("UPDATE stella_applications SET amount_total_cents = ?, updated_at = datetime('now') WHERE id = ?").bind(totals.totalCents, applicationId));
  await env.DB.batch(stmts);
  console.info(`[stella] rooms atualizadas para candidatura #${applicationId} por ${actor} (${rooms.length} quartos)`);

  const expected = app.num_singers + (app.num_companions || 0);
  return json({ ok: true, ...totals, expected, warning: totals.guestTotal !== expected ? `guest_count_mismatch:${totals.guestTotal}:${expected}` : null });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}
