// Access-gated. Drives the STELLA application lifecycle and fires the matching participant email.
import {
  FROM, VOXLACI_EMAIL, sendEmail,
  applicationAcceptedEmail, paymentPendingEmail, registrationConfirmedEmail, cancelledEmail,
  informationRequiredEmail, finalFestivalInformationEmail,
} from "../../../_shared/stella.js";

const VALID_STATUSES = [
  "application_received", "under_review", "accepted", "payment_pending",
  "partially_paid", "paid", "confirmed", "cancelled",
];

const STATUS_EMAILS = {
  accepted: applicationAcceptedEmail,
  payment_pending: paymentPendingEmail,
  confirmed: registrationConfirmedEmail,
  cancelled: cancelledEmail,
};

export async function onRequestPost({ request, env }) {
  const actor = request.headers.get("Cf-Access-Authenticated-User-Email") || "unknown-admin";
  if (!env.DB) return json({ ok: false, error: "not_configured" }, 500);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_request" }, 400);
  }

  const id = Number(body.id);
  if (!id) return json({ ok: false, error: "missing_id" }, 400);
  const app = await env.DB.prepare("SELECT * FROM stella_applications WHERE id = ?").bind(id).first();
  if (!app) return json({ ok: false, error: "not_found" }, 404);

  const action = body.action || "status";

  if (action === "request_info" || action === "final_info") {
    const message = (body.message || "").toString().trim().slice(0, 3000);
    if (!message) return json({ ok: false, error: "missing_message" }, 400);
    if (env.RESEND_API_KEY) {
      try {
        const { subject, html } = action === "request_info"
          ? informationRequiredEmail(app.language, app, message)
          : finalFestivalInformationEmail(app.language, app, message);
        await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [app.email], reply_to: VOXLACI_EMAIL, subject, html });
      } catch (err) {
        console.error(`[stella] ${app.stella_id} — email de ${action} falhou: ${err.message}`);
        return json({ ok: false, error: "email_failed" }, 502);
      }
    }
    console.info(`[stella] ${app.stella_id} — ${action} enviado por ${actor}`);
    return json({ ok: true });
  }

  const status = body.status;
  if (!VALID_STATUSES.includes(status)) return json({ ok: false, error: "invalid_status" }, 400);

  const adminNote = body.admin_note !== undefined ? String(body.admin_note).slice(0, 2000) : app.admin_note;
  const amountTotalCents = body.amount_total_cents !== undefined && body.amount_total_cents !== null
    ? Math.max(0, Math.round(Number(body.amount_total_cents)))
    : app.amount_total_cents;

  await env.DB
    .prepare("UPDATE stella_applications SET status = ?, admin_note = ?, amount_total_cents = ?, updated_at = datetime('now') WHERE id = ?")
    .bind(status, adminNote, amountTotalCents, id)
    .run();
  console.info(`[stella] ${app.stella_id} — estado alterado para ${status} por ${actor}`);

  const emailFn = STATUS_EMAILS[status];
  if (emailFn && env.RESEND_API_KEY) {
    try {
      const updatedApp = { ...app, status, amount_total_cents: amountTotalCents };
      const { subject, html } = emailFn(app.language, updatedApp);
      await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [app.email], reply_to: VOXLACI_EMAIL, subject, html });
    } catch (err) {
      console.error(`[stella] ${app.stella_id} — email de estado (${status}) falhou: ${err.message}`);
    }
  }

  return json({ ok: true });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}
