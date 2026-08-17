// RAMOS 2027 Artistic Residency — private area, authenticated by an opaque token.
// Read-only status view + self-service editing of the roommate preference already collected at signup.
import { sanitize } from "../../../_shared/ramos-residency.js";

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const token = sanitize(url.searchParams.get("token"), 100);
  if (!token || !env.DB) return json({ ok: false, error: "invalid_token" }, 400);

  const reg = await env.DB.prepare("SELECT * FROM residency_registrations WHERE private_token = ?").bind(token).first();
  if (!reg) return json({ ok: false, error: "not_found" }, 404);

  delete reg.proof_key;
  delete reg.admin_note;
  delete reg.private_token;

  return json({ ok: true, registration: reg });
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ ok: false, error: "not_configured" }, 500);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_request" }, 400);
  }
  const token = sanitize(body.token, 100);
  if (!token) return json({ ok: false, error: "invalid_token" }, 400);
  const reg = await env.DB.prepare("SELECT id, room_type, status FROM residency_registrations WHERE private_token = ?").bind(token).first();
  if (!reg) return json({ ok: false, error: "not_found" }, 404);
  if (reg.room_type !== "shared") return json({ ok: false, error: "not_applicable" }, 400);
  if (reg.status === "cancelled") return json({ ok: false, error: "cancelled" }, 403);

  const shareNames = sanitize(body.share_names, 300);
  await env.DB
    .prepare("UPDATE residency_registrations SET share_known = 1, share_names = ?, updated_at = datetime('now') WHERE id = ?")
    .bind(shareNames, reg.id)
    .run();

  return json({ ok: true });
}
