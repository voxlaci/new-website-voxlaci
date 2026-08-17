// Shared helpers for voX±Pop registration/interest capture.
// No online payment — actual payment happens on Eventbrite; this only records interest,
// mirroring the pattern of functions/eventos/stella/api/individual.js.
import { sanitize, esc, sendEmail, FROM, VOXLACI_EMAIL } from "./ramos-residency.js";
export { sanitize, esc, sendEmail, FROM, VOXLACI_EMAIL };

export const CITY_LABELS = {
  lisboa: "Lisboa", cascais: "Cascais", porto: "Porto",
  monopoli: "Monopoli", london: "London", dakar: "Dakar",
};

const CITY_CODES = {
  lisboa: "LIS", cascais: "CAS", porto: "OPO",
  monopoli: "MPL", london: "LON", dakar: "DKR",
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

function shell(title, body) {
  return `<div style="font-family:sans-serif;max-width:640px;margin:0 auto">
  <h2 style="margin-bottom:4px;color:#111">${esc(title)}</h2>
  <p style="color:#888;font-size:13px;margin-top:0">voX±Pop · VoxLaci</p>
  ${body}
  <p style="margin-top:28px"><b>voX±Pop</b><br>VoxLaci<br><a href="mailto:info@voxlaci.com">info@voxlaci.com</a></p>
</div>`;
}

const OPTION_LABELS = {
  pt: { festival_only: "Festival · 99 €", festival_dinner: "Festival + Jantar Final · 124 €" },
  en: { festival_only: "Festival · €99", festival_dinner: "Festival + Final Dinner · €124" },
};

function summaryTable(lang, reg) {
  const rows = lang === "pt"
    ? [
        ["ID", reg.voxpop_id],
        ["Cidade", CITY_LABELS[reg.city_slug] || reg.city_slug],
        ["Nome", reg.full_name],
        ["Opção", OPTION_LABELS.pt[reg.participation_option]],
      ]
    : [
        ["ID", reg.voxpop_id],
        ["City", CITY_LABELS[reg.city_slug] || reg.city_slug],
        ["Name", reg.full_name],
        ["Option", OPTION_LABELS.en[reg.participation_option]],
      ];
  return `<table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px">
    ${rows.map(([k, v]) => `<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:700;width:35%">${esc(k)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(v)}</td></tr>`).join("")}
  </table>`;
}

export function registrationReceivedEmail(lang, reg, eventbriteUrl) {
  const t = lang === "pt"
    ? {
        subject: `voX±Pop — Inscrição registada (${reg.voxpop_id})`,
        title: "Inscrição registada",
        body: `<p>Obrigado, <b>${esc(reg.full_name)}</b> — registámos o seu interesse no voX±Pop ${esc(CITY_LABELS[reg.city_slug] || "")}.</p><p>Este registo <b>não é um bilhete</b>. Para garantir o seu lugar, complete a compra no Eventbrite${eventbriteUrl ? `: <a href="${esc(eventbriteUrl)}">${esc(eventbriteUrl)}</a>` : "."}</p>`,
      }
    : {
        subject: `voX±Pop — Registration recorded (${reg.voxpop_id})`,
        title: "Registration recorded",
        body: `<p>Thank you, <b>${esc(reg.full_name)}</b> — we've recorded your interest in voX±Pop ${esc(CITY_LABELS[reg.city_slug] || "")}.</p><p>This is <b>not a ticket</b>. To secure your place, complete your purchase on Eventbrite${eventbriteUrl ? `: <a href="${esc(eventbriteUrl)}">${esc(eventbriteUrl)}</a>` : "."}</p>`,
      };
  return { subject: t.subject, html: shell(t.title, t.body + summaryTable(lang, reg)) };
}

export function registrationInternalEmail(reg) {
  const rows = [
    ["ID", reg.voxpop_id],
    ["Cidade", CITY_LABELS[reg.city_slug] || reg.city_slug],
    ["Tipo", reg.participation_type],
    ["Nome", reg.full_name],
    ["Coro", reg.choir_name || "—"],
    ["País", reg.country || "—"],
    ["Contacto", `${reg.email} · ${reg.whatsapp || "—"}`],
    ["Opção", OPTION_LABELS.pt[reg.participation_option]],
    ["N.º cantores", reg.num_singers || "—"],
    ["Notas", reg.notes || "—"],
  ];
  const table = `<table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px">
    ${rows.map(([k, v]) => `<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:700;width:35%">${esc(k)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(v)}</td></tr>`).join("")}
  </table>`;
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
