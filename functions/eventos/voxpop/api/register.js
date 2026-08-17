// voX±Pop — full registration: individual or group/choir, real edition pricing computed
// server-side, proof-of-payment upload, capacity-aware (informational check here; the
// hard, overbooking-safe check happens atomically when an admin confirms — see
// admin/update-status.js). Mirrors functions/eventos/stella/api/apply.js + RAMOS residency.
import {
  sanitize, sendEmail, validateProofFile, FROM, VOXLACI_EMAIL,
  generateVoxpopId, calcTotal, availableSeats, publicStatus,
  registrationReceivedEmail, waitlistEmail, registrationInternalEmail,
} from "../../../_shared/voxpop.js";

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
    return json({ ok: true, voxpopId: "OK" });
  }

  const language = formData.get("language") === "en" ? "en" : "pt";
  const editionSlug = sanitize(formData.get("edition_slug") || formData.get("city_slug"), 30);
  const edition = await env.DB.prepare("SELECT * FROM voxpop_editions WHERE slug = ?").bind(editionSlug).first();
  if (!edition) return json({ ok: false, error: "invalid_edition" }, 400);
  if (!["open", "last_spots", "sold_out", "waitlist"].includes(edition.status)) {
    return json({ ok: false, error: "registrations_not_open" }, 400);
  }

  const participationType = formData.get("participation_type") === "group" ? "group" : "individual";
  const wantsWaitlist = formData.get("join_waitlist") === "1";

  const fullName = sanitize(formData.get("full_name"), 200);
  const email = sanitize(formData.get("email"), 200);
  if (!fullName || !email) return json({ ok: false, error: "missing_fields" }, 400);

  const choirName = sanitize(formData.get("choir_name"), 200);
  const conductorName = sanitize(formData.get("conductor_name"), 200);
  const country = sanitize(formData.get("country"), 100);
  const whatsapp = sanitize(formData.get("whatsapp"), 60);
  const voiceType = sanitize(formData.get("voice_type"), 60);
  const choirExperience = sanitize(formData.get("choir_experience"), 500);
  const readsMusic = sanitize(formData.get("reads_music"), 10);
  const voiceDistribution = sanitize(formData.get("voice_distribution"), 300);
  const notes = sanitize(formData.get("notes"), 2000);

  let numParticipants = 1;
  let numSingers = null;
  if (participationType === "group") {
    numSingers = parseInt(formData.get("num_singers"), 10) || 0;
    if (numSingers < 1) return json({ ok: false, error: "invalid_group_size" }, 400);
    numParticipants = numSingers;
  }

  const dinnerSelected = formData.get("dinner_selected") === "1" && !!edition.dinner_addon_cents;

  // Informational capacity check — the authoritative, overbooking-safe check happens
  // atomically at admin confirmation time (only "confirmed" occupies real seats).
  const available = availableSeats(edition);
  if (!wantsWaitlist && numParticipants > available) {
    return json({
      ok: false,
      error: available <= 0 ? "sold_out" : "insufficient_capacity",
      available,
    }, 409);
  }

  const paymentMethod = sanitize(formData.get("payment_method"), 30);
  if (!["bank_transfer", "paypal", "revolut", "mbway"].includes(paymentMethod)) {
    return json({ ok: false, error: "invalid_payment_method" }, 400);
  }
  const proof = formData.get("proof");
  const proofCheck = await validateProofFile(proof);
  if (!proofCheck.ok) return json({ ok: false, error: `invalid_proof_${proofCheck.reason}` }, 400);

  const amountTotalCents = calcTotal(edition, { participationType, numParticipants, dinnerSelected });
  const status = wantsWaitlist ? "waitlist" : "payment_review";

  const db = env.DB;
  let insertedId;
  try {
    const result = await db
      .prepare(
        `INSERT INTO voxpop_registrations
         (language, city_slug, edition_id, participation_type, full_name, choir_name, country, email, whatsapp,
          participation_option, voice_type, choir_experience, reads_music, num_singers, voice_distribution,
          conductor_name, notes, status, num_participants, amount_total_cents, dinner_selected)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        language, edition.slug, edition.id, participationType, fullName, choirName, country, email, whatsapp,
        dinnerSelected ? "festival_dinner" : "festival_only", voiceType, choirExperience, readsMusic, numSingers, voiceDistribution,
        conductorName, notes, status, numParticipants, amountTotalCents, dinnerSelected ? 1 : 0
      )
      .run();
    insertedId = result.meta.last_row_id;
  } catch (err) {
    console.error(`[voxpop] falha ao gravar inscrição: ${err.message}`);
    return json({ ok: false, error: "db_failed" }, 500);
  }

  const voxpopId = await generateVoxpopId(db, edition.slug, insertedId);

  let proofKey = null;
  if (env.RESIDENCY_PROOFS) {
    proofKey = `voxpop/${voxpopId}/${crypto.randomUUID()}.${proofCheck.ext}`;
    try {
      await env.RESIDENCY_PROOFS.put(proofKey, await proof.arrayBuffer(), {
        httpMetadata: { contentType: proof.type || "application/octet-stream" },
      });
    } catch (err) {
      console.error(`[voxpop] ${voxpopId} — falha ao guardar comprovativo no R2: ${err.message}`);
    }
  }
  try {
    await db
      .prepare(
        `INSERT INTO voxpop_payments (registration_id, amount_cents, payment_method, proof_key, proof_original_filename, proof_mime, status)
         VALUES (?, ?, ?, ?, ?, ?, 'submitted')`
      )
      .bind(insertedId, amountTotalCents, paymentMethod, proofKey, sanitize(proof.name, 200), proof.type || null)
      .run();
  } catch (err) {
    console.error(`[voxpop] ${voxpopId} — falha ao gravar pagamento: ${err.message}`);
  }

  console.info(`[voxpop] ${voxpopId} — inscrição criada · edição=${edition.slug} · tipo=${participationType} · participantes=${numParticipants} · estado=${status} · IP=${ip}`);

  const reg = {
    voxpop_id: voxpopId, participation_type: participationType, full_name: fullName, choir_name: choirName,
    country, email, whatsapp, num_participants: numParticipants, amount_total_cents: amountTotalCents,
    amount_paid_cents: 0, status, notes,
  };

  if (env.RESEND_API_KEY) {
    try {
      const { subject, html } = status === "waitlist"
        ? waitlistEmail(language, reg, edition)
        : registrationReceivedEmail(language, reg, edition);
      await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [email], reply_to: VOXLACI_EMAIL, subject, html });
    } catch (err) {
      console.error(`[voxpop] ${voxpopId} — email ao participante falhou: ${err.message}`);
    }
    try {
      const adminUrl = new URL("/eventos/voxpop/admin/", base).toString();
      const { subject, html } = registrationInternalEmail(reg, edition, adminUrl);
      await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [VOXLACI_EMAIL], reply_to: email, subject, html });
    } catch (err) {
      console.error(`[voxpop] ${voxpopId} — email interno falhou: ${err.message}`);
    }
  }

  return json({
    ok: true, voxpopId, status, amountTotalCents, numParticipants,
    eventbriteUrl: edition.eventbrite_url || null,
  });
}
