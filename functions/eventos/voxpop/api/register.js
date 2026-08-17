// voX±Pop — registration/interest capture. This is NOT a paid ticket: actual payment happens
// on Eventbrite. We record the interest, confirm by email, and point to the real Eventbrite link.
import {
  sanitize, sendEmail, FROM, VOXLACI_EMAIL,
  generateVoxpopId, registrationReceivedEmail, registrationInternalEmail, CITY_LABELS,
} from "../../../_shared/voxpop.js";

// Real, verified Eventbrite links for currently open editions (checked live — never invent these).
const CITY_EVENTBRITE = {
  lisboa: "https://www.eventbrite.pt/e/lisboa-vox-pop-september-2026-tickets-1759362824569",
  cascais: "https://www.eventbrite.pt/e/cascais-vox-pop-june-2027-tickets-1750076809849",
  porto: "https://www.eventbrite.pt/e/porto-vox-pop-february-2027-tickets-1750029468249",
  monopoli: "https://www.eventbrite.pt/e/monopoli-vox-pop-may-2027-tickets-1759248793499",
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}

const rateLimiter = new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimiter.get(ip);
  if (!entry || now - entry.start > 60 * 60 * 1000) {
    rateLimiter.set(ip, { start: now, count: 1 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

export async function onRequestPost({ request, env }) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (!checkRateLimit(ip)) return json({ ok: false, error: "rate_limit" }, 429);
  if (!env.DB) return json({ ok: false, error: "not_configured" }, 500);

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return json({ ok: false, error: "invalid_request" }, 400);
  }

  if (formData.get("website") || formData.get("campo-secreto")) {
    return json({ ok: true, voxpopId: "OK" });
  }

  const language = formData.get("language") === "en" ? "en" : "pt";
  const citySlug = sanitize(formData.get("city_slug"), 30);
  if (!CITY_LABELS[citySlug]) return json({ ok: false, error: "invalid_city" }, 400);

  const participationType = sanitize(formData.get("participation_type"), 20);
  if (!["individual", "choir", "group", "conductor", "other"].includes(participationType)) {
    return json({ ok: false, error: "invalid_participation_type" }, 400);
  }
  const participationOption = sanitize(formData.get("participation_option"), 20);
  if (!["festival_only", "festival_dinner"].includes(participationOption)) {
    return json({ ok: false, error: "invalid_option" }, 400);
  }

  const fullName = sanitize(formData.get("full_name"), 200);
  const email = sanitize(formData.get("email"), 200);
  if (!fullName || !email) return json({ ok: false, error: "missing_fields" }, 400);

  const choirName = sanitize(formData.get("choir_name"), 200);
  const country = sanitize(formData.get("country"), 100);
  const whatsapp = sanitize(formData.get("whatsapp"), 60);
  const voiceType = sanitize(formData.get("voice_type"), 60);
  const choirExperience = sanitize(formData.get("choir_experience"), 500);
  const readsMusic = sanitize(formData.get("reads_music"), 10);
  const numSingers = parseInt(formData.get("num_singers"), 10) || null;
  const voiceDistribution = sanitize(formData.get("voice_distribution"), 300);
  const conductorName = sanitize(formData.get("conductor_name"), 200);
  const notes = sanitize(formData.get("notes"), 2000);

  const db = env.DB;
  let insertedId;
  try {
    const result = await db
      .prepare(
        `INSERT INTO voxpop_registrations
         (language, city_slug, participation_type, full_name, choir_name, country, email, whatsapp,
          participation_option, voice_type, choir_experience, reads_music, num_singers, voice_distribution,
          conductor_name, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        language, citySlug, participationType, fullName, choirName, country, email, whatsapp,
        participationOption, voiceType, choirExperience, readsMusic, numSingers, voiceDistribution,
        conductorName, notes
      )
      .run();
    insertedId = result.meta.last_row_id;
  } catch (err) {
    console.error(`[voxpop] falha ao gravar inscrição: ${err.message}`);
    return json({ ok: false, error: "db_failed" }, 500);
  }

  const voxpopId = await generateVoxpopId(db, citySlug, insertedId);
  console.info(`[voxpop] ${voxpopId} — inscrição criada · cidade=${citySlug} · nome=${fullName} · IP=${ip}`);

  const reg = {
    voxpop_id: voxpopId, city_slug: citySlug, participation_type: participationType,
    full_name: fullName, choir_name: choirName, country, email, whatsapp,
    participation_option: participationOption, num_singers: numSingers, notes,
  };
  const eventbriteUrl = CITY_EVENTBRITE[citySlug] || null;

  if (env.RESEND_API_KEY) {
    try {
      const { subject, html } = registrationReceivedEmail(language, reg, eventbriteUrl);
      await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [email], reply_to: VOXLACI_EMAIL, subject, html });
    } catch (err) {
      console.error(`[voxpop] ${voxpopId} — email ao participante falhou: ${err.message}`);
    }
    try {
      const { subject, html } = registrationInternalEmail(reg);
      await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [VOXLACI_EMAIL], reply_to: email, subject, html });
    } catch (err) {
      console.error(`[voxpop] ${voxpopId} — email interno falhou: ${err.message}`);
    }
  }

  return json({ ok: true, voxpopId, eventbriteUrl });
}
