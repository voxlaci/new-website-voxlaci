export async function onRequest(context) {
  const token = context.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    return Response.json({configured:false});
  }

  const fields = "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp";
  const endpoint = `https://graph.instagram.com/me/media?fields=${fields}&limit=1&access_token=${encodeURIComponent(token)}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`Instagram ${response.status}`);
    const payload = await response.json();
    const post = payload.data?.[0];
    if (!post) throw new Error("No Instagram posts");

    return Response.json({
      configured:true,
      image:post.thumbnail_url || post.media_url,
      url:post.permalink,
      caption:post.caption || "Última publicação da VoxLaci no Instagram.",
      timestamp:post.timestamp
    }, {
      headers: {
        "cache-control": "public, max-age=900"
      }
    });
  } catch (error) {
    return Response.json({configured:true,error:error.message}, {status:502});
  }
}
