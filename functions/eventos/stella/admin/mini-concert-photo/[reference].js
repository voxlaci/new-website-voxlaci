// Protected by the existing Cloudflare Access policy for /eventos/stella/admin/*.
// Streams the artist photograph directly from private R2; no permanent public URL exists.
export async function onRequestGet({ params, env }) {
  if (!env.DB || !env.RESIDENCY_PROOFS) return new Response("Not configured", { status: 500 });
  const reference = String(params.reference || "").slice(0, 80);
  const app = await env.DB.prepare("SELECT photo_key, photo_filename, photo_mime FROM stella_mini_concert_applications WHERE reference = ?").bind(reference).first();
  if (!app || !app.photo_key) return new Response("Not found", { status: 404 });
  const object = await env.RESIDENCY_PROOFS.get(app.photo_key);
  if (!object) return new Response("Not found", { status: 404 });
  return new Response(object.body, { headers: {
    "Content-Type": app.photo_mime || "application/octet-stream",
    "Content-Disposition": `inline; filename="${String(app.photo_filename || "fotografia").replace(/\"/g, "")}"`,
    "Cache-Control": "private, no-store",
    "X-Robots-Tag": "noindex, nofollow",
  }});
}
