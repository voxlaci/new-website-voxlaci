// Shared helpers for the RAMOS 2027 Individual Singer application/payment system.
// Reuses the generic utilities already built for the Artistic Residency rather than duplicating them.
import { sanitize, esc, euros, sendEmail, validateProofFile, FROM, VOXLACI_EMAIL } from "./ramos-residency.js";
export { sanitize, esc, euros, sendEmail, validateProofFile, FROM, VOXLACI_EMAIL };

export const RAMOS_EDITION_YEAR = "27"; // Ramos 2027 — keep in sync with ramos/index.html
export const INDIVIDUAL_FEE_CENTS = 29500; // €295 Ramos fee, both tracks

export const TRACK_LABELS = {
  pt: { international: "Cantor Individual Internacional", resident: "Cantor Residente em Portugal" },
  en: { international: "International Individual Singer", resident: "Singer Resident in Portugal" },
};

export const STATUS_LABELS = {
  pt: {
    application_received: "Candidatura recebida",
    under_review: "Em análise",
    accepted: "Aceite",
    payment_pending: "Pagamento pendente",
    partially_paid: "Parcialmente pago",
    paid: "Pago",
    confirmed: "Confirmado",
    cancelled: "Cancelado",
  },
  en: {
    application_received: "Application received",
    under_review: "Under review",
    accepted: "Accepted",
    payment_pending: "Payment pending",
    partially_paid: "Partially paid",
    paid: "Paid",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
  },
};

export async function generateRamosIndividualId(db, id) {
  const ramosId = `RAMOS${RAMOS_EDITION_YEAR}-${String(id).padStart(4, "0")}`;
  await db.prepare("UPDATE ramos_individual_applications SET ramos_id = ? WHERE id = ?").bind(ramosId, id).run();
  return ramosId;
}

function shell(title, body) {
  return `<div style="font-family:sans-serif;max-width:640px;margin:0 auto">
  <h2 style="margin-bottom:4px;color:#111">${esc(title)}</h2>
  <p style="color:#888;font-size:13px;margin-top:0">Ramos Palm Sunday Festival 2027 · VoxLaci</p>
  ${body}
  <p style="margin-top:28px"><b>Ramos – Palm Sunday Festival</b><br>VoxLaci<br><a href="mailto:info@voxlaci.com">info@voxlaci.com</a></p>
</div>`;
}

function summaryTable(lang, app, extraRows = []) {
  const rows = lang === "pt"
    ? [
        ["Nome", app.full_name],
        ["ID Ramos", app.ramos_id],
        ["Percurso", TRACK_LABELS.pt[app.track]],
        ["Estado", STATUS_LABELS.pt[app.status]],
        ...extraRows,
      ]
    : [
        ["Name", app.full_name],
        ["Ramos ID", app.ramos_id],
        ["Track", TRACK_LABELS.en[app.track]],
        ["Status", STATUS_LABELS.en[app.status]],
        ...extraRows,
      ];
  return `<table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px">
    ${rows.filter(([, v]) => v !== undefined && v !== null && v !== "").map(([k, v]) => `<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:700;width:42%">${esc(k)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(v)}</td></tr>`).join("")}
  </table>`;
}

export function applicationReceivedEmail(lang, app) {
  const t = lang === "pt"
    ? { subject: `Ramos — Candidatura recebida (${app.ramos_id})`, title: "Candidatura recebida", body: `<p>Recebemos a candidatura de <b>${esc(app.full_name)}</b> como cantor/a individual no Ramos Palm Sunday Festival 2027.</p><p>A candidatura está agora em análise pela direção artística. Vamos entrar em contacto assim que houver uma decisão.</p>` }
    : { subject: `Ramos — Application received (${app.ramos_id})`, title: "Application received", body: `<p>We have received <b>${esc(app.full_name)}</b>'s application as an individual singer at the Ramos Palm Sunday Festival 2027.</p><p>Your application is now under review by the artistic direction. We will be in touch as soon as a decision is made.</p>` };
  return { subject: t.subject, html: shell(t.title, t.body + summaryTable(lang, app)) };
}

export function applicationAcceptedEmail(lang, app) {
  const t = lang === "pt"
    ? { subject: `Ramos — Candidatura aceite (${app.ramos_id})`, title: "A sua candidatura foi aceite", body: `<p>Boas notícias, <b>${esc(app.full_name)}</b> — a sua candidatura foi aceite.</p><p>O próximo passo é o pagamento da taxa Ramos, disponível na sua área privada.</p>` }
    : { subject: `Ramos — Application accepted (${app.ramos_id})`, title: "Your application has been accepted", body: `<p>Good news, <b>${esc(app.full_name)}</b> — your application has been accepted.</p><p>The next step is paying the Ramos fee, available in your private area.</p>` };
  return { subject: t.subject, html: shell(t.title, t.body + summaryTable(lang, app)) };
}

export function paymentPendingEmail(lang, app) {
  const t = lang === "pt"
    ? { subject: `Ramos — Pagamento pendente (${app.ramos_id})`, title: "Pagamento pendente", body: `<p>A sua candidatura está aceite — falta apenas o pagamento da taxa Ramos para confirmar a participação.</p><p>Valor: <b>${euros(app.amount_total_cents)} €</b></p>` }
    : { subject: `Ramos — Payment pending (${app.ramos_id})`, title: "Payment pending", body: `<p>Your application is accepted — payment of the Ramos fee is the only remaining step to confirm your participation.</p><p>Amount: <b>€${euros(app.amount_total_cents)}</b></p>` };
  return { subject: t.subject, html: shell(t.title, t.body + summaryTable(lang, app)) };
}

export function paymentReceivedEmail(lang, app, amountCents) {
  const t = lang === "pt"
    ? { subject: `Ramos — Comprovativo recebido (${app.ramos_id})`, title: "Comprovativo de pagamento recebido", body: `<p>Recebemos um comprovativo de pagamento de <b>${euros(amountCents)} €</b>.</p><p>O pagamento está agora em validação.</p>` }
    : { subject: `Ramos — Payment proof received (${app.ramos_id})`, title: "Payment proof received", body: `<p>We received a proof of payment of <b>€${euros(amountCents)}</b>.</p><p>The payment is now being verified.</p>` };
  return { subject: t.subject, html: shell(t.title, t.body + summaryTable(lang, app)) };
}

export function paymentConfirmedEmail(lang, app, amountCents) {
  const balance = app.amount_total_cents - app.amount_paid_cents;
  const balanceLine = lang === "pt"
    ? `<p>Total: <b>${euros(app.amount_total_cents)} €</b> · Pago: <b>${euros(app.amount_paid_cents)} €</b> · Saldo: <b>${euros(balance)} €</b></p>`
    : `<p>Total: <b>€${euros(app.amount_total_cents)}</b> · Paid: <b>€${euros(app.amount_paid_cents)}</b> · Balance: <b>€${euros(balance)}</b></p>`;
  const t = lang === "pt"
    ? { subject: `Ramos — Pagamento confirmado (${app.ramos_id})`, title: "Pagamento confirmado", body: `<p>Confirmámos um pagamento de <b>${euros(amountCents)} €</b>.</p>${balanceLine}` }
    : { subject: `Ramos — Payment confirmed (${app.ramos_id})`, title: "Payment confirmed", body: `<p>We confirmed a payment of <b>€${euros(amountCents)}</b>.</p>${balanceLine}` };
  return { subject: t.subject, html: shell(t.title, t.body + summaryTable(lang, app)) };
}

export function registrationConfirmedEmail(lang, app) {
  const t = lang === "pt"
    ? { subject: `Ramos — Inscrição confirmada (${app.ramos_id})`, title: "A sua inscrição está confirmada", body: `<p>A inscrição de <b>${esc(app.full_name)}</b> no Ramos Palm Sunday Festival 2027 está oficialmente confirmada.</p><p>Vai receber as partituras em PDF e os áudios de preparação diretamente da direção artística.</p>` }
    : { subject: `Ramos — Registration confirmed (${app.ramos_id})`, title: "Your registration is confirmed", body: `<p><b>${esc(app.full_name)}</b>'s registration at the Ramos Palm Sunday Festival 2027 is now officially confirmed.</p><p>You will receive PDF scores and preparation audio directly from the artistic direction.</p>` };
  return { subject: t.subject, html: shell(t.title, t.body + summaryTable(lang, app)) };
}

export function informationRequiredEmail(lang, app, message) {
  const t = lang === "pt"
    ? { subject: `Ramos — Precisamos de mais informação (${app.ramos_id})`, title: "Precisamos de mais informação", body: `<p>${esc(message)}</p><p>Responda a este email ou contacte-nos em info@voxlaci.com.</p>` }
    : { subject: `Ramos — We need more information (${app.ramos_id})`, title: "We need more information", body: `<p>${esc(message)}</p><p>Please reply to this email or contact us at info@voxlaci.com.</p>` };
  return { subject: t.subject, html: shell(t.title, t.body + summaryTable(lang, app)) };
}

export function cancelledEmail(lang, app) {
  const t = lang === "pt"
    ? { subject: `Ramos — Candidatura cancelada (${app.ramos_id})`, title: "Candidatura cancelada", body: `<p>A candidatura de <b>${esc(app.full_name)}</b> foi cancelada. Se isto não era esperado, contacte-nos.</p>` }
    : { subject: `Ramos — Application cancelled (${app.ramos_id})`, title: "Application cancelled", body: `<p><b>${esc(app.full_name)}</b>'s application has been cancelled. If this was not expected, please contact us.</p>` };
  return { subject: t.subject, html: shell(t.title, t.body + summaryTable(lang, app)) };
}

export function internalNotificationEmail(app, adminUrl) {
  const rows = [
    ["ID Ramos", app.ramos_id],
    ["Nome", app.full_name],
    ["Percurso", TRACK_LABELS.pt[app.track]],
    ["País", app.country || "—"],
    ["Contacto", `${app.email} · ${app.phone || app.whatsapp || "—"}`],
    ["Coro / Instituição", app.choir_institution || "—"],
    ["Obras escolhidas", app.works_chosen || "—"],
    ["Link de vídeo", app.video_link || "—"],
    ["Idioma", app.language],
  ];
  const table = `<table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px">
    ${rows.map(([k, v]) => `<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:700;width:42%">${esc(k)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(v)}</td></tr>`).join("")}
  </table>
  <p style="margin-top:20px"><a href="${esc(adminUrl)}" style="display:inline-block;padding:10px 18px;background:#111;color:#fff;text-decoration:none;border-radius:99px">Ver no painel Ramos →</a></p>`;
  return { subject: `[Ramos] Nova candidatura individual — ${app.full_name} (${app.ramos_id})`, html: shell("Nova candidatura — Cantor Individual", table) };
}
