// RAMOS 2027 individual singer — private area, authenticated by an opaque token.
import {
  sanitize, sendEmail, validateProofFile, FROM, VOXLACI_EMAIL,
  paymentReceivedEmail, internalNotificationEmail,
} from "../../../_shared/ramos-individual.js";

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}

async function loadApplication(db, token) {
  return db.prepare("SELECT * FROM ramos_individual_applications WHERE private_token = ?").bind(token).first();
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const token = sanitize(url.searchParams.get("token"), 100);
  if (!token || !env.DB) return json({ ok: false, error: "invalid_token" }, 400);

  const app = await loadApplication(env.DB, token);
  if (!app) return json({ ok: false, error: "not_found" }, 404);

  const payments = await env.DB
    .prepare("SELECT id, amount_cents, payment_method, proof_original_filename, status, created_at FROM ramos_individual_payments WHERE application_id = ? ORDER BY created_at")
    .bind(app.id)
    .all();

  delete app.admin_note;
  delete app.private_token;

  return json({ ok: true, application: app, payments: payments.results || [] });
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ ok: false, error: "not_configured" }, 500);

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return json({ ok: false, error: "invalid_request" }, 400);
  }

  const token = sanitize(formData.get("token"), 100);
  if (!token) return json({ ok: false, error: "invalid_token" }, 400);
  const app = await loadApplication(env.DB, token);
  if (!app) return json({ ok: false, error: "not_found" }, 404);
  if (app.status === "cancelled") return json({ ok: false, error: "cancelled" }, 403);

  const amountEur = parseFloat(formData.get("amount_eur"));
  const paymentMethod = sanitize(formData.get("payment_method"), 30);
  if (!amountEur || amountEur <= 0 || !["bank_transfer", "paypal", "mbway"].includes(paymentMethod)) {
    return json({ ok: false, error: "invalid_fields" }, 400);
  }
  const amountCents = Math.round(amountEur * 100);

  const proof = formData.get("proof");
  const check = await validateProofFile(proof);
  if (!check.ok) return json({ ok: false, error: "invalid_proof", reason: check.reason }, 400);

  let proofKey = null;
  if (env.RESIDENCY_PROOFS) {
    proofKey = `ramos-individual/${app.ramos_id}/${crypto.randomUUID()}.${check.ext}`;
    await env.RESIDENCY_PROOFS.put(proofKey, await proof.arrayBuffer(), {
      httpMetadata: { contentType: proof.type || "application/octet-stream" },
    });
  }

  await env.DB.prepare(
    `INSERT INTO ramos_individual_payments (application_id, amount_cents, payment_method, proof_key, proof_original_filename, proof_mime, status)
     VALUES (?, ?, ?, ?, ?, ?, 'submitted')`
  ).bind(app.id, amountCents, paymentMethod, proofKey, sanitize(proof.name, 200), proof.type || null).run();

  if (env.RESEND_API_KEY) {
    try {
      const { subject, html } = paymentReceivedEmail(app.language, app, amountCents);
      await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [app.email], reply_to: VOXLACI_EMAIL, subject, html });
    } catch (err) {
      console.error(`[ramos-individual] ${app.ramos_id} — email de comprovativo falhou: ${err.message}`);
    }
    try {
      const adminUrl = new URL("/ramos/individual/admin/", request.url).toString();
      const { html } = internalNotificationEmail(app, adminUrl);
      await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [VOXLACI_EMAIL], reply_to: app.email, subject: `[Ramos] Novo comprovativo — ${app.full_name} (${app.ramos_id})`, html });
    } catch (err) {
      console.error(`[ramos-individual] ${app.ramos_id} — email interno de pagamento falhou: ${err.message}`);
    }
  }

  return json({ ok: true });
}
