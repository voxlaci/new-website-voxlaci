/**
 * Endpoint de diagnóstico de email — VoxLaci
 *
 * Uso: GET /api/enviar-teste?token=SEU_TOKEN
 *
 * Requer env var TEST_EMAIL_TOKEN configurada no Cloudflare Pages.
 * Envia email de teste para info@voxlaci.com, aguarda 6s e verifica
 * o estado de entrega no Resend. Retorna relatório JSON completo.
 *
 * NUNCA expor este endpoint sem o token.
 */
export async function onRequestGet({ request, env }) {
  const url   = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!env.TEST_EMAIL_TOKEN || token !== env.TEST_EMAIL_TOKEN) {
    return new Response("Não autorizado.", { status: 403 });
  }

  if (!env.RESEND_API_KEY) {
    return Response.json({ erro: "RESEND_API_KEY não configurada" }, { status: 500 });
  }

  const ts   = new Date();
  const tsIso = ts.toISOString();
  const from = "VoxLaci <info@voxlaci.com>";
  const to   = "info@voxlaci.com";

  // ── 1. Enviar email de teste ───────────────────────────────────────────
  let envioRes, enviOk, envioId, envioErro;
  try {
    envioRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `[VoxLaci] Diagnóstico de email — ${tsIso}`,
        html: `<p><b>Email de diagnóstico VoxLaci</b></p>
               <p>Enviado em: ${tsIso}</p>
               <p>From: ${from}</p>
               <p>To: ${to}</p>
               <p>Se recebeste este email, o sistema de entrega está operacional.</p>`,
      }),
    });
    const envioBody = await envioRes.json().catch(() => ({}));
    enviOk  = envioRes.ok;
    envioId = envioBody.id;
    if (!envioRes.ok) envioErro = `Resend HTTP ${envioRes.status}: ${JSON.stringify(envioBody)}`;
  } catch (e) {
    enviOk  = false;
    envioErro = `Erro de rede: ${e.message}`;
  }

  if (!enviOk) {
    return Response.json({
      ok: false,
      etapa: "envio",
      from,
      to,
      hora: tsIso,
      erro: envioErro,
      diagnostico: "O Resend rejeitou o email. Causa provável: domínio não verificado ou API key inválida.",
    }, { status: 500 });
  }

  // ── 2. Aguardar 6 segundos para o Resend processar ───────────────────
  await new Promise(r => setTimeout(r, 6000));

  // ── 3. Verificar estado de entrega via Resend API ─────────────────────
  let statusBody = {};
  let statusErro;
  try {
    const sr = await fetch(`https://api.resend.com/emails/${envioId}`, {
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}` },
    });
    statusBody = await sr.json().catch(() => ({}));
  } catch (e) {
    statusErro = `Erro ao verificar status: ${e.message}`;
  }

  const ultimoEvento = statusBody.last_event || "desconhecido";
  const entregue     = ultimoEvento === "delivered";

  const instrucao = entregue
    ? "Email entregue com sucesso. Se não chegou à caixa de entrada, verificar pasta de SPAM em info@voxlaci.com."
    : ultimoEvento === "bounced"
      ? "BOUNCE: O servidor de email de info@voxlaci.com rejeitou o email. Causa: SPF/DKIM não configurado para o Resend. Adicionar 'include:_spf.resend.com' ao registo SPF do domínio voxlaci.com."
      : ultimoEvento === "email.delivery_delayed"
        ? "Entrega em atraso. O email está na fila mas ainda não foi aceite pelo servidor destino."
        : `Estado: ${ultimoEvento}. Verificar o dashboard do Resend para mais detalhes.`;

  return Response.json({
    ok: true,
    envio: {
      from,
      to,
      hora: tsIso,
      resend_id: envioId,
      http_status: envioRes.status,
    },
    estado_após_6s: {
      ultimo_evento: ultimoEvento,
      entregue,
      detalhe_resend: statusBody,
    },
    ...(statusErro ? { erro_verificacao: statusErro } : {}),
    instrucao,
    proximos_passos: entregue
      ? ["Verificar pasta de SPAM em info@voxlaci.com", "Se não estiver em SPAM, o email chegou à caixa de entrada"]
      : [
          "1. Aceder ao dashboard do Resend → Email Logs",
          `2. Procurar o email com ID: ${envioId}`,
          "3. Ver se aparece como Bounced, Failed ou Spam",
          "4. Se Bounced: adicionar registo SPF e DKIM do Resend ao DNS do domínio voxlaci.com",
          "5. Contactar o suporte do Resend se necessário",
        ],
  });
}
