export async function onRequestGet({ request }) {
  return Response.redirect(new URL("/#newsletter", request.url), 303);
}

export async function onRequestPost({ request, env }) {
  const base = new URL(request.url);

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return new Response("Pedido inválido.", { status: 400 });
  }

  if (formData.get("website") || formData.get("campo-secreto")) {
    return Response.redirect(new URL("/obrigado.html", base), 303);
  }

  const email = sanitize(formData.get("email")).toLowerCase();
  const nome = sanitize(formData.get("nome") || formData.get("name"));
  const telefone = sanitize(formData.get("telefone") || formData.get("phone"));
  const origemFormulario = sanitize(formData.get("origem_formulario") || formData.get("form-name") || "Website VoxLaci");
  const idioma = sanitize(formData.get("idioma") || "pt");
  const mensagem = sanitize(formData.get("mensagem") || "");

  if (!email || !email.includes("@")) {
    return Response.redirect(new URL("/#newsletter?erro=email", base), 303);
  }

  const apiKey = env.BREVO_API_KEY || env.SENDINBLUE_API_KEY;
  const websiteListId = Number(env.BREVO_WEBSITE_LIST_ID);

  if (!apiKey) {
    console.error("[website-brevo] BREVO_API_KEY não configurada");
    return new Response("Integração Brevo não configurada: falta BREVO_API_KEY.", { status: 500 });
  }

  if (!Number.isInteger(websiteListId) || websiteListId <= 0) {
    console.error("[website-brevo] BREVO_WEBSITE_LIST_ID não configurada ou inválida");
    return new Response("Integração Brevo não configurada: falta BREVO_WEBSITE_LIST_ID.", { status: 500 });
  }

  const attributes = {
    NOME: nome,
    FIRSTNAME: firstName(nome),
    LASTNAME: lastName(nome),
    TELEFONE: telefone,
    ORIGEM: origemFormulario,
    IDIOMA: idioma,
    MENSAGEM: mensagem,
    WEBSITE: "VoxLaci",
  };

  const brevoPayload = {
    email,
    attributes: cleanAttributes(attributes),
    listIds: [websiteListId],
    updateEnabled: true,
  };

  const result = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(brevoPayload),
  });

  if (!result.ok) {
    const body = await result.text().catch(() => "");
    console.error(`[website-brevo] falha Brevo ${result.status}: ${body}`);
    return new Response("Não foi possível registar o contacto na newsletter.", { status: 502 });
  }

  console.info(`[website-brevo] contacto registado/atualizado · email=${email} · lista=${websiteListId} · origem=${origemFormulario}`);
  return Response.redirect(new URL("/obrigado.html", base), 303);
}

function sanitize(value) {
  return (value || "").toString().trim().slice(0, 2000);
}

function cleanAttributes(attributes) {
  return Object.fromEntries(Object.entries(attributes).filter(([, value]) => value !== ""));
}

function firstName(nome) {
  return nome.split(/\s+/).filter(Boolean)[0] || "";
}

function lastName(nome) {
  const parts = nome.split(/\s+/).filter(Boolean);
  return parts.length > 1 ? parts.slice(1).join(" ") : "";
}
