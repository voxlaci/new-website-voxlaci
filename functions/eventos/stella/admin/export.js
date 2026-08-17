// Access-gated. CSV export for the Seminário / internal bookkeeping.
function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escapeCell = (v) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => escapeCell(r[h])).join(","))].join("\n");
}

export async function onRequestGet({ request, env }) {
  if (!env.DB) return new Response("Not configured", { status: 500 });
  const type = new URL(request.url).searchParams.get("type") || "applications";

  let rows;
  let filename;
  if (type === "rooms") {
    const { results } = await env.DB
      .prepare(
        `SELECT a.stella_id, a.choir_name, r.room_ref, r.room_type, r.guest1, r.guest1_role, r.guest2, r.guest2_role,
                r.guest3, r.guest3_role, r.share_with, r.notes
         FROM stella_rooms r JOIN stella_applications a ON a.id = r.application_id
         ORDER BY a.stella_id, r.room_ref`
      )
      .all();
    rows = results;
    filename = "stella-rooms.csv";
  } else if (type === "meals") {
    const { results } = await env.DB
      .prepare(
        `SELECT a.stella_id, a.choir_name, m.meal_key, m.count, m.vegetarian, m.vegan, m.gluten_free, m.other_allergies
         FROM stella_meals m JOIN stella_applications a ON a.id = m.application_id
         ORDER BY a.stella_id, m.meal_key`
      )
      .all();
    rows = results;
    filename = "stella-meals.csv";
  } else {
    const { results } = await env.DB
      .prepare(
        `SELECT stella_id, application_type, choir_name, country, city, conductor_name, contact_person, email, phone,
                whatsapp, num_singers, num_companions, preferred_dates, amount_total_cents, amount_paid_cents,
                status, created_at
         FROM stella_applications ORDER BY created_at DESC`
      )
      .all();
    rows = results;
    filename = "stella-applications.csv";
  }

  return new Response(toCsv(rows || []), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
