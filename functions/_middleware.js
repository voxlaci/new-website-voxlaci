const GA_ID = "G-V1Y0NK8EJK";

const GA_SNIPPET = `<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');</script>`;

export async function onRequest(context) {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  let html = await response.text();

  // Injeta GA4 após <head> (ou antes de </head> como fallback)
  if (html.includes("<head>")) {
    html = html.replace("<head>", `<head>\n${GA_SNIPPET}`);
  } else if (html.includes("</head>")) {
    html = html.replace("</head>", `${GA_SNIPPET}\n</head>`);
  }

  // Injeta Turnstile site key (casting form)
  const siteKey = context.env.TURNSTILE_SITE_KEY || "1x00000000000000000000AA";
  html = html.replace(/__TURNSTILE_SITE_KEY__/g, siteKey);

  const headers = new Headers(response.headers);
  return new Response(html, { status: response.status, headers });
}
