const POSTS_LIMIT = 6; // alterar aqui para mudar o número de posts
const CACHE_TTL = 3600; // segundos — 1 hora

export async function onRequest({ env }) {
  const token = env.INSTAGRAM_TOKEN_VOXLACI;
  // Para desligar o feed: remover INSTAGRAM_TOKEN_VOXLACI das env vars do Cloudflare Pages
  if (!token) return json([], 300);

  try {
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink&limit=${POSTS_LIMIT}&access_token=${token}`
    );
    if (!res.ok) return json([], 60);

    const { data = [] } = await res.json();
    const posts = data.slice(0, POSTS_LIMIT).map(p => ({
      id: p.id,
      image: p.media_type === 'VIDEO' ? p.thumbnail_url : p.media_url,
      url: p.permalink
    }));

    return json(posts, CACHE_TTL);
  } catch (_) {
    return json([], 60);
  }
}

function json(body, maxAge) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=${maxAge}`
    }
  });
}
