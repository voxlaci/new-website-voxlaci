// One-time OAuth helper — visit /auth/instagram/callback to generate
// the Instagram long-lived token for INSTAGRAM_TOKEN_VOXLACI.
//
// Required env vars (set in Cloudflare Pages → Settings → Environment variables):
//   INSTAGRAM_APP_ID     — App ID from Meta App → Settings → Basic
//   INSTAGRAM_APP_SECRET — App Secret from Meta App → Settings → Basic
//
// After copying the token, you can remove INSTAGRAM_APP_ID and INSTAGRAM_APP_SECRET.

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const code  = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return page(`
      <h1>Erro OAuth</h1>
      <p><code>error: ${error}</code></p>
      <p><code>${url.searchParams.get("error_description") || ""}</code></p>
      <p><a href="/auth/instagram/callback">Tentar novamente</a></p>
    `);
  }

  if (!code) {
    const appId = env.INSTAGRAM_APP_ID;
    if (!appId) return page("<h1>Erro: <code>INSTAGRAM_APP_ID</code> não configurado nas env vars do Cloudflare Pages.</h1>");

    const redirectUri = `${url.origin}/auth/instagram/callback`;
    const scope = "instagram_business_basic,openid";
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`;

    return Response.redirect(authUrl, 302);
  }

  const appId     = env.INSTAGRAM_APP_ID;
  const appSecret = env.INSTAGRAM_APP_SECRET;
  const redirectUri = `${url.origin}/auth/instagram/callback`;

  if (!appId || !appSecret)
    return page("<h1>Erro: <code>INSTAGRAM_APP_ID</code> ou <code>INSTAGRAM_APP_SECRET</code> não configurados.</h1>");

  // Step 1 — exchange code for short-lived token
  const tokenRes = await fetch("https://api.instagram.com/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: appId,
      client_secret: appSecret,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code,
    }),
  });
  const tokenData = await tokenRes.json();

  if (!tokenData.access_token)
    return page(`<h1>Erro na troca do código</h1><pre>${JSON.stringify(tokenData, null, 2)}</pre>`);

  // Step 2 — exchange short-lived for long-lived token (60 days)
  const longRes = await fetch(
    `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_id=${appId}&client_secret=${appSecret}&access_token=${tokenData.access_token}`
  );
  const longData = await longRes.json();

  if (!longData.access_token)
    return page(`<h1>Erro ao gerar long-lived token</h1><pre>${JSON.stringify(longData, null, 2)}</pre>`);

  const days = Math.floor((longData.expires_in || 0) / 86400);

  return page(`
    <h1>✓ Token gerado</h1>
    <p>Válido por <strong>${days} dias</strong> (renovado automaticamente pelo GitHub Actions).</p>
    <p>Copia o token abaixo e guarda em:<br>
    <strong>Cloudflare Pages → new-website-voxlaci → Settings → Environment variables</strong><br>
    Nome da variável: <code>INSTAGRAM_TOKEN_VOXLACI</code></p>
    <textarea rows="5">${longData.access_token}</textarea>
    <hr>
    <p style="color:#c00"><strong>Segurança:</strong> após guardar o token, remove <code>INSTAGRAM_APP_SECRET</code> das env vars.</p>
  `);
}

function page(body) {
  return new Response(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Instagram Auth — VoxLaci</title>
    <style>
      body { font-family: system-ui, sans-serif; max-width: 680px; margin: 60px auto; padding: 0 24px; line-height: 1.6; }
      textarea { width: 100%; height: 100px; font-family: monospace; font-size: 12px; margin-top: 8px; }
      pre { background: #f4f4f4; padding: 16px; overflow: auto; font-size: 13px; }
      code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; }
      hr { margin: 32px 0; }
    </style></head><body>${body}</body></html>`,
    { headers: { "Content-Type": "text/html;charset=utf-8" } }
  );
}
