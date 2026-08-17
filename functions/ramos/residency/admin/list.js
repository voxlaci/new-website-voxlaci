// Access-gated (see /admin/index.html + Cloudflare Access policy on /ramos/residency/admin/*).
export async function onRequestGet({ env }) {
  if (!env.DB) {
    return new Response(JSON.stringify({ ok: false, error: "not_configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  const { results } = await env.DB
    .prepare(
      `SELECT id, reference, language, full_name, email, country, mobile, choir_institution, role,
              room_type, amount_due_cents, share_known, share_names, payment_method,
              proof_original_filename, proof_mime, status, admin_note,
              seminario_email_sent_at, created_at, updated_at
       FROM residency_registrations
       ORDER BY created_at DESC`
    )
    .all();
  return new Response(JSON.stringify({ ok: true, registrations: results }), {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
