// Public read-only endpoint: real-time availability per edition, no hardcoded numbers on the frontend.
import { availableSeats, publicStatus } from "../../../_shared/voxpop.js";

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=30" } });
}

function toPublic(edition) {
  const available = availableSeats(edition);
  return {
    slug: edition.slug,
    city: edition.city,
    country: edition.country,
    venue: edition.venue,
    address: edition.address,
    start_date: edition.start_date,
    end_date: edition.end_date,
    status: publicStatus(edition),
    capacity: edition.capacity,
    confirmed_count: edition.confirmed_count,
    available_seats: available,
    price_individual_cents: edition.price_individual_cents,
    price_group_cents: edition.price_group_cents,
    dinner_addon_cents: edition.dinner_addon_cents,
    dinner_standalone_cents: edition.dinner_standalone_cents,
    addons: edition.addons_json ? JSON.parse(edition.addons_json) : [],
    registration_deadline: edition.registration_deadline,
    eventbrite_url: edition.eventbrite_url,
  };
}

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ ok: false, error: "not_configured" }, 500);
  const slug = new URL(request.url).searchParams.get("slug");

  if (slug) {
    const edition = await env.DB.prepare("SELECT * FROM voxpop_editions WHERE slug = ?").bind(slug).first();
    if (!edition) return json({ ok: false, error: "not_found" }, 404);
    return json({ ok: true, edition: toPublic(edition) });
  }

  const { results } = await env.DB.prepare("SELECT * FROM voxpop_editions ORDER BY start_date IS NULL, start_date").all();
  return json({ ok: true, editions: (results || []).map(toPublic) });
}
