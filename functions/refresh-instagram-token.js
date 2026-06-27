// Renovar o token Instagram (válido 60 dias) — chamar de 30 em 30 dias
// GET /refresh-instagram-token
// Proteger com env var REFRESH_SECRET + header x-refresh-secret (opcional)

export async function onRequest({ env, request }) {
  const secret = env.REFRESH_SECRET;
  if (secret && request.headers.get('x-refresh-secret') !== secret) {
    return new Response('Unauthorized', { status: 401 });
  }

  const token = env.INSTAGRAM_TOKEN_VOXLACI;
  if (!token) {
    return new Response(JSON.stringify({ error: 'INSTAGRAM_TOKEN_VOXLACI não configurado' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const res = await fetch(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
    );
    const data = await res.json();

    if (data.expires_in) {
      return new Response(JSON.stringify({
        ok: true,
        expires_in_days: Math.floor(data.expires_in / 86400)
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: data }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
}
