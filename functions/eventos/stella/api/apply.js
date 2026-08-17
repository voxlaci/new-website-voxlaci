// STELLA 2026 — choir application intake. No payment at this stage (per spec,
// payment/proof happens later via the private organizer portal, after acceptance).
import {
  sanitize, sendEmail, FROM, VOXLACI_EMAIL,
  PRICING, generateStellaId, applicationReceivedEmail, internalNotificationEmail,
} from "../../../_shared/stella.js";

export async function onRequestGet({ request }) {
  return Response.redirect(new URL("/eventos/stella/candidatura/", request.url), 303);
}

const rateLimiter = new Map();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimiter.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW_MS) {
    rateLimiter.set(ip, { start: now, count: 1 });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const base = new URL(request.url);
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";

  if (!checkRateLimit(ip)) return json({ ok: false, error: "rate_limit" }, 429);
  if (!env.DB) return json({ ok: false, error: "not_configured" }, 500);
  if (!env.RESEND_API_KEY) return json({ ok: false, error: "not_configured" }, 500);

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return json({ ok: false, error: "invalid_request" }, 400);
  }

  if (formData.get("website") || formData.get("campo-secreto")) {
    return json({ ok: true, stellaId: "OK" }); // honeypot: fake success
  }

  const turnstileToken = formData.get("cf-turnstile-response");
  const secretKey = env.TURNSTILE_SECRET_KEY;
  if (secretKey) {
    if (!turnstileToken) return json({ ok: false, error: "captcha" }, 400);
    const tsResult = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: secretKey, response: turnstileToken, remoteip: ip }),
    });
    const tsJson = await tsResult.json();
    if (!tsJson.success) return json({ ok: false, error: "captcha" }, 400);
  }

  const language = formData.get("language") === "en" ? "en" : "pt";
  const applicationType = sanitize(formData.get("application_type"), 30);
  if (!["choir_residence", "choir_weekend", "choir_day"].includes(applicationType)) {
    return json({ ok: false, error: "invalid_modality" }, 400);
  }

  const choirName = sanitize(formData.get("choir_name"), 200);
  const country = sanitize(formData.get("country"), 100);
  const city = sanitize(formData.get("city"), 100);
  const conductorName = sanitize(formData.get("conductor_name"), 200);
  const contactPerson = sanitize(formData.get("contact_person"), 200);
  const email = sanitize(formData.get("email"), 200);
  const phone = sanitize(formData.get("phone"), 60);
  const whatsapp = sanitize(formData.get("whatsapp"), 60);
  const website = sanitize(formData.get("website_url"), 300);
  const socialMedia = sanitize(formData.get("social_media"), 300);
  const numSingers = parseInt(formData.get("num_singers"), 10) || 0;
  const numCompanions = parseInt(formData.get("num_companions"), 10) || 0;
  const preferredDates = sanitize(formData.get("preferred_dates"), 200);
  const biography = sanitize(formData.get("biography"), 3000);
  const videoLink = sanitize(formData.get("video_link"), 500);
  const notes = sanitize(formData.get("notes"), 2000);

  if (!choirName || !email || !preferredDates || !numSingers) return json({ ok: false, error: "missing_fields" }, 400);

  // Minimum-20 rule: warn, never hard-block (per spec §14).
  const belowMinimum = numSingers < 20;

  let amountTotalCents = null;
  if (applicationType === "choir_weekend") amountTotalCents = numSingers * PRICING.choir_weekend;
  if (applicationType === "choir_day") amountTotalCents = numSingers * PRICING.choir_day;
  // choir_residence stays null until the rooming list determines the single/shared mix.

  const privateToken = crypto.randomUUID();
  const db = env.DB;

  let insertedId;
  try {
    const result = await db
      .prepare(
        `INSERT INTO stella_applications
         (language, application_type, choir_name, country, city, conductor_name, contact_person, email, phone,
          whatsapp, website, social_media, num_singers, num_companions, preferred_dates, biography, video_link,
          notes, amount_total_cents, private_token, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'application_received')`
      )
      .bind(
        language, applicationType, choirName, country, city, conductorName, contactPerson, email, phone,
        whatsapp, website, socialMedia, numSingers, numCompanions, preferredDates, biography, videoLink,
        notes, amountTotalCents, privateToken
      )
      .run();
    insertedId = result.meta.last_row_id;
  } catch (err) {
    console.error(`[stella] falha ao gravar candidatura: ${err.message}`);
    return json({ ok: false, error: "db_failed" }, 500);
  }

  const stellaId = await generateStellaId(db, insertedId);
  console.info(`[stella] ${stellaId} — candidatura criada · coro=${choirName} · modalidade=${applicationType} · cantores=${numSingers} · IP=${ip}`);

  const app = {
    stella_id: stellaId, choir_name: choirName, application_type: applicationType,
    preferred_dates: preferredDates, num_singers: numSingers, num_companions: numCompanions,
    status: "application_received", country, city, conductor_name: conductorName, contact_person: contactPerson,
    email, phone, whatsapp, language,
  };

  try {
    const { subject, html } = applicationReceivedEmail(language, app);
    await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [email], reply_to: VOXLACI_EMAIL, subject, html });
  } catch (err) {
    console.error(`[stella] ${stellaId} — email ao coro falhou: ${err.message}`);
  }

  try {
    const adminUrl = new URL("/eventos/stella/admin/", base).toString();
    const { subject, html } = internalNotificationEmail(app, adminUrl);
    await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [VOXLACI_EMAIL], reply_to: email, subject, html });
  } catch (err) {
    console.error(`[stella] ${stellaId} — email interno falhou: ${err.message}`);
  }

  return json({ ok: true, stellaId, portalToken: privateToken, belowMinimum });
}
