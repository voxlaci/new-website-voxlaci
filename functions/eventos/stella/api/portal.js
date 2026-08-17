// STELLA 2026 — private organizer portal, authenticated by an opaque token (no login system).
import {
  sanitize, sendEmail, validateProofFile, FROM, VOXLACI_EMAIL,
  paymentReceivedEmail, internalNotificationEmail,
} from "../../../_shared/stella.js";

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}

const ROOM_TYPES = ["single", "twin", "double", "triple"];
const ROOM_CAPACITY = { single: 1, twin: 2, double: 2, triple: 3 };
const MEAL_KEYS = ["dinner_friday", "dinner_saturday", "dinner_sunday", "choir_day_dinner"];

async function loadApplication(db, token) {
  return db.prepare("SELECT * FROM stella_applications WHERE private_token = ?").bind(token).first();
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const token = sanitize(url.searchParams.get("token"), 100);
  if (!token || !env.DB) return json({ ok: false, error: "invalid_token" }, 400);

  const app = await loadApplication(env.DB, token);
  if (!app) return json({ ok: false, error: "not_found" }, 404);

  const [rooms, meals, payments] = await Promise.all([
    env.DB.prepare("SELECT id, room_ref, room_type, guest1, guest1_role, guest2, guest2_role, guest3, guest3_role, share_with, notes FROM stella_rooms WHERE application_id = ? ORDER BY id").bind(app.id).all(),
    env.DB.prepare("SELECT id, meal_key, count, vegetarian, vegan, gluten_free, other_allergies FROM stella_meals WHERE application_id = ? ORDER BY id").bind(app.id).all(),
    env.DB.prepare("SELECT id, amount_cents, payment_method, proof_original_filename, status, created_at FROM stella_payments WHERE application_id = ? ORDER BY created_at").bind(app.id).all(),
  ]);

  delete app.admin_note;
  delete app.private_token;

  return json({
    ok: true,
    application: app,
    rooms: rooms.results || [],
    meals: meals.results || [],
    payments: payments.results || [],
  });
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

  const action = sanitize(formData.get("action"), 30);

  if (action === "rooms") {
    if (app.application_type !== "choir_residence") return json({ ok: false, error: "not_applicable" }, 400);
    let rooms;
    try {
      rooms = JSON.parse(formData.get("rooms") || "[]");
    } catch {
      return json({ ok: false, error: "invalid_rooms" }, 400);
    }
    if (!Array.isArray(rooms) || rooms.length > 60) return json({ ok: false, error: "invalid_rooms" }, 400);

    let guestTotal = 0;
    const stmts = [env.DB.prepare("DELETE FROM stella_rooms WHERE application_id = ?").bind(app.id)];
    rooms.forEach((r, i) => {
      const roomType = ROOM_TYPES.includes(r.room_type) ? r.room_type : "twin";
      const g1 = sanitize(r.guest1, 200), g2 = sanitize(r.guest2, 200), g3 = sanitize(r.guest3, 200);
      guestTotal += [g1, g2, g3].filter(Boolean).length;
      stmts.push(
        env.DB.prepare(
          `INSERT INTO stella_rooms (application_id, room_ref, room_type, guest1, guest1_role, guest2, guest2_role, guest3, guest3_role, share_with, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          app.id, sanitize(r.room_ref, 30) || `R${i + 1}`, roomType,
          g1, sanitize(r.guest1_role, 60), g2, sanitize(r.guest2_role, 60), g3, sanitize(r.guest3_role, 60),
          sanitize(r.share_with, 200), sanitize(r.notes, 500)
        )
      );
    });
    await env.DB.batch(stmts);

    const expected = app.num_singers + (app.num_companions || 0);
    const warning = guestTotal !== expected
      ? `guest_count_mismatch:${guestTotal}:${expected}`
      : null;
    return json({ ok: true, guestTotal, expected, warning });
  }

  if (action === "meals") {
    let meals;
    try {
      meals = JSON.parse(formData.get("meals") || "[]");
    } catch {
      return json({ ok: false, error: "invalid_meals" }, 400);
    }
    if (!Array.isArray(meals) || meals.length > 20) return json({ ok: false, error: "invalid_meals" }, 400);

    const stmts = [env.DB.prepare("DELETE FROM stella_meals WHERE application_id = ?").bind(app.id)];
    meals.forEach((m) => {
      if (!MEAL_KEYS.includes(m.meal_key)) return;
      stmts.push(
        env.DB.prepare(
          `INSERT INTO stella_meals (application_id, meal_key, count, vegetarian, vegan, gluten_free, other_allergies)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          app.id, m.meal_key, parseInt(m.count, 10) || 0,
          parseInt(m.vegetarian, 10) || 0, parseInt(m.vegan, 10) || 0, parseInt(m.gluten_free, 10) || 0,
          sanitize(m.other_allergies, 500)
        )
      );
    });
    if (stmts.length > 1) await env.DB.batch(stmts);
    else await stmts[0].run();
    return json({ ok: true });
  }

  if (action === "payment") {
    const amountEur = parseFloat(formData.get("amount_eur"));
    const paymentMethod = sanitize(formData.get("payment_method"), 30);
    if (!amountEur || amountEur <= 0 || !["bank_transfer", "paypal", "revolut"].includes(paymentMethod)) {
      return json({ ok: false, error: "invalid_fields" }, 400);
    }
    const amountCents = Math.round(amountEur * 100);

    const proof = formData.get("proof");
    const check = await validateProofFile(proof);
    if (!check.ok) return json({ ok: false, error: "invalid_proof", reason: check.reason }, 400);

    let proofKey = null;
    if (env.RESIDENCY_PROOFS) {
      proofKey = `stella/${app.stella_id}/${crypto.randomUUID()}.${check.ext}`;
      await env.RESIDENCY_PROOFS.put(proofKey, await proof.arrayBuffer(), {
        httpMetadata: { contentType: proof.type || "application/octet-stream" },
      });
    }

    await env.DB.prepare(
      `INSERT INTO stella_payments (application_id, amount_cents, payment_method, proof_key, proof_original_filename, proof_mime, status)
       VALUES (?, ?, ?, ?, ?, ?, 'submitted')`
    ).bind(app.id, amountCents, paymentMethod, proofKey, sanitize(proof.name, 200), proof.type || null).run();

    if (env.RESEND_API_KEY) {
      try {
        const { subject, html } = paymentReceivedEmail(app.language, app, amountCents);
        await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [app.email], reply_to: VOXLACI_EMAIL, subject, html });
      } catch (err) {
        console.error(`[stella] ${app.stella_id} — email de comprovativo falhou: ${err.message}`);
      }
      try {
        const adminUrl = new URL("/eventos/stella/admin/", request.url).toString();
        const { subject, html } = internalNotificationEmail(app, adminUrl);
        await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [VOXLACI_EMAIL], reply_to: app.email, subject: `[STELLA] Novo comprovativo — ${app.choir_name} (${app.stella_id})`, html });
      } catch (err) {
        console.error(`[stella] ${app.stella_id} — email interno de pagamento falhou: ${err.message}`);
      }
    }

    return json({ ok: true });
  }

  return json({ ok: false, error: "unknown_action" }, 400);
}
