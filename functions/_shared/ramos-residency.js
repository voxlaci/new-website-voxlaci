// Shared helpers for the RAMOS 2027 Artistic Residency registration system.
// Reused by functions/ramos/residency/api/* and functions/ramos/residency/admin/*.

export const TOTAL_ROOMS = 30;
export const PRICE_SINGLE_CENTS = 112700; // €1,127
export const PRICE_SHARED_CENTS = 98700;  // €987
export const HELD_STATUSES = ["payment_submitted", "confirmed"];
export const FROM = "VoxLaci <info@voxlaci.com>";
export const VOXLACI_EMAIL = "info@voxlaci.com";
export const SEMINARIO_EMAIL = "acolhimento.sta@espiritanos.pt";

const REF_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O, 1/I — avoids transcription errors

export function sanitize(value, max = 2000) {
  return (value || "").toString().trim().slice(0, max);
}

export function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

export function euros(cents) {
  return (cents / 100).toLocaleString("pt-PT", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export async function sendEmail(apiKey, payload) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Resend HTTP ${res.status}: ${JSON.stringify(body)}`);
  return body; // { id: "..." }
}

export async function generateReference(db) {
  for (let attempt = 0; attempt < 8; attempt++) {
    let suffix = "";
    for (let i = 0; i < 6; i++) suffix += REF_CHARS[Math.floor(Math.random() * REF_CHARS.length)];
    const reference = `RAMOS27-${suffix}`;
    const existing = await db
      .prepare("SELECT id FROM residency_registrations WHERE reference = ?")
      .bind(reference)
      .first();
    if (!existing) return reference;
  }
  throw new Error("Não foi possível gerar uma referência única após 8 tentativas.");
}

// ── Proof-of-payment file validation ─────────────────────────────────────────

const ALLOWED_EXT = ["jpg", "jpeg", "png", "pdf"];
const ALLOWED_MIME = ["image/jpeg", "image/png", "application/pdf"];
const MAX_PROOF_BYTES = 8 * 1024 * 1024; // 8MB

const MAGIC_CHECKS = [
  { mime: "application/pdf", bytes: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
];

export async function validateProofFile(file) {
  if (!file || typeof file !== "object" || !("arrayBuffer" in file) || file.size === 0) {
    return { ok: false, reason: "ausente" };
  }
  if (file.size > MAX_PROOF_BYTES) {
    return { ok: false, reason: "tamanho" };
  }
  const ext = (file.name || "").split(".").pop().toLowerCase();
  if (!ALLOWED_EXT.includes(ext)) {
    return { ok: false, reason: "extensao" };
  }
  if (file.type && !ALLOWED_MIME.includes(file.type)) {
    return { ok: false, reason: "mime" };
  }
  const head = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const matchesMagic = MAGIC_CHECKS.some(({ bytes }) => bytes.every((b, i) => head[i] === b));
  if (!matchesMagic) {
    return { ok: false, reason: "assinatura" };
  }
  return { ok: true, ext };
}

export function randomKey(reference, ext) {
  const rand = crypto.randomUUID();
  return `residency/${reference}/${rand}.${ext}`;
}

// ── Email bodies ──────────────────────────────────────────────────────────────

const T = {
  pt: {
    roomLabel: { single: "Quarto Individual", shared: "Quarto Duplo / Triplo" },
    submittedSubject: (ref) => `RAMOS — Comprovativo de pagamento recebido (${ref})`,
    submittedTitle: "Comprovativo de pagamento recebido",
    submittedBody: (ref) => `<p>Recebemos a sua inscrição na Residência Artística RAMOS e o respetivo comprovativo de pagamento.</p>
<p><b>Referência da inscrição:</b> ${esc(ref)}</p>
<p>O pagamento encontra-se agora em validação.</p>
<p>A sua inscrição será confirmada assim que o pagamento for validado.</p>`,
    confirmedSubject: (ref) => `RAMOS — Inscrição confirmada (${ref})`,
    confirmedTitle: "A sua inscrição está confirmada",
    rejectedSubject: (ref) => `RAMOS — É necessário um novo comprovativo (${ref})`,
    rejectedTitle: "Precisamos de um novo comprovativo de pagamento",
    rejectedBody: (ref) => `<p>Não foi possível validar o comprovativo de pagamento associado à sua inscrição na Residência Artística RAMOS.</p>
<p><b>Referência da inscrição:</b> ${esc(ref)}</p>
<p>Por favor contacte-nos em info@voxlaci.com para enviar um novo comprovativo.</p>`,
  },
  en: {
    roomLabel: { single: "Single Room", shared: "Double / Triple Room" },
    submittedSubject: (ref) => `RAMOS — Payment documentation received (${ref})`,
    submittedTitle: "Payment documentation received",
    submittedBody: (ref) => `<p>We have received your RAMOS Artistic Residency registration and proof of payment.</p>
<p><b>Registration reference:</b> ${esc(ref)}</p>
<p>Your payment is now being verified.</p>
<p>Your registration will be confirmed as soon as the payment has been validated.</p>`,
    confirmedSubject: (ref) => `RAMOS — Registration confirmed (${ref})`,
    confirmedTitle: "Your registration is confirmed",
    rejectedSubject: (ref) => `RAMOS — A new proof of payment is needed (${ref})`,
    rejectedTitle: "We need a new proof of payment",
    rejectedBody: (ref) => `<p>We were unable to validate the proof of payment linked to your RAMOS Artistic Residency registration.</p>
<p><b>Registration reference:</b> ${esc(ref)}</p>
<p>Please contact us at info@voxlaci.com to submit a new proof of payment.</p>`,
  },
};

function shell(title, body) {
  return `<div style="font-family:sans-serif;max-width:640px;margin:0 auto">
  <h2 style="margin-bottom:4px;color:#111">${esc(title)}</h2>
  <p style="color:#888;font-size:13px;margin-top:0">RAMOS – Palm Sunday Festival · Artistic Residency</p>
  ${body}
  <p style="margin-top:28px"><b>RAMOS – Palm Sunday Festival</b><br>VoxLaci<br><a href="mailto:info@voxlaci.com">info@voxlaci.com</a></p>
</div>`;
}

export function submittedEmail(lang, reference) {
  const t = T[lang];
  return { subject: t.submittedSubject(reference), html: shell(t.submittedTitle, t.submittedBody(reference)) };
}

export function rejectedEmail(lang, reference) {
  const t = T[lang];
  return { subject: t.rejectedSubject(reference), html: shell(t.rejectedTitle, t.rejectedBody(reference)) };
}

export function confirmedEmail(lang, reg) {
  const t = T[lang];
  const roomLabel = t.roomLabel[reg.room_type];
  const rows = lang === "pt"
    ? [
        ["Participante", reg.full_name],
        ["Referência da inscrição", reg.reference],
        ["Festival", "RAMOS – Palm Sunday Festival"],
        ["Residência Artística", "15–22 de março de 2027"],
        ["Quarto", roomLabel],
        ["Valor pago", `${euros(reg.amount_due_cents)} €`],
        ["Estado do pagamento", "Confirmado"],
        ["Estado da inscrição", "Confirmada"],
        ["Contacto RAMOS", "info@voxlaci.com"],
      ]
    : [
        ["Participant", reg.full_name],
        ["Registration reference", reg.reference],
        ["Festival", "RAMOS – Palm Sunday Festival"],
        ["Artistic Residency", "15–22 March 2027"],
        ["Room", roomLabel],
        ["Amount paid", `€${euros(reg.amount_due_cents)}`],
        ["Payment status", "Confirmed"],
        ["Registration status", "Confirmed"],
        ["RAMOS contact", "info@voxlaci.com"],
      ];
  const table = `<table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px">
    ${rows.map(([k, v]) => `<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:700;width:42%">${esc(k)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(v)}</td></tr>`).join("")}
  </table>`;
  return { subject: t.confirmedSubject(reg.reference), html: shell(t.confirmedTitle, table) };
}

export function seminarioEmail(reg) {
  const roomLabel = { single: "SINGLE", shared: reg.share_known ? "DOUBLE / TRIPLE (roommate requested)" : "DOUBLE / TRIPLE (to be allocated)" }[reg.room_type];
  const roommateLine = reg.room_type === "shared"
    ? (reg.share_known && reg.share_names
        ? `<p><b>Requested roommate(s):</b> ${esc(reg.share_names)}</p>`
        : `<p><b>Shared room allocation:</b> RAMOS will coordinate the participant's shared-room allocation.</p>`)
    : "";
  const html = `<div style="font-family:sans-serif;max-width:640px;margin:0 auto">
  <p>Dear Sir/Madam,</p>
  <p>We confirm the following participant for accommodation during the RAMOS – Palm Sunday Festival Artistic Residency.</p>
  <p><b>Participant:</b> ${esc(reg.full_name)}</p>
  <p><b>Accommodation:</b> 15–22 March 2027</p>
  <p><b>Arrival:</b> 15 March 2027</p>
  <p><b>Departure:</b> 22 March 2027, after breakfast</p>
  <p><b>Room:</b> ${roomLabel}</p>
  ${roommateLine}
  <p style="margin-top:24px">Kind regards,<br><b>RAMOS – Palm Sunday Festival</b><br>VoxLaci<br><a href="mailto:info@voxlaci.com">info@voxlaci.com</a></p>
</div>`;
  return { subject: `RAMOS Artistic Residency 2027 – Accommodation – ${reg.full_name}`, html };
}

export function internalNotificationEmail(reg, adminUrl) {
  const rows = [
    ["Referência", reg.reference],
    ["Nome completo", reg.full_name],
    ["Email", reg.email],
    ["País", reg.country],
    ["Telemóvel / WhatsApp", reg.mobile],
    ["Coro / Instituição", reg.choir_institution],
    ["Função", reg.role],
    ["Quarto", reg.room_type === "single" ? "Individual" : "Duplo / Triplo"],
    ["Partilha pedida", reg.room_type === "shared" ? (reg.share_known ? "Sim" : "Não — atribuir") : "—"],
    ["Nome(s) para partilha", reg.share_names || "—"],
    ["Valor", `${euros(reg.amount_due_cents)} €`],
    ["Modalidade de pagamento", reg.payment_method],
    ["Estado", reg.status],
  ];
  const table = `<table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px">
    ${rows.map(([k, v]) => `<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:700;width:42%">${esc(k)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(v)}</td></tr>`).join("")}
  </table>
  <p style="margin-top:20px"><a href="${esc(adminUrl)}" style="display:inline-block;padding:10px 18px;background:#111;color:#fff;text-decoration:none;border-radius:99px">Ver no painel de administração →</a></p>
  <p style="font-size:12px;color:#888">O comprovativo de pagamento está disponível apenas através do painel de administração (acesso protegido) — não está anexado a este email.</p>`;
  return {
    subject: `[RAMOS] Nova inscrição — Residência Artística (${reg.reference})`,
    html: shell("Nova inscrição — Residência Artística RAMOS", table),
  };
}
