/* Casting: idempotência no browser e medição do funil sem dados pessoais. */
(function () {
  var form = document.querySelector('form[action="/enviar-casting"]');
  if (!form) return;

  var key = form.querySelector('input[name="submission-key"]');
  if (key && !key.value) {
    key.value = (window.crypto && window.crypto.randomUUID)
      ? window.crypto.randomUUID()
      : Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  var submitted = false;
  form.addEventListener("submit", function () {
    if (submitted) return;
    submitted = true;
    try { sessionStorage.setItem("voxlaci_casting_submitted", "1"); } catch (_) {}
    if (typeof window.gtag === "function") {
      window.gtag("event", "casting_submit", { form_name: "inscricao-voxlaci" });
    }
    var button = form.querySelector('button[type="submit"]');
    if (button) {
      window.setTimeout(function () { button.disabled = true; }, 0);
    }
  });
})();

