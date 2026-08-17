// Access-gated. Changes a registration's status. "confirmed" is the only status that occupies
// a real seat — entering/leaving it atomically adjusts voxpop_editions.confirmed_count in a
// single SQL statement guarded by capacity, so concurrent admin actions can never overbook.
import { FROM, VOXLACI_EMAIL, sendEmail, registrationConfirmedEmail, cancelledEmail, waitlistEmail } from "../../../_shared/voxpop.js";

const VALID_STATUSES = ["received", "payment_pending", "payment_review", "confirmed", "cancelled", "waitlist"];
const STATUS_EMAILS = { confirmed: registrationConfirmedEmail, cancelled: cancelledEmail, waitlist: waitlistEmail };

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
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
  const id = Number(body.id);
  const newStatus = body.status;
  if (!id || !VALID_STATUSES.includes(newStatus)) return json({ ok: false, error: "invalid_request" }, 400);

  const reg = await env.DB.prepare("SELECT * FROM voxpop_registrations WHERE id = ?").bind(id).first();
  if (!reg) return json({ ok: false, error: "not_found" }, 404);
  const edition = await env.DB.prepare("SELECT * FROM voxpop_editions WHERE id = ?").bind(reg.edition_id).first();
  if (!edition) return json({ ok: false, error: "edition_not_found" }, 404);

  const wasConfirmed = reg.status === "confirmed";
  const willBeConfirmed = newStatus === "confirmed";
  const n = reg.num_participants || 1;

  if (!wasConfirmed && willBeConfirmed) {
    const result = await env.DB
      .prepare("UPDATE voxpop_editions SET confirmed_count = confirmed_count + ? WHERE id = ? AND confirmed_count + ? <= capacity")
      .bind(n, edition.id, n)
      .run();
    if (result.meta.changes === 0) {
      const fresh = await env.DB.prepare("SELECT capacity, confirmed_count FROM voxpop_editions WHERE id = ?").bind(edition.id).first();
      return json({ ok: false, error: "not_enough_capacity", available: Math.max(0, fresh.capacity - fresh.confirmed_count) }, 409);
    }
  } else if (wasConfirmed && !willBeConfirmed) {
    await env.DB.prepare("UPDATE voxpop_editions SET confirmed_count = MAX(0, confirmed_count - ?) WHERE id = ?").bind(n, edition.id).run();
  }

  const adminNote = body.admin_note !== undefined ? String(body.admin_note).slice(0, 2000) : reg.admin_note;
  await env.DB
    .prepare("UPDATE voxpop_registrations SET status = ?, admin_note = ?, updated_at = datetime('now') WHERE id = ?")
    .bind(newStatus, adminNote, id)
    .run();
  console.info(`[voxpop] ${reg.voxpop_id} — estado alterado de ${reg.status} para ${newStatus} por ${actor}`);

  const emailFn = STATUS_EMAILS[newStatus];
  if (emailFn && env.RESEND_API_KEY) {
    try {
      const updatedReg = { ...reg, status: newStatus };
      const { subject, html } = emailFn(reg.language, updatedReg, edition);
      await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [reg.email], reply_to: VOXLACI_EMAIL, subject, html });
    } catch (err) {
      console.error(`[voxpop] ${reg.voxpop_id} — email de estado (${newStatus}) falhou: ${err.message}`);
    }
  }

  const fresh = await env.DB.prepare("SELECT capacity, confirmed_count FROM voxpop_editions WHERE id = ?").bind(edition.id).first();
  return json({ ok: true, status: newStatus, available: Math.max(0, fresh.capacity - fresh.confirmed_count) });
}
