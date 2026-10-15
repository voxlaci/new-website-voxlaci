import { sanitize, esc, sendEmail, validateProofFile, FROM, VOXLACI_EMAIL } from "../../../_shared/stella.js";

const PRODUCT = "STELLA 2026 – Individual Residence";
const ACCOMMODATION = {
  single: { amount: 36900, people: 1, pt: "Quarto individual", en: "Single Room" },
  shared: { amount: 63800, people: 2, pt: "Quarto duplo/twin partilhado", en: "Shared Double/Twin Room" },
};
const WEEKENDS = {
  "2026-12-04_06": { pt: "4–6 de dezembro de 2026", en: "4–6 December 2026" },
  "2026-12-11_13": { pt: "11–13 de dezembro de 2026", en: "11–13 December 2026" },
};
const ROLES = {
  singer: { pt: "Cantor/a", en: "Singer" },
  conductor: { pt: "Maestro/a", en: "Conductor" },
  music_teacher: { pt: "Professor/a de música", en: "Music teacher" },
  other: { pt: "Outro", en: "Other" },
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

const rateLimiter = new Map();
function allowed(ip) {
  const now = Date.now();
  const current = rateLimiter.get(ip);
  if (!current || now - current.start > 60 * 60 * 1000) {
    rateLimiter.set(ip, { start: now, count: 1 });
    return true;
  }
  if (current.count >= 5) return false;
  current.count++;
  return true;
}

function emailShell(title, body) {
  return `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#171717"><h1 style="font-size:25px">${esc(title)}</h1><p style="color:#6f6f6f">STELLA Festival 2026 · VoxLaci</p>${body}<p style="margin-top:28px"><b>STELLA Festival · VoxLaci</b><br><a href="https://voxlaci.com/eventos/stella/">voxlaci.com/eventos/stella</a><br><a href="mailto:info@voxlaci.com">info@voxlaci.com</a> · WhatsApp +351 925 075 186</p></div>`;
}

function rows(items) {
  return `<table style="width:100%;border-collapse:collapse;margin-top:18px">${items.map(([key, value]) => `<tr><td style="padding:9px;background:#f4f2ee;font-weight:700;width:42%">${esc(key)}</td><td style="padding:9px;border-bottom:1px solid #e6e2dc">${esc(value || "—")}</td></tr>`).join("")}</table>`;
}

export async function onRequestPost({ request, env }) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (!allowed(ip)) return json({ ok: false, error: "rate_limit" }, 429);
  if (!env.DB || !env.RESIDENCY_PROOFS) return json({ ok: false, error: "not_configured" }, 500);

  let form;
  try { form = await request.formData(); } catch { return json({ ok: false, error: "invalid_request" }, 400); }
  if (form.get("website")) return json({ ok: true, reference: "OK" });

  const language = form.get("language") === "pt" ? "pt" : "en";
  const fullName = sanitize(form.get("full_name"), 200);
  const email = sanitize(form.get("email"), 200);
  const phone = sanitize(form.get("phone"), 80);
  const country = sanitize(form.get("country"), 120);
  const dateOfBirth = sanitize(form.get("date_of_birth"), 20);
  const weekend = sanitize(form.get("weekend"), 30);
  const accommodationType = sanitize(form.get("accommodation_type"), 20);
  const secondGuestName = sanitize(form.get("second_guest_name"), 200);
  const role = sanitize(form.get("participant_role"), 30);
  const voiceType = sanitize(form.get("voice_type"), 80);
  const dietary = sanitize(form.get("dietary_restrictions"), 600);
  const accessibility = sanitize(form.get("accessibility_needs"), 600);
  const comments = sanitize(form.get("comments"), 1200);
  const paymentMethod = sanitize(form.get("payment_method"), 30);

  if (!fullName || !email || !phone || !country || !WEEKENDS[weekend] || !ACCOMMODATION[accommodationType] || !ROLES[role] || !["bank_transfer", "paypal", "mbway"].includes(paymentMethod)) {
    return json({ ok: false, error: "missing_fields" }, 400);
  }
  if (accommodationType === "shared" && !secondGuestName) return json({ ok: false, error: "second_guest_required" }, 400);
  const amountCents = ACCOMMODATION[accommodationType].amount;

  const proof = form.get("proof");
  const checked = await validateProofFile(proof);
  if (!checked.ok) return json({ ok: false, error: "invalid_proof", reason: checked.reason }, 400);

  const reference = `STELLA26-IR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const proofKey = `stella-individual-residence/${reference}/${crypto.randomUUID()}.${checked.ext}`;
  try {
    await env.RESIDENCY_PROOFS.put(proofKey, await proof.arrayBuffer(), { httpMetadata: { contentType: proof.type || "application/octet-stream" } });
    await env.DB.prepare(`INSERT INTO stella_individual_residences
      (reference, language, full_name, email, phone, country, date_of_birth, weekend, accommodation_type, second_guest_name, participant_role, voice_type, dietary_restrictions, accessibility_needs, comments, amount_cents, payment_method, proof_key, proof_original_filename, proof_mime)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(reference, language, fullName, email, phone, country, dateOfBirth || null, weekend, accommodationType, secondGuestName || null, role, voiceType || null, dietary || null, accessibility || null, comments || null, amountCents, paymentMethod, proofKey, sanitize(proof.name, 200), proof.type || null).run();
  } catch (error) {
    await env.RESIDENCY_PROOFS.delete(proofKey).catch(() => {});
    console.error(`[stella-individual-residence] ${reference}: ${error.message}`);
    return json({ ok: false, error: "save_failed" }, 500);
  }

  const weekendLabel = WEEKENDS[weekend][language];
  const roleLabel = ROLES[role][language];
  const accommodationLabel = ACCOMMODATION[accommodationType][language];
  const amountLabel = accommodationType === "shared" ? (language === "pt" ? "638 € · 319 € por pessoa" : "€638 · €319 per person") : (language === "pt" ? "369 €" : "€369");
  const summary = language === "pt"
    ? rows([["Nome", fullName], ["Segundo participante", secondGuestName], ["Referência", reference], ["Fim de semana", weekendLabel], ["Alojamento", accommodationLabel], ["Participação", roleLabel], ["Valor", amountLabel], ["Pagamento", "Comprovativo recebido — em validação"]])
    : rows([["Name", fullName], ["Second participant", secondGuestName], ["Reference", reference], ["Weekend", weekendLabel], ["Accommodation", accommodationLabel], ["Role", roleLabel], ["Amount", amountLabel], ["Payment", "Proof received — awaiting verification"]]);

  if (env.RESEND_API_KEY) {
    const userTitle = language === "pt" ? "Reserva recebida" : "Reservation received";
    const userText = language === "pt"
      ? "<p>Recebemos a sua reserva para a STELLA Residência Individual e o comprovativo de pagamento. A inscrição ficará confirmada assim que o pagamento for validado.</p><p>Inclui 2 noites de alojamento, pequenos-almoços, jantares, concertos, workshops, Mercado de Natal e atividades abertas a participantes individuais.</p>"
      : "<p>We have received your STELLA Individual Residence reservation and payment proof. Your place will be confirmed as soon as the payment has been validated.</p><p>Includes 2 nights accommodation, breakfasts, dinners, concerts, workshops, Christmas Market access and activities open to individual participants.</p>";
    try {
      await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [email], reply_to: VOXLACI_EMAIL, subject: `${userTitle} · ${reference}`, html: emailShell(userTitle, userText + summary) });
      const proofUrl = `https://voxlaci.com/eventos/stella/admin/individual-residence-proof/${encodeURIComponent(reference)}`;
      const internal = rows([["Produto", PRODUCT], ["Nome", fullName], ["Segundo participante", secondGuestName], ["Email", email], ["WhatsApp", phone], ["País", country], ["Nascimento", dateOfBirth], ["Fim de semana", WEEKENDS[weekend].pt], ["Alojamento", ACCOMMODATION[accommodationType].pt], ["Participantes", ACCOMMODATION[accommodationType].people], ["Perfil", ROLES[role].pt], ["Tipo de voz", voiceType], ["Restrições alimentares", dietary], ["Acessibilidade", accessibility], ["Comentários", comments], ["Valor", amountLabel], ["Método", paymentMethod], ["Comprovativo", proof.name], ["Referência", reference]]) + `<p><a href="${proofUrl}" style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:99px">Ver comprovativo</a></p>`;
      await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [VOXLACI_EMAIL], reply_to: email, subject: `[STELLA] Nova Residência Individual · ${fullName} · ${reference}`, html: emailShell("Nova STELLA Residência Individual", internal) });
    } catch (error) {
      console.error(`[stella-individual-residence] ${reference} email: ${error.message}`);
    }
  }

  return json({ ok: true, reference, amountCents, accommodationType });
}
