import { PRICING, MODALITY_LABELS } from "../../../_shared/stella.js";

export async function onRequestGet() {
  return new Response(JSON.stringify({ ok: true, pricing: PRICING, modalityLabels: MODALITY_LABELS }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=300" },
  });
}
