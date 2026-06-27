// Injeta TURNSTILE_SITE_KEY (variável pública) no HTML servido pelo Pages
export async function onRequest(context) {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  const siteKey = context.env.TURNSTILE_SITE_KEY || "1x00000000000000000000AA";
  let html = await response.text();
  html = html.replace(/__TURNSTILE_SITE_KEY__/g, siteKey);

  const headers = new Headers(response.headers);
  return new Response(html, { status: response.status, headers });
}
