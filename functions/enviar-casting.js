export async function onRequestGet({ request }) {
  return Response.redirect(new URL("/#inscricao", request.url), 303);
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let formData;
  try {
    formData = await request.formData();
  } catch (err) {
    return new Response("Pedido inválido.", { status: 400 });
  }

  // Campo-armadilha anti-spam
  if (formData.get("campo-secreto")) {
    return Response.redirect(new URL("/obrigado.html", request.url), 303);
  }

  const nome = (formData.get("nome") || "").toString().trim();
  const idade = (formData.get("idade") || "").toString().trim();
  const pais = (formData.get("pais") || "").toString().trim();
  const telefone = (formData.get("telefone") || "").toString().trim();
  const email = (formData.get("email") || "").toString().trim();
  const morada = (formData.get("morada") || "").toString().trim();
  const ensemble = (formData.get("ensemble") || "").toString().trim();
  const experiencia = (formData.get("experiencia") || "").toString().trim();
  const leituraMusical = (formData.get("leitura-musical") || "").toString().trim();
  const origem = (formData.get("origem") || "").toString().trim();
  const motivacao = (formData.get("motivacao") || "").toString().trim();
  const pagamentoMetodo = (formData.get("pagamento-inscricao") || "").toString().trim();
  const nomePagamento = (formData.get("nome-pagamento") || "").toString().trim();
  const comprovativo = formData.get("comprovativo");

  if (!nome || !idade || !telefone || !email) {
    return new Response("Faltam campos obrigatórios.", { status: 400 });
  }

  if (!env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY não está configurada nas variáveis de ambiente.");
    return new Response(
      "O envio de email ainda não está configurado neste site. Contacte info@voxlaci.com diretamente.",
      { status: 500 }
    );
  }

  const attachments = [];
  if (comprovativo && typeof comprovativo === "object" && "arrayBuffer" in comprovativo && comprovativo.size > 0) {
    const buffer = await comprovativo.arrayBuffer();
    attachments.push({
      filename: comprovativo.name || "comprovativo",
      content: arrayBufferToBase64(buffer),
    });
  }

  const resumo = `
    <h2>Novo casting VoxLaci</h2>
    <p><b>Nome:</b> ${escapeHtml(nome)}</p>
    <p><b>Idade:</b> ${escapeHtml(idade)}</p>
    <p><b>País:</b> ${escapeHtml(pais)}</p>
    <p><b>Telefone:</b> ${escapeHtml(telefone)}</p>
    <p><b>Email:</b> ${escapeHtml(email)}</p>
    <p><b>Morada:</b> ${escapeHtml(morada)}</p>
    <p><b>Ensemble de interesse:</b> ${escapeHtml(ensemble)}</p>
    <p><b>Já cantou num coro?:</b> ${escapeHtml(experiencia)}</p>
    <p><b>Sabe ler música?:</b> ${escapeHtml(leituraMusical)}</p>
    <p><b>Como conheceu a VoxLaci?:</b> ${escapeHtml(origem)}</p>
    <p><b>Motivação:</b><br>${escapeHtml(motivacao).replace(/\n/g, "<br>")}</p>
    <hr>
    <p><b>Forma de pagamento:</b> ${escapeHtml(pagamentoMetodo)}</p>
    <p><b>Nome usado no pagamento:</b> ${escapeHtml(nomePagamento)}</p>
  `;

  const fromAddress = env.FROM_EMAIL || "VoxLaci <casting@voxlaci.com>";

  try {
    // 1) Notificação interna para a equipa VoxLaci
    await sendEmail(env.RESEND_API_KEY, {
      from: fromAddress,
      to: ["info@voxlaci.com"],
      reply_to: email,
      subject: `Novo casting VoxLaci — ${nome}`,
      html: resumo,
      attachments,
    });

    // 2) Cópia de confirmação para quem se candidatou
    await sendEmail(env.RESEND_API_KEY, {
      from: fromAddress,
      to: [email],
      bcc: ["info@voxlaci.com"],
      subject: "Recebemos o seu casting VoxLaci",
      html: `
        <p>Olá ${escapeHtml(nome)},</p>
        <p>Recebemos o seu casting e o comprovativo da inscrição. Esta é a cópia dos dados que enviou.</p>
        <p>A equipa VoxLaci entrará em contacto consigo para indicar o próximo passo.</p>
        ${resumo}
      `,
      attachments,
    });
  } catch (err) {
    console.error("Erro ao enviar email do casting:", err);
    return new Response(
      "Não foi possível enviar o casting. Tente novamente ou contacte info@voxlaci.com diretamente.",
      { status: 502 }
    );
  }

  return Response.redirect(new URL("/obrigado.html", request.url), 303);
}

async function sendEmail(apiKey, payload) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Resend ${res.status}: ${detail}`);
  }
}

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]
  ));
}
