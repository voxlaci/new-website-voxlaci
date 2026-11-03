import test from "node:test";
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";

globalThis.crypto ??= webcrypto;

const { onRequestPost } = await import("../functions/enviar-casting.js");

function fakeDb() {
  const state = { inserts: 0, updates: [] };
  return {
    state,
    prepare(sql) {
      return {
        sql,
        args: [],
        bind(...args) { this.args = args; return this; },
        async first() { return null; },
        async run() {
          if (sql.includes("INSERT INTO casting_applications")) state.inserts += 1;
          if (sql.includes("UPDATE casting_applications SET notification_status")) state.updates.push(this.args);
          return { success: true };
        },
      };
    },
  };
}

function request() {
  const fd = new FormData();
  fd.set("submission-key", "test-submission-key");
  fd.set("nome", "Test User");
  fd.set("idade", "30");
  fd.set("telefone", "+351900000000");
  fd.set("email", "test@example.com");
  fd.set("pagamento-inscricao", "MB WAY");
  fd.set("nome-pagamento", "Test User");
  fd.set("comprovativo", new Blob(["test"], { type: "application/pdf" }), "receipt.pdf");
  return new Request("https://voxlaci.com/enviar-casting", { method: "POST", body: fd });
}

test("casting records accepted internal and candidate emails", async (t) => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => new Response(JSON.stringify({ id: `email_${++calls}` }), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
  t.after(() => { globalThis.fetch = originalFetch; });

  const DB = fakeDb();
  const response = await onRequestPost({ request: request(), env: { DB, RESEND_API_KEY: "test", CASTING_TEST_MODE: "true" } });
  assert.equal(response.status, 303);
  assert.equal(new URL(response.headers.get("location")).pathname, "/casting-obrigado.html");
  assert.equal(DB.state.inserts, 1);
  assert.deepEqual(DB.state.updates.map((args) => args[0]), ["internal_accepted", "accepted"]);
});

test("casting keeps the application and reports a candidate confirmation failure", async (t) => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return calls === 1
      ? new Response(JSON.stringify({ id: "email_internal" }), { status: 200, headers: { "Content-Type": "application/json" } })
      : new Response(JSON.stringify({ message: "suppressed" }), { status: 422, headers: { "Content-Type": "application/json" } });
  };
  t.after(() => { globalThis.fetch = originalFetch; });

  const DB = fakeDb();
  const response = await onRequestPost({ request: request(), env: { DB, RESEND_API_KEY: "test", CASTING_TEST_MODE: "true" } });
  assert.equal(response.status, 303);
  assert.equal(new URL(response.headers.get("location")).searchParams.get("confirmacao"), "pendente");
  assert.equal(DB.state.inserts, 1);
  assert.deepEqual(DB.state.updates.map((args) => args[0]), ["internal_accepted", "candidate_failed"]);
});

