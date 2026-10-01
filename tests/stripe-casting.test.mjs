import test from "node:test";
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";

globalThis.crypto ??= webcrypto;

const { castingCheckoutEntries, verifyStripeWebhook } = await import("../functions/_shared/stripe.mjs");
const { onRequestPost: castingWebhook } = await import("../functions/api/stripe/casting-webhook.js");

async function signature(payload, secret, timestamp) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`)));
  return [...digest].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

test("Checkout is one-time EUR 20 with card and native MB WAY", () => {
  const entries = new Map(castingCheckoutEntries({
    applicationId: "CAST-TEST", privateToken: "private", name: "Test User",
    email: "test@example.com", ensemble: "VoxATMA", language: "pt", origin: "https://voxlaci.com",
  }));
  assert.equal(entries.get("mode"), "payment");
  assert.equal(entries.get("line_items[0][price_data][currency]"), "eur");
  assert.equal(entries.get("line_items[0][price_data][unit_amount]"), "2000");
  assert.equal(entries.get("payment_method_types[0]"), "card");
  assert.equal(entries.get("payment_method_types[1]"), "mb_way");
  assert.equal(entries.get("wallet_options[link][display]"), "never");
  assert.equal(entries.get("metadata[tipo]"), "casting");
  assert.equal(entries.has("subscription_data"), false);
  assert.equal(entries.has("payment_intent_data[setup_future_usage]"), false);
  assert.equal(entries.has("customer_creation"), false);
});

test("valid Stripe signature is accepted and tampered body is rejected", async () => {
  const secret = "whsec_test_secret";
  const timestamp = 1700000000;
  const payload = JSON.stringify({ id: "evt_test", type: "checkout.session.completed" });
  const digest = await signature(payload, secret, timestamp);
  const header = `t=${timestamp},v1=${digest}`;
  assert.equal(await verifyStripeWebhook(payload, header, secret, timestamp), true);
  assert.equal(await verifyStripeWebhook(`${payload} `, header, secret, timestamp), false);
});

test("expired and malformed webhook signatures are rejected", async () => {
  const secret = "whsec_test_secret";
  const payload = "{}";
  const digest = await signature(payload, secret, 1000);
  assert.equal(await verifyStripeWebhook(payload, `t=1000,v1=${digest}`, secret, 1401), false);
  assert.equal(await verifyStripeWebhook(payload, "invalid", secret, 1000), false);
});

function fakeDb() {
  const state = { paid: false, batches: 0 };
  return {
    state,
    prepare(sql) {
      return {
        sql, args: [],
        bind(...args) { this.args = args; return this; },
        async first() { return null; },
      };
    },
    async batch(statements) {
      state.batches += 1;
      state.paid = statements.some((statement) => statement.sql.includes("status = 'paid'"));
      return statements.map(() => ({ success: true }));
    },
  };
}

async function signedWebhookRequest(event, secret) {
  const payload = JSON.stringify(event);
  const timestamp = Math.floor(Date.now() / 1000);
  const digest = await signature(payload, secret, timestamp);
  return new Request("https://voxlaci.com/api/stripe/casting-webhook", {
    method: "POST", body: payload, headers: { "Stripe-Signature": `t=${timestamp},v1=${digest}` },
  });
}

test("paid card or MB WAY Checkout event marks the casting paid", async () => {
  const secret = "whsec_test_secret";
  const DB = fakeDb();
  const event = { id: "evt_paid", type: "checkout.session.completed", data: { object: {
    id: "cs_test_paid", payment_status: "paid", amount_total: 2000, currency: "eur",
    payment_intent: "pi_test", client_reference_id: "CAST-TEST",
    metadata: { tipo: "casting", inscricao_id: "CAST-TEST" },
  } } };
  const response = await castingWebhook({ request: await signedWebhookRequest(event, secret), env: { DB, STRIPE_WEBHOOK_SECRET: secret } });
  assert.equal(response.status, 200);
  assert.equal(DB.state.paid, true);
});

test("invalid signature and unpaid return cannot mark a casting paid", async () => {
  const secret = "whsec_test_secret";
  const DB = fakeDb();
  const event = { id: "evt_unpaid", type: "checkout.session.completed", data: { object: {
    id: "cs_test_unpaid", payment_status: "unpaid", amount_total: 2000, currency: "eur",
    client_reference_id: "CAST-TEST", metadata: { tipo: "casting", inscricao_id: "CAST-TEST" },
  } } };
  const invalid = new Request("https://voxlaci.com/api/stripe/casting-webhook", { method: "POST", body: JSON.stringify(event), headers: { "Stripe-Signature": "invalid" } });
  assert.equal((await castingWebhook({ request: invalid, env: { DB, STRIPE_WEBHOOK_SECRET: secret } })).status, 400);
  assert.equal(DB.state.paid, false);
  const validResponse = await castingWebhook({ request: await signedWebhookRequest(event, secret), env: { DB, STRIPE_WEBHOOK_SECRET: secret } });
  assert.equal(validResponse.status, 200);
  assert.equal(DB.state.paid, false);
});
