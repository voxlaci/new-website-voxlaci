// Access-gated. Streams a proof-of-payment file straight from R2 — never a public URL.
export async function onRequestGet({ params, env }) {
  if (!env.DB || !env.RESIDENCY_PROOFS) {
    return new Response("Not configured", { status: 500 });
  }
  const id = Number(params.id);
  if (!id) return new Response("Not found", { status: 404 });

  const payment = await env.DB
    .prepare("SELECT proof_key, proof_original_filename, proof_mime FROM ramos_individual_payments WHERE id = ?")
    .bind(id)
    .first();
  if (!payment || !payment.proof_key) return new Response("Not found", { status: 404 });

  const object = await env.RESIDENCY_PROOFS.get(payment.proof_key);
  if (!object) return new Response("Not found", { status: 404 });

  return new Response(object.body, {
    headers: {
      "Content-Type": payment.proof_mime || "application/octet-stream",
      "Content-Disposition": `inline; filename="${(payment.proof_original_filename || "comprovativo").replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
