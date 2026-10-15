export async function onRequestGet({ params, env }) {
  if (!env.DB || !env.RESIDENCY_PROOFS) return new Response("Not configured", { status: 500 });
  const reference = String(params.reference || "").slice(0, 80);
  const reservation = await env.DB.prepare(
    "SELECT proof_key, proof_original_filename, proof_mime FROM stella_individual_residences WHERE reference = ?"
  ).bind(reference).first();
  if (!reservation || !reservation.proof_key) return new Response("Not found", { status: 404 });
  const object = await env.RESIDENCY_PROOFS.get(reservation.proof_key);
  if (!object) return new Response("Not found", { status: 404 });
  return new Response(object.body, {
    headers: {
      "Content-Type": reservation.proof_mime || "application/octet-stream",
      "Content-Disposition": `inline; filename="${(reservation.proof_original_filename || "proof").replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
