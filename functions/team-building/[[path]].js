export async function onRequest({ request }) {
  return Response.redirect(new URL("/servicos/team-building/", request.url), 301);
}
