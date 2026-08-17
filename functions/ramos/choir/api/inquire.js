// RAMOS 2027 — choir participation inquiry. No fixed price (conditions are negotiated per choir),
// so this is a structured "contact us" form, not a checkout: no payment, no acceptance lifecycle.
import { sanitize, esc, sendEmail, FROM, VOXLACI_EMAIL } from "../../../_shared/ramos-individual.js";

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

function shell(title, body) {
  return `<div style="font-family:sans-serif;max-width:640px;margin:0 auto">
  <h2 style="margin-bottom:4px;color:#111">${esc(title)}</h2>
  <p style="color:#888;font-size:13px;margin-top:0">Ramos Palm Sunday Festival 2027 · VoxLaci</p>
  ${body}
  <p style="margin-top:28px"><b>Ramos – Palm Sunday Festival</b><br>VoxLaci<br><a href="mailto:info@voxlaci.com">info@voxlaci.com</a></p>
</div>`;
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
    return json({ ok: true, ramosId: "OK" });
  }

  const language = formData.get("language") === "en" ? "en" : "pt";
  const choirName = sanitize(formData.get("choir_name"), 200);
  const country = sanitize(formData.get("country"), 100);
  const city = sanitize(formData.get("city"), 100);
  const conductorName = sanitize(formData.get("conductor_name"), 200);
  const contactPerson = sanitize(formData.get("contact_person"), 200);
  const email = sanitize(formData.get("email"), 200);
  const phone = sanitize(formData.get("phone"), 60);
  const whatsapp = sanitize(formData.get("whatsapp"), 60);
  const numSingers = parseInt(formData.get("num_singers"), 10) || null;
  const notes = sanitize(formData.get("notes"), 2000);

  if (!choirName || !email || !contactPerson) return json({ ok: false, error: "missing_fields" }, 400);

  const db = env.DB;
  let insertedId;
  try {
    const result = await db
      .prepare(
        `INSERT INTO ramos_choir_inquiries (language, choir_name, country, city, conductor_name, contact_person, email, phone, whatsapp, num_singers, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(language, choirName, country, city, conductorName, contactPerson, email, phone, whatsapp, numSingers, notes)
      .run();
    insertedId = result.meta.last_row_id;
  } catch (err) {
    console.error(`[ramos-choir] falha ao gravar inquérito: ${err.message}`);
    return json({ ok: false, error: "db_failed" }, 500);
  }

  const ramosId = `RAMOS27-C-${String(insertedId).padStart(4, "0")}`;
  await db.prepare("UPDATE ramos_choir_inquiries SET ramos_id = ? WHERE id = ?").bind(ramosId, insertedId).run();
  console.info(`[ramos-choir] ${ramosId} — inquérito criado · coro=${choirName} · IP=${ip}`);

  if (env.RESEND_API_KEY) {
    const t = language === "pt"
      ? { subject: `Ramos — Pedido recebido (${ramosId})`, title: "Pedido de participação recebido", body: `<p>Recebemos o pedido de participação do coro <b>${esc(choirName)}</b> no Ramos Palm Sunday Festival 2027.</p><p>A organização vai entrar em contacto para combinar as condições específicas (número de cantores, repertório, ensaios, refeições e transporte).</p><p>ID: <b>${ramosId}</b></p>` }
      : { subject: `Ramos — Inquiry received (${ramosId})`, title: "Participation inquiry received", body: `<p>We received <b>${esc(choirName)}</b>'s inquiry to participate in the Ramos Palm Sunday Festival 2027.</p><p>The organisation will be in touch to arrange the specific conditions (number of singers, repertoire, rehearsals, meals and transport).</p><p>ID: <b>${ramosId}</b></p>` };
    try {
      await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [email], reply_to: VOXLACI_EMAIL, subject: t.subject, html: shell(t.title, t.body) });
    } catch (err) {
      console.error(`[ramos-choir] ${ramosId} — email ao coro falhou: ${err.message}`);
    }
    const rows = [
      ["ID", ramosId], ["Coro", choirName], ["País / Cidade", `${country || "—"} / ${city || "—"}`],
      ["Maestro", conductorName || "—"], ["Contacto", `${contactPerson} · ${email} · ${phone || whatsapp || "—"}`],
      ["N.º cantores", numSingers || "—"], ["Notas", notes || "—"],
    ];
    const table = `<table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px">
      ${rows.map(([k, v]) => `<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:700;width:35%">${esc(k)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(v)}</td></tr>`).join("")}
    </table>`;
    try {
      await sendEmail(env.RESEND_API_KEY, { from: FROM, to: [VOXLACI_EMAIL], reply_to: email, subject: `[Ramos] Novo pedido de coro — ${choirName} (${ramosId})`, html: shell("Novo pedido de participação de coro", table) });
    } catch (err) {
      console.error(`[ramos-choir] ${ramosId} — email interno falhou: ${err.message}`);
    }
  }

  return json({ ok: true, ramosId });
}
