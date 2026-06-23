const CHANNEL_ID = "UCjVtgJ6A-ERYscg80Wz3UkQ";
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

function decodeXml(value = "") {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

export async function onRequest() {
  try {
    const response = await fetch(FEED_URL);
    if (!response.ok) throw new Error(`YouTube ${response.status}`);
    const xml = await response.text();
    const entry = xml.match(/<entry>([\s\S]*?)<\/entry>/)?.[1];
    const videoId = entry?.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const title = decodeXml(entry?.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim());
    const published = entry?.match(/<published>([^<]+)<\/published>/)?.[1];
    if (!videoId) throw new Error("No YouTube videos");

    return Response.json({
      videoId,
      title,
      published,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      channel: "https://www.youtube.com/@VoxLaci"
    }, {
      headers: {
        "cache-control": "public, max-age=900"
      }
    });
  } catch (error) {
    return Response.json({error:error.message}, {status:502});
  }
}
