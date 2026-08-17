// Shared helpers for the STELLA 2026 application/payment/rooming system.
// Reuses the generic utilities already built for RAMOS rather than duplicating them.
import { sanitize, esc, euros, sendEmail, validateProofFile, randomKey, FROM, VOXLACI_EMAIL } from "./ramos-residency.js";
export { sanitize, esc, euros, sendEmail, validateProofFile, randomKey, FROM, VOXLACI_EMAIL };

export const PRICING = {
  choir_residence: { twin: 24900, single: 30900 }, // per person, cents — twin/double/triple share the same rate
  choir_weekend: 6900,
  choir_day: 4200,
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

export const MODALITY_LABELS = {
  pt: { choir_residence: "STELLA Choral Residence", choir_weekend: "STELLA Choral Weekend", choir_day: "STELLA Choir Day" },
  en: { choir_residence: "STELLA Choral Residence", choir_weekend: "STELLA Choral Weekend", choir_day: "STELLA Choir Day" },
};

export async function generateStellaId(db, id) {
  const stellaId = `STELLA26-${String(id).padStart(4, "0")}`;
  await db.prepare("UPDATE stella_applications SET stella_id = ? WHERE id = ?").bind(stellaId, id).run();
  return stellaId;
}

export async function generateIndividualInterestId(db, id) {
  const stellaId = `STELLA26-IND-${String(id).padStart(4, "0")}`;
  await db.prepare("UPDATE stella_individual_interest SET stella_id = ? WHERE id = ?").bind(stellaId, id).run();
  return stellaId;
}

function shell(title, body) {
  return `<div style="font-family:sans-serif;max-width:640px;margin:0 auto">
  <h2 style="margin-bottom:4px;color:#111">${esc(title)}</h2>
  <p style="color:#888;font-size:13px;margin-top:0">STELLA Festival 2026 · VoxLaci</p>
  ${body}
  <p style="margin-top:28px"><b>STELLA Festival</b><br>VoxLaci<br><a href="mailto:info@voxlaci.com">info@voxlaci.com</a> · WhatsApp +351 925 075 186</p>
</div>`;
}

function summaryTable(lang, app, extraRows = []) {
  const rows = lang === "pt"
    ? [
        ["Coro", app.choir_name],
        ["ID STELLA", app.stella_id],
        ["Modalidade", MODALITY_LABELS.pt[app.application_type]],
        ["Datas preferidas", app.preferred_dates],
        ["N.º de cantores", app.num_singers],
        ["Estado", STATUS_LABELS.pt[app.status]],
        ...extraRows,
      ]
    : [
        ["Choir", app.choir_name],
        ["STELLA ID", app.stella_id],
        ["Modality", MODALITY_LABELS.en[app.application_type]],
        ["Preferred dates", app.preferred_dates],
        ["Number of singers", app.num_singers],
        ["Status", STATUS_LABELS.en[app.status]],
        ...extraRows,
      ];
  return `<table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px">
    ${rows.filter(([, v]) => v !== undefined && v !== null && v !== "").map(([k, v]) => `<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:700;width:42%">${esc(k)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(v)}</td></tr>`).join("")}
  </table>`;
}

export function applicationReceivedEmail(lang, app) {
  const t = lang === "pt"
    ? { subject: `STELLA — Candidatura recebida (${app.stella_id})`, title: "Candidatura recebida", body: `<p>Recebemos a candidatura do coro <b>${esc(app.choir_name)}</b> ao STELLA Festival 2026.</p><p>A candidatura está agora em análise. Vamos entrar em contacto assim que houver uma decisão.</p>` }
    : { subject: `STELLA — Application received (${app.stella_id})`, title: "Application received", body: `<p>We have received <b>${esc(app.choir_name)}</b>'s application to STELLA Festival 2026.</p><p>Your application is now under review. We will be in touch as soon as a decision is made.</p>` };
  return { subject: t.subject, html: shell(t.title, t.body + summaryTable(lang, app)) };
}

export function applicationAcceptedEmail(lang, app) {
  const t = lang === "pt"
    ? { subject: `STELLA — Candidatura aceite (${app.stella_id})`, title: "A sua candidatura foi aceite", body: `<p>Boas notícias — a candidatura do coro <b>${esc(app.choir_name)}</b> foi aceite.</p><p>Os próximos passos (pagamento${app.application_type === "choir_residence" ? " e lista de quartos" : ""}) estão disponíveis na sua área privada STELLA.</p>` }
    : { subject: `STELLA — Application accepted (${app.stella_id})`, title: "Your application has been accepted", body: `<p>Good news — <b>${esc(app.choir_name)}</b>'s application has been accepted.</p><p>The next steps (payment${app.application_type === "choir_residence" ? " and rooming list" : ""}) are available in your private STELLA area.</p>` };
  return { subject: t.subject, html: shell(t.title, t.body + summaryTable(lang, app)) };
}

export function paymentPendingEmail(lang, app) {
  const amountLine = app.amount_total_cents
    ? (lang === "pt" ? `<p>Valor total: <b>${euros(app.amount_total_cents)} €</b></p>` : `<p>Total amount: <b>€${euros(app.amount_total_cents)}</b></p>`)
    : (lang === "pt" ? `<p>O valor total será confirmado após a organização da lista de quartos.</p>` : `<p>The total amount will be confirmed once the rooming list is organised.</p>`);
  const t = lang === "pt"
    ? { subject: `STELLA — Pagamento pendente (${app.stella_id})`, title: "Pagamento pendente", body: `<p>A candidatura do coro <b>${esc(app.choir_name)}</b> está aceite — falta apenas o pagamento para confirmar o lugar.</p>${amountLine}` }
    : { subject: `STELLA — Payment pending (${app.stella_id})`, title: "Payment pending", body: `<p><b>${esc(app.choir_name)}</b>'s application is accepted — payment is the only remaining step to confirm your place.</p>${amountLine}` };
  return { subject: t.subject, html: shell(t.title, t.body + summaryTable(lang, app)) };
}

export function paymentReceivedEmail(lang, app, amountCents) {
  const t = lang === "pt"
    ? { subject: `STELLA — Comprovativo recebido (${app.stella_id})`, title: "Comprovativo de pagamento recebido", body: `<p>Recebemos um comprovativo de pagamento de <b>${euros(amountCents)} €</b> para o coro <b>${esc(app.choir_name)}</b>.</p><p>O pagamento está agora em validação.</p>` }
    : { subject: `STELLA — Payment proof received (${app.stella_id})`, title: "Payment proof received", body: `<p>We received a proof of payment of <b>€${euros(amountCents)}</b> for <b>${esc(app.choir_name)}</b>.</p><p>The payment is now being verified.</p>` };
  return { subject: t.subject, html: shell(t.title, t.body + summaryTable(lang, app)) };
}

export function paymentConfirmedEmail(lang, app, amountCents) {
  const balance = (app.amount_total_cents || 0) - app.amount_paid_cents;
  const balanceLine = lang === "pt"
    ? `<p>Total: <b>${app.amount_total_cents ? euros(app.amount_total_cents) + " €" : "a confirmar"}</b> · Pago: <b>${euros(app.amount_paid_cents)} €</b> · Saldo: <b>${app.amount_total_cents ? euros(balance) + " €" : "a confirmar"}</b></p>`
    : `<p>Total: <b>${app.amount_total_cents ? "€" + euros(app.amount_total_cents) : "to be confirmed"}</b> · Paid: <b>€${euros(app.amount_paid_cents)}</b> · Balance: <b>${app.amount_total_cents ? "€" + euros(balance) : "to be confirmed"}</b></p>`;
  const t = lang === "pt"
    ? { subject: `STELLA — Pagamento confirmado (${app.stella_id})`, title: "Pagamento confirmado", body: `<p>Confirmámos um pagamento de <b>${euros(amountCents)} €</b> do coro <b>${esc(app.choir_name)}</b>.</p>${balanceLine}` }
    : { subject: `STELLA — Payment confirmed (${app.stella_id})`, title: "Payment confirmed", body: `<p>We confirmed a payment of <b>€${euros(amountCents)}</b> from <b>${esc(app.choir_name)}</b>.</p>${balanceLine}` };
  return { subject: t.subject, html: shell(t.title, t.body + summaryTable(lang, app)) };
}

export function registrationConfirmedEmail(lang, app) {
  const t = lang === "pt"
    ? { subject: `STELLA — Inscrição confirmada (${app.stella_id})`, title: "A sua inscrição está confirmada", body: `<p>A inscrição do coro <b>${esc(app.choir_name)}</b> no STELLA Festival 2026 está oficialmente confirmada.</p>${app.application_type === "choir_residence" ? (lang === "pt" ? "<p>Pode agora completar a lista de quartos na sua área privada STELLA.</p>" : "") : ""}` }
    : { subject: `STELLA — Registration confirmed (${app.stella_id})`, title: "Your registration is confirmed", body: `<p><b>${esc(app.choir_name)}</b>'s registration at STELLA Festival 2026 is now officially confirmed.</p>${app.application_type === "choir_residence" ? "<p>You can now complete the rooming list in your private STELLA area.</p>" : ""}` };
  return { subject: t.subject, html: shell(t.title, t.body + summaryTable(lang, app)) };
}

export function informationRequiredEmail(lang, app, message) {
  const t = lang === "pt"
    ? { subject: `STELLA — Precisamos de mais informação (${app.stella_id})`, title: "Precisamos de mais informação", body: `<p>Sobre a candidatura do coro <b>${esc(app.choir_name)}</b>:</p><p>${esc(message)}</p><p>Responda a este email ou contacte-nos via WhatsApp +351 925 075 186.</p>` }
    : { subject: `STELLA — We need more information (${app.stella_id})`, title: "We need more information", body: `<p>About <b>${esc(app.choir_name)}</b>'s application:</p><p>${esc(message)}</p><p>Please reply to this email or contact us via WhatsApp +351 925 075 186.</p>` };
  return { subject: t.subject, html: shell(t.title, t.body + summaryTable(lang, app)) };
}

export function finalFestivalInformationEmail(lang, app, message) {
  const t = lang === "pt"
    ? { subject: `STELLA — Informação final do festival (${app.stella_id})`, title: "Informação final do festival", body: `<p>${(message || "").replace(/\n/g, "<br>")}</p>` }
    : { subject: `STELLA — Final festival information (${app.stella_id})`, title: "Final festival information", body: `<p>${(message || "").replace(/\n/g, "<br>")}</p>` };
  return { subject: t.subject, html: shell(t.title, t.body + summaryTable(lang, app)) };
}

export function cancelledEmail(lang, app) {
  const t = lang === "pt"
    ? { subject: `STELLA — Inscrição cancelada (${app.stella_id})`, title: "Inscrição cancelada", body: `<p>A inscrição do coro <b>${esc(app.choir_name)}</b> foi cancelada. Se isto não era esperado, contacte-nos.</p>` }
    : { subject: `STELLA — Registration cancelled (${app.stella_id})`, title: "Registration cancelled", body: `<p><b>${esc(app.choir_name)}</b>'s registration has been cancelled. If this was not expected, please contact us.</p>` };
  return { subject: t.subject, html: shell(t.title, t.body + summaryTable(lang, app)) };
}

export function individualInterestReceivedEmail(lang, entry) {
  const t = lang === "pt"
    ? { subject: `STELLA — Interesse registado (${entry.stella_id})`, title: "Interesse registado", body: `<p>Obrigado, <b>${esc(entry.full_name)}</b> — registámos o seu interesse em participar no STELLA Festival 2026 como cantor/a individual.</p><p>Assim que os workshops, passes e preços forem confirmados, vamos contactá-lo(a) diretamente para <b>${esc(entry.email)}</b>.</p><p>ID: <b>${entry.stella_id}</b></p>` }
    : { subject: `STELLA — Interest registered (${entry.stella_id})`, title: "Interest registered", body: `<p>Thank you, <b>${esc(entry.full_name)}</b> — we've registered your interest in taking part in STELLA Festival 2026 as an individual singer.</p><p>As soon as workshops, passes and pricing are confirmed, we'll contact you directly at <b>${esc(entry.email)}</b>.</p><p>ID: <b>${entry.stella_id}</b></p>` };
  return { subject: t.subject, html: shell(t.title, t.body) };
}

export function individualInterestInternalEmail(entry) {
  const rows = [
    ["ID", entry.stella_id],
    ["Nome", entry.full_name],
    ["Email", entry.email],
    ["País", entry.country || "—"],
    ["Telefone", entry.phone || "—"],
    ["Interesses", entry.interests || "—"],
    ["Notas", entry.notes || "—"],
  ];
  const table = `<table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px">
    ${rows.map(([k, v]) => `<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:700;width:35%">${esc(k)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(v)}</td></tr>`).join("")}
  </table>`;
  return { subject: `[STELLA] Novo interesse individual — ${entry.full_name} (${entry.stella_id})`, html: shell("Novo interesse — Cantor Individual", table) };
}

export function internalNotificationEmail(app, adminUrl) {
  const rows = [
    ["ID STELLA", app.stella_id],
    ["Coro", app.choir_name],
    ["Modalidade", MODALITY_LABELS.pt[app.application_type]],
    ["País / Cidade", `${app.country || "—"} / ${app.city || "—"}`],
    ["Maestro", app.conductor_name],
    ["Contacto", `${app.contact_person || "—"} · ${app.email} · ${app.phone || app.whatsapp || "—"}`],
    ["N.º cantores", app.num_singers],
    ["N.º acompanhantes", app.num_companions],
    ["Datas preferidas", app.preferred_dates],
    ["Idioma", app.language],
  ];
  const table = `<table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px">
    ${rows.map(([k, v]) => `<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:700;width:42%">${esc(k)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(v)}</td></tr>`).join("")}
  </table>
  <p style="margin-top:20px"><a href="${esc(adminUrl)}" style="display:inline-block;padding:10px 18px;background:#111;color:#fff;text-decoration:none;border-radius:99px">Ver no painel STELLA →</a></p>`;
  return { subject: `[STELLA] Nova candidatura — ${app.choir_name} (${app.stella_id})`, html: shell("Nova candidatura STELLA", table) };
}
