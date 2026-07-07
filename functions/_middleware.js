export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === "www.voxlaci.com") {
    url.hostname = "voxlaci.com";
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
