import { sanitize, esc, sendEmail, FROM, VOXLACI_EMAIL } from "../../../_shared/stella.js";

const SLOTS = new Set([
  "2026-12-05-16:00","2026-12-05-16:30","2026-12-05-17:00",
  "2026-12-06-16:00","2026-12-06-16:30","2026-12-06-17:00",
  "2026-12-08-16:00","2026-12-08-16:30","2026-12-08-17:00"
]);
const TYPES = { "image/jpeg":"jpg", "image/png":"png", "image/heic":"heic", "image/heif":"heif" };
const MAX_PHOTO = 8 * 1024 * 1024;
const rateLimit = new Map();

function json(data, status=200){ return Response.json(data,{status,headers:{"Cache-Control":"no-store"}}); }
function yes(value){ return value === "yes" ? 1 : 0; }
function validEmail(value){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function validUrl(value){ try { const u=new URL(value); return ["http:","https:"].includes(u.protocol); } catch { return false; } }
function magicOk(bytes, mime){
  if(mime==="image/jpeg") return bytes[0]===0xff && bytes[1]===0xd8 && bytes[2]===0xff;
  if(mime==="image/png") return bytes[0]===0x89 && bytes[1]===0x50 && bytes[2]===0x4e && bytes[3]===0x47;
  if(mime==="image/heic" || mime==="image/heif") return String.fromCharCode(...bytes.slice(4,12)).includes("ftyp");
  return false;
}
function row(label,value){ return `<tr><td style="padding:8px;background:#f3f1ed;font-weight:700;width:36%">${esc(label)}</td><td style="padding:8px;border-bottom:1px solid #e7e2da">${esc(value||"—")}</td></tr>`; }
function shell(title,body){ return `<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#171717"><h1>${esc(title)}</h1><p style="color:#6f6f6f">STELLA Festival 2026 · VoxLaci</p>${body}<p style="margin-top:28px"><b>STELLA Festival 2026</b><br>Torre d’Águilha · Cascais<br><a href="mailto:info@voxlaci.com">info@voxlaci.com</a></p></div>`; }

export async function onRequestPost({request,env}){
  const ip=request.headers.get("CF-Connecting-IP")||"unknown", now=Date.now(), hit=rateLimit.get(ip);
  if(hit && now-hit.started<3600000 && hit.count>=5) return json({ok:false,error:"rate_limit"},429);
  rateLimit.set(ip,!hit||now-hit.started>=3600000?{started:now,count:1}:{started:hit.started,count:hit.count+1});
  if(!env.DB || !env.RESIDENCY_PROOFS) return json({ok:false,error:"not_configured"},500);
  let form; try{ form=await request.formData(); }catch{return json({ok:false,error:"invalid_request"},400);}
  if(form.get("website")) return json({ok:true,reference:"OK"});
  if(env.STELLA_MINI_CONCERTS_OPEN === "false") return json({ok:false,error:"applications_closed"},403);

  const submissionKey=sanitize(form.get("submission_key"),100);
  const fullName=sanitize(form.get("full_name"),200), artisticName=sanitize(form.get("artistic_name"),200);
  const age=Number.parseInt(form.get("age"),10), locality=sanitize(form.get("locality"),160);
  const email=sanitize(form.get("email"),254).toLowerCase(), phone=sanitize(form.get("phone"),80);
  const instagram=sanitize(form.get("instagram"),300), websiteUrl=sanitize(form.get("website_url"),500);
  const concertTitle=sanitize(form.get("concert_title"),240), mainInstrument=sanitize(form.get("main_instrument"),160);
  const artistIntro=sanitize(form.get("artist_intro"),1800), concertConcept=sanitize(form.get("concert_concept"),2200);
  const repertoire=sanitize(form.get("repertoire"),4000), originalMusic=sanitize(form.get("original_music"),20);
  const mediaUrl=sanitize(form.get("media_url"),700), firstPreference=sanitize(form.get("first_preference"),40);
  const availability=form.getAll("availability").map(v=>sanitize(v,40)).filter(v=>SLOTS.has(v));
  const audienceEstimate=sanitize(form.get("audience_estimate"),40), promotionPlan=sanitize(form.get("promotion_plan"),1600);
  const technicalInstrument=sanitize(form.get("technical_instrument"),160), technicalNotes=sanitize(form.get("technical_notes"),1600);

  if(!submissionKey || !fullName || !Number.isInteger(age) || age<1 || age>120 || !locality || !validEmail(email) || !phone || !concertTitle || !mainInstrument || !artistIntro || !concertConcept || !repertoire || !["yes","no","partly"].includes(originalMusic) || !validUrl(mediaUrl) || !availability.length || !SLOTS.has(firstPreference) || !availability.includes(firstPreference) || !audienceEstimate || !promotionPlan || !technicalInstrument){
    return json({ok:false,error:"missing_or_invalid_fields"},400);
  }
  if(websiteUrl && !validUrl(websiteUrl)) return json({ok:false,error:"invalid_url"},400);
  for(const required of ["photo_consent","format_consent","revenue_consent","promotion_consent","privacy_consent"]){ if(form.get(required)!=="yes") return json({ok:false,error:"consent_required",field:required},400); }

  const duplicate=await env.DB.prepare("SELECT reference FROM stella_mini_concert_applications WHERE submission_key=? OR (email=? AND concert_title=?) LIMIT 1").bind(submissionKey,email,concertTitle).first();
  if(duplicate) return json({ok:true,reference:duplicate.reference,duplicate:true});

  const photo=form.get("artist_photo");
  if(!(photo instanceof File) || !photo.size || photo.size>MAX_PHOTO || !TYPES[photo.type]) return json({ok:false,error:"invalid_photo"},400);
  const buffer=await photo.arrayBuffer(), head=new Uint8Array(buffer.slice(0,16));
  if(!magicOk(head,photo.type)) return json({ok:false,error:"invalid_photo_type"},400);
  const reference=`STELLA26-MINI-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
  const photoKey=`stella-mini-concerts/${reference}/${crypto.randomUUID()}.${TYPES[photo.type]}`;
  await env.RESIDENCY_PROOFS.put(photoKey,buffer,{httpMetadata:{contentType:photo.type},customMetadata:{reference,originalName:sanitize(photo.name,220)}});

  try{
    await env.DB.prepare(`INSERT INTO stella_mini_concert_applications
      (reference,submission_key,full_name,artistic_name,age,locality,email,phone,instagram,website_url,concert_title,main_instrument,artist_intro,concert_concept,repertoire,original_music,media_url,availability,first_preference,audience_estimate,promotion_plan,technical_instrument,needs_microphone,needs_piano,uses_backing_track,technical_notes,photo_key,photo_filename,photo_mime,photo_size)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(reference,submissionKey,fullName,artisticName,age,locality,email,phone,instagram,websiteUrl,concertTitle,mainInstrument,artistIntro,concertConcept,repertoire,originalMusic,mediaUrl,JSON.stringify(availability),firstPreference,audienceEstimate,promotionPlan,technicalInstrument,yes(form.get("needs_microphone")),yes(form.get("needs_piano")),yes(form.get("uses_backing_track")),technicalNotes,photoKey,sanitize(photo.name,220),photo.type,photo.size).run();
  }catch(error){ await env.RESIDENCY_PROOFS.delete(photoKey); throw error; }

  if(env.RESEND_API_KEY){
    const confirmation=shell("Recebemos a sua candidatura — STELLA MINI CONCERTS 2026",`<p>Olá <b>${esc(fullName)}</b>,</p><p>Recebemos a sua candidatura aos STELLA MINI CONCERTS 2026.</p><p>Obrigado por partilhar a sua música connosco.</p><p>Serão selecionados apenas 9 artistas para os dias 5, 6 e 8 de dezembro, nos horários das 16h00, 16h30 e 17h00.</p><p>As candidaturas serão analisadas tendo em conta a ordem de chegada e a originalidade da proposta, incluindo o conceito, o instrumento e o repertório apresentados.</p><p>A receção desta mensagem confirma apenas a submissão da candidatura e não a participação no Festival.</p><p>Entraremos em contacto caso a sua proposta seja selecionada.</p><p>Referência: <b>${reference}</b></p>`);
    const details=[["Referência",reference],["Nome",fullName],["Nome artístico",artisticName],["Email",email],["Telefone",phone],["Localidade",locality],["Mini-concerto",concertTitle],["Instrumento",mainInstrument],["Apresentação",artistIntro],["Conceito",concertConcept],["Repertório",repertoire],["Música original",originalMusic],["Link áudio/vídeo",mediaUrl],["Disponibilidade",availability.join(", ")],["1.ª preferência",firstPreference],["Público estimado",audienceEstimate],["Divulgação",promotionPlan],["Necessidades técnicas",technicalNotes]].map(([k,v])=>row(k,v)).join("");
    const photoUrl=`${new URL(request.url).origin}/eventos/stella/admin/mini-concert-photo/${encodeURIComponent(reference)}`;
    const internal=shell("Nova candidatura · STELLA MINI CONCERTS",`<table style="width:100%;border-collapse:collapse">${details}</table><p><a href="${esc(photoUrl)}" style="display:inline-block;padding:11px 18px;background:#111;color:#fff;text-decoration:none;border-radius:999px">Ver fotografia no arquivo privado</a></p>`);
    await Promise.allSettled([
      sendEmail(env.RESEND_API_KEY,{from:FROM,to:[email],reply_to:VOXLACI_EMAIL,subject:"Recebemos a sua candidatura — STELLA MINI CONCERTS 2026",html:confirmation}),
      sendEmail(env.RESEND_API_KEY,{from:FROM,to:[VOXLACI_EMAIL],reply_to:email,subject:`STELLA MINI CONCERTS — Nova candidatura | ${fullName}`,html:internal})
    ]);
  }
  return json({ok:true,reference});
}
