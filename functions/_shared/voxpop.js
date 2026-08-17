// Shared helpers for the voX±Pop editions/capacity/registration/payment system.
// Reuses the generic utilities already built for RAMOS/STELLA rather than duplicating them.
import { sanitize, esc, euros, sendEmail, validateProofFile, FROM, VOXLACI_EMAIL } from "./ramos-residency.js";
export { sanitize, esc, euros, sendEmail, validateProofFile, FROM, VOXLACI_EMAIL };

export const CITY_LABELS = {
  lisboa: "Lisboa", cascais: "Cascais", porto: "Porto",
  monopoli: "Monopoli", london: "London", dakar: "Dakar",
};

const CITY_CODES = {
  lisboa: "LIS", cascais: "CAS", porto: "OPO",
  monopoli: "MPL", london: "LON", dakar: "DKR",
};

export const STATUS_LABELS = {
  pt: {
    received: "Recebida",
    payment_pending: "A aguardar pagamento",
    payment_review: "Pagamento em verificação",
    confirmed: "Confirmada",
    cancelled: "Cancelada",
    waitlist: "Lista de espera",
  },
  en: {
    received: "Received",
    payment_pending: "Awaiting payment",
    payment_review: "Payment under review",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    waitlist: "Waitlist",
  },
};

export const PAYMENT_METHOD_LABELS = {
  pt: { bank_transfer: "Transferência Bancária", paypal: "PayPal", revolut: "Revolut", mbway: "MB Way" },
  en: { bank_transfer: "Bank Transfer", paypal: "PayPal", revolut: "Revolut", mbway: "MB Way" },
};

// Real, already-published VoxLaci payment details (same as used in RAMOS/STELLA) — nothing invented here.
export const PAYMENT_DETAILS = {
  bank_transfer: { beneficiary: "ASSOCIAÇÃO VOX SDR", iban: "PT50 0036 0196 9910 0035 3991 7", bic: "MPIOPTPL", bank: "Banco Montepio Geral" },
  paypal: { account: "info@voxlaci.com" },
  mbway: { number: "938 407 985" },
};

export async function generateVoxpopId(db, citySlug, id) {
  const code = CITY_CODES[citySlug] || "XXX";
  const voxpopId = `VOXPOP-${code}-${String(id).padStart(4, "0")}`;
  await db.prepare("UPDATE voxpop_registrations SET voxpop_id = ? WHERE id = ?").bind(voxpopId, id).run();
  return voxpopId;
}

export async function generateProposalId(db, id) {
  const voxpopId = `VOXPOP-CITY-${String(id).padStart(4, "0")}`;
  await db.prepare("UPDATE voxpop_city_proposals SET voxpop_id = ? WHERE id = ?").bind(voxpopId, id).run();
  return voxpopId;
}

// Server-side authoritative price calculation — never trust client-submitted totals.
export function calcTotal(edition, { participationType, numParticipants, dinnerSelected }) {
  const base = participationType === "group" && edition.price_group_cents
    ? edition.price_group_cents * numParticipants
    : (edition.price_individual_cents || 0) * numParticipants;
  const dinner = dinnerSelected && edition.dinner_addon_cents ? edition.dinner_addon_cents * numParticipants : 0;
  return base + dinner;
}

export function availableSeats(edition) {
  return Math.max(0, edition.capacity - edition.confirmed_count);
}

export function publicStatus(edition) {
  if (edition.status === "coming_soon" || edition.status === "preparing" || edition.status === "closed" || edition.status === "done") {
    return edition.status;
  }
  const available = availableSeats(edition);
  if (available <= 0) return "sold_out";
  if (available <= 15) return "last_spots";
  return "open";
}

function shell(title, body) {
  return `<div style="font-family:sans-serif;max-width:640px;margin:0 auto">
  <h2 style="margin-bottom:4px;color:#111">${esc(title)}</h2>
  <p style="color:#888;font-size:13px;margin-top:0">voX±Pop · VoxLaci</p>
  ${body}
  <p style="margin-top:28px"><b>voX±Pop</b><br>VoxLaci<br><a href="mailto:info@voxlaci.com">info@voxlaci.com</a></p>
</div>`;
}

function summaryTable(lang, reg, edition) {
  const rows = lang === "pt"
    ? [
        ["ID", reg.voxpop_id],
        ["Cidade", CITY_LABELS[edition.slug] || edition.slug],
        ["Nome", reg.full_name],
        ["Tipo", reg.participation_type === "group" ? "Grupo / Coro" : "Individual"],
        ["N.º de participantes", reg.num_participants],
        ["Total", reg.amount_total_cents != null ? `${euros(reg.amount_total_cents)} €` : "—"],
        ["Pago", `${euros(reg.amount_paid_cents || 0)} €`],
        ["Estado", STATUS_LABELS.pt[reg.status] || reg.status],
      ]
    : [
        ["ID", reg.voxpop_id],
        ["City", CITY_LABELS[edition.slug] || edition.slug],
        ["Name", reg.full_name],
        ["Type", reg.participation_type === "group" ? "Group / Choir" : "Individual"],
        ["Participants", reg.num_participants],
        ["Total", reg.amount_total_cents != null ? `€${euros(reg.amount_total_cents)}` : "—"],
        ["Paid", `€${euros(reg.amount_paid_cents || 0)}`],
        ["Status", STATUS_LABELS.en[reg.status] || reg.status],
      ];
  return `<table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px">
    ${rows.filter(([, v]) => v !== undefined && v !== null && v !== "").map(([k, v]) => `<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:700;width:40%">${esc(k)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(v)}</td></tr>`).join("")}
  </table>`;
}

export function registrationReceivedEmail(lang, reg, edition) {
  const t = lang === "pt"
    ? { subject: `voX±Pop — Inscrição recebida (${reg.voxpop_id})`, title: "Inscrição recebida", body: `<p>Obrigado, <b>${esc(reg.full_name)}</b> — a sua inscrição no voX±Pop ${esc(CITY_LABELS[edition.slug] || "")} foi recebida.</p><p>Esta inscrição fica agora <b>a aguardar pagamento</b>. Assim que enviar o comprovativo, a nossa equipa valida o pagamento e confirma o seu lugar.</p>` }
    : { subject: `voX±Pop — Registration received (${reg.voxpop_id})`, title: "Registration received", body: `<p>Thank you, <b>${esc(reg.full_name)}</b> — your voX±Pop ${esc(CITY_LABELS[edition.slug] || "")} registration has been received.</p><p>This registration is now <b>awaiting payment</b>. Once you send your proof of payment, our team will verify it and confirm your place.</p>` };
  return { subject: t.subject, html: shell(t.title, t.body + summaryTable(lang, reg, edition)) };
}

export function waitlistEmail(lang, reg, edition) {
  const t = lang === "pt"
    ? { subject: `voX±Pop — Lista de espera (${reg.voxpop_id})`, title: "Está na lista de espera", body: `<p>A edição voX±Pop ${esc(CITY_LABELS[edition.slug] || "")} está com a capacidade preenchida. A sua inscrição ficou registada em <b>lista de espera</b> — se houver desistências, entraremos em contacto pela ordem de chegada.</p>` }
    : { subject: `voX±Pop — Waitlist (${reg.voxpop_id})`, title: "You're on the waitlist", body: `<p>voX±Pop ${esc(CITY_LABELS[edition.slug] || "")} is currently at capacity. Your registration has been placed on the <b>waitlist</b> — if a place opens up, we will contact you in order of arrival.</p>` };
  return { subject: t.subject, html: shell(t.title, t.body + summaryTable(lang, reg, edition)) };
}

export function paymentReceivedEmail(lang, reg, edition, amountCents) {
  const t = lang === "pt"
    ? { subject: `voX±Pop — Comprovativo recebido (${reg.voxpop_id})`, title: "Comprovativo de pagamento recebido", body: `<p>Recebemos um comprovativo de pagamento de <b>${euros(amountCents)} €</b>.</p><p>O pagamento está agora <b>em verificação</b>.</p>` }
    : { subject: `voX±Pop — Payment proof received (${reg.voxpop_id})`, title: "Payment proof received", body: `<p>We received a proof of payment of <b>€${euros(amountCents)}</b>.</p><p>The payment is now <b>under review</b>.</p>` };
  return { subject: t.subject, html: shell(t.title, t.body + summaryTable(lang, reg, edition)) };
}

export function registrationConfirmedEmail(lang, reg, edition) {
  const t = lang === "pt"
    ? { subject: `voX±Pop — Inscrição confirmada (${reg.voxpop_id})`, title: "A sua inscrição está confirmada", body: `<p>A inscrição de <b>${esc(reg.full_name)}</b> no voX±Pop ${esc(CITY_LABELS[edition.slug] || "")} está oficialmente <b>confirmada</b>. Até já!</p>` }
    : { subject: `voX±Pop — Registration confirmed (${reg.voxpop_id})`, title: "Your registration is confirmed", body: `<p><b>${esc(reg.full_name)}</b>'s registration at voX±Pop ${esc(CITY_LABELS[edition.slug] || "")} is officially <b>confirmed</b>. See you there!</p>` };
  return { subject: t.subject, html: shell(t.title, t.body + summaryTable(lang, reg, edition)) };
}

export function cancelledEmail(lang, reg, edition) {
  const t = lang === "pt"
    ? { subject: `voX±Pop — Inscrição cancelada (${reg.voxpop_id})`, title: "Inscrição cancelada", body: `<p>A inscrição de <b>${esc(reg.full_name)}</b> foi cancelada. Se isto não era esperado, contacte-nos.</p>` }
    : { subject: `voX±Pop — Registration cancelled (${reg.voxpop_id})`, title: "Registration cancelled", body: `<p><b>${esc(reg.full_name)}</b>'s registration has been cancelled. If this was not expected, please contact us.</p>` };
  return { subject: t.subject, html: shell(t.title, t.body + summaryTable(lang, reg, edition)) };
}

export function registrationInternalEmail(reg, edition, adminUrl) {
  const rows = [
    ["ID", reg.voxpop_id],
    ["Cidade", CITY_LABELS[edition.slug] || edition.slug],
    ["Tipo", reg.participation_type === "group" ? "Grupo / Coro" : "Individual"],
    ["Nome", reg.full_name],
    ["Coro", reg.choir_name || "—"],
    ["País", reg.country || "—"],
    ["Contacto", `${reg.email} · ${reg.whatsapp || "—"}`],
    ["N.º participantes", reg.num_participants],
    ["Total", reg.amount_total_cents != null ? `${euros(reg.amount_total_cents)} €` : "—"],
    ["Estado", STATUS_LABELS.pt[reg.status] || reg.status],
    ["Notas", reg.notes || "—"],
  ];
  const table = `<table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px">
    ${rows.map(([k, v]) => `<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:700;width:35%">${esc(k)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(v)}</td></tr>`).join("")}
  </table>
  <p style="margin-top:20px"><a href="${esc(adminUrl)}" style="display:inline-block;padding:10px 18px;background:#111;color:#fff;text-decoration:none;border-radius:99px">Ver no painel voX±Pop →</a></p>`;
  return { subject: `[voX±Pop] Nova inscrição — ${reg.full_name} (${reg.voxpop_id})`, html: shell("Nova inscrição voX±Pop", table) };
}

export function proposalReceivedEmail(lang, proposal) {
  const t = lang === "pt"
    ? { subject: `voX±Pop — Proposta recebida (${proposal.voxpop_id})`, title: "Proposta recebida", body: `<p>Obrigado, <b>${esc(proposal.full_name)}</b> — recebemos a sua proposta para levar o voX±Pop a <b>${esc(proposal.city)}</b>.</p><p>A direção artística vai analisar e entrar em contacto.</p>` }
    : { subject: `voX±Pop — Proposal received (${proposal.voxpop_id})`, title: "Proposal received", body: `<p>Thank you, <b>${esc(proposal.full_name)}</b> — we received your proposal to bring voX±Pop to <b>${esc(proposal.city)}</b>.</p><p>The artistic direction will review it and get in touch.</p>` };
  return { subject: t.subject, html: shell(t.title, t.body) };
}

export function proposalInternalEmail(proposal) {
  const rows = [
    ["ID", proposal.voxpop_id],
    ["Nome", proposal.full_name],
    ["Organização", proposal.organisation || "—"],
    ["Função", proposal.role || "—"],
    ["Cidade", proposal.city],
    ["País", proposal.country || "—"],
    ["Contacto", `${proposal.email} · ${proposal.whatsapp || "—"}`],
    ["Mensagem", proposal.message || "—"],
  ];
  const table = `<table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px">
    ${rows.map(([k, v]) => `<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:700;width:35%">${esc(k)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(v)}</td></tr>`).join("")}
  </table>`;
  return { subject: `[voX±Pop] Nova proposta de cidade — ${proposal.city} (${proposal.voxpop_id})`, html: shell("Nova proposta — Bring voX±Pop to your city", table) };
}
