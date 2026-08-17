import { TOTAL_ROOMS, HELD_STATUSES } from "../../../_shared/ramos-residency.js";

export async function onRequestGet({ env }) {
  if (!env.DB) {
    return new Response(JSON.stringify({ available: TOTAL_ROOMS, total: TOTAL_ROOMS }), {
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
  const placeholders = HELD_STATUSES.map(() => "?").join(",");
  const { count } = await env.DB
    .prepare(`SELECT COUNT(*) AS count FROM residency_registrations WHERE status IN (${placeholders})`)
    .bind(...HELD_STATUSES)
    .first();
  const available = Math.max(0, TOTAL_ROOMS - count);
  return new Response(JSON.stringify({ available, total: TOTAL_ROOMS }), {
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=30" },
  });
}
