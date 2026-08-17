// RAMOS 2027 — individual singer application intake. Replaces the "email us a video" flow.
// No payment at this stage — payment (295€) happens after acceptance, via the private area.
import {
  sanitize, sendEmail, FROM, VOXLACI_EMAIL,
  generateRamosIndividualId, applicationReceivedEmail, internalNotificationEmail,
} from "../../../_shared/ramos-individual.js";

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

export async function onRequestPost(context) {
  const { request, env } = context;
  const base = new URL(request.url);
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
    return json({ ok: true, ramosId: "OK" });
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
  const track = sanitize(formData.get("track"), 20);
  if (!["international", "resident"].includes(track)) return json({ ok: false, error: "invalid_track" }, 400);

  const fullName = sanitize(formData.get("full_name"), 200);
  const country = sanitize(formData.get("country"), 100);
  const email = sanitize(formData.get("email"), 200);
  const phone = sanitize(formData.get("phone"), 60);
  const whatsapp = sanitize(formData.get("whatsapp"), 60);
  const choirInstitution = sanitize(formData.get("choir_institution"), 200);
  const worksChosen = sanitize(formData.get("works_chosen"), 500);
  const videoLink = sanitize(formData.get("video_link"), 500);
  const biography = sanitize(formData.get("biography"), 3000);
  const notes = sanitize(formData.get("notes"), 2000);

  if (!fullName || !email || !worksChosen || !videoLink) return json({ ok: false, error: "missing_fields" }, 400);

  const privateToken = crypto.randomUUID();
  const db = env.DB;

  let insertedId;
  try {
    const result = await db
      .prepare(
        `INSERT INTO ramos_individual_applications
         (language, track, full_name, country, email, phone, whatsapp, choir_institution, works_chosen, video_link, biography, notes, private_token, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'application_received')`
      )
      .bind(language, track, fullName, country, email, phone, whatsapp, choirInstitution, worksChosen, videoLink, biography, notes, privateToken)
      .run();
    insertedId = result.meta.last_row_id;
  } catch (err) {
    console.error(`[ramos-individual] falha ao gravar candidatura: ${err.message}`);
    return json({ ok: false, error: "db_failed" }, 500);
  }

  const ramosId = await generateRamosIndividualId(db, insertedId);
  console.info(`[ramos-individual] ${ramosId} — candidatura criada · nome=${fullName} · percurso=${track} · IP=${ip}`);

  const app = { ramos_id: ramosId, full_name: fullName, track, status: "application_received", email, phone, whatsapp, country, language, choir_institution: choirInstitution, works_chosen: worksChosen, video_link: videoLink };

  if (env.RESEND_API_KEY) {
    try {
      const { subject, html } = applicationReceivedEmail(language, app);
      await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [email], reply_to: VOXLACI_EMAIL, subject, html });
    } catch (err) {
      console.error(`[ramos-individual] ${ramosId} — email ao cantor falhou: ${err.message}`);
    }
    try {
      const adminUrl = new URL("/ramos/individual/admin/", base).toString();
      const { subject, html } = internalNotificationEmail(app, adminUrl);
      await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [VOXLACI_EMAIL], reply_to: email, subject, html });
    } catch (err) {
      console.error(`[ramos-individual] ${ramosId} — email interno falhou: ${err.message}`);
    }
  }

  return json({ ok: true, ramosId, portalToken: privateToken });
}
