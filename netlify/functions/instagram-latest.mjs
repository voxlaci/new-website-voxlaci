export default async () => {
  const token = Netlify.env.get("INSTAGRAM_ACCESS_TOKEN");
  if (!token) return new Response(JSON.stringify({configured:false}), {status:200, headers:{"content-type":"application/json"}});
  const fields = "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp";
  const endpoint = `https://graph.instagram.com/me/media?fields=${fields}&limit=1&access_token=${encodeURIComponent(token)}`;
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`Instagram ${response.status}`);
    const payload = await response.json();
    const post = payload.data?.[0];
    if (!post) throw new Error("No Instagram posts");
    return new Response(JSON.stringify({
      configured:true,
      image:post.thumbnail_url || post.media_url,
      url:post.permalink,
      caption:post.caption || "Última publicação da VoxLaci no Instagram.",
      timestamp:post.timestamp
    }), {headers:{"content-type":"application/json","cache-control":"public, max-age=900"}});
  } catch (error) {
    return new Response(JSON.stringify({configured:true,error:error.message}), {status:502, headers:{"content-type":"application/json"}});
  }
};
