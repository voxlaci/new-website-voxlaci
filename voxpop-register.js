// Shared registration wizard for all voX±Pop city pages with an #inscricao form.
// Expects: <form id="voxpop-form" data-city="lisboa"> with wizard panels (data-panel="1".."5"),
// a #voxpop-availability badge target, [data-fields="individual"|"group"] conditional fieldsets,
// and payment method radios with matching #details-<method> boxes (same pattern as RAMOS/STELLA).
(function () {
  var form = document.getElementById("voxpop-form");
  if (!form) return;
  var citySlug = form.dataset.city;
  var lang, t; // set by refreshLang() below, kept in sync with the PT/EN toggle

  var T = {
    pt: {
      available: function (n) { return n + " lugares disponíveis"; },
      lastSpots: function (n) { return "Últimos " + n + " lugares"; },
      soldOut: "Esgotado — inscreva-se na lista de espera",
      loading: "A verificar disponibilidade…",
      joinWaitlist: "Inscrever-me na lista de espera",
      register: "Submeter inscrição",
      sending: "A enviar…",
      insufficientCapacity: function (n) { return "Existem atualmente " + n + " lugares disponíveis nesta edição. O seu grupo tem mais participantes do que os lugares livres — pode reduzir o número, contactar a organização, ou inscrever-se na lista de espera."; },
      soldOutMessage: "Esta edição está esgotada. Pode inscrever-se na lista de espera — entraremos em contacto se houver desistências.",
      genericError: "Não foi possível submeter a inscrição. Verifique os campos obrigatórios ou contacte info@voxlaci.com.",
      receivedTitle: "Inscrição recebida.",
      receivedBody: "Fica a aguardar pagamento. Enviámos um email de confirmação.",
      reviewTitle: "Comprovativo recebido.",
      reviewBody: "O pagamento está agora em verificação. Vai receber um email assim que for confirmado.",
      waitlistTitle: "Inscrito(a) na lista de espera.",
      waitlistBody: "Se houver desistências, entraremos em contacto pela ordem de chegada.",
      idLabel: "ID da inscrição",
      totalLabel: "Total",
    },
    en: {
      available: function (n) { return n + " places available"; },
      lastSpots: function (n) { return "Only " + n + " places left"; },
      soldOut: "Sold out — join the waitlist",
      loading: "Checking availability…",
      joinWaitlist: "Join the waitlist",
      register: "Submit registration",
      sending: "Sending…",
      insufficientCapacity: function (n) { return "There are currently " + n + " places available for this edition. Your group is larger than the remaining places — you can reduce the number, contact the organisation, or join the waitlist."; },
      soldOutMessage: "This edition is sold out. You can join the waitlist — we'll be in touch if a place opens up.",
      genericError: "We could not submit your registration. Please check the required fields or contact info@voxlaci.com.",
      receivedTitle: "Registration received.",
      receivedBody: "It is now awaiting payment. A confirmation email has been sent.",
      reviewTitle: "Proof of payment received.",
      reviewBody: "The payment is now under review. You'll receive an email once it's confirmed.",
      waitlistTitle: "You're on the waitlist.",
      waitlistBody: "If a place opens up, we will contact you in order of arrival.",
      idLabel: "Registration ID",
      totalLabel: "Total",
    },
  };
  function refreshLang() {
    lang = document.documentElement.lang || "pt";
    t = T[lang] || T.pt;
  }
  refreshLang();

  var availabilityEl = document.getElementById("voxpop-availability");
  var stickyEl = document.getElementById("voxpop-sticky-availability");
  var edition = null;
  var joinWaitlistMode = false;
  if (availabilityEl) availabilityEl.textContent = t.loading;

  // Re-render language-dependent bits when the PT/EN toggle is used (project-language.js
  // swaps data-pt/data-en text synchronously on click, so a microtask delay is enough).
  document.addEventListener("click", function (e) {
    if (!e.target.closest("[data-set-lang]")) return;
    setTimeout(function () {
      refreshLang();
      renderAvailability();
      updatePriceSummary();
    }, 0);
  });

  function renderAvailability() {
    if (!edition) return;
    var badgeHtml;
    if (edition.status === "sold_out") {
      badgeHtml = '<span class="city-status-badge sold_out">' + (lang === "pt" ? "ESGOTADO" : "SOLD OUT") + "</span>";
      joinWaitlistMode = true;
    } else if (edition.status === "last_spots") {
      badgeHtml = '<span class="city-status-badge open">' + t.lastSpots(edition.available_seats) + "</span>";
    } else {
      badgeHtml = '<span class="city-status-badge open">' + t.available(edition.available_seats) + "</span>";
    }
    if (availabilityEl) availabilityEl.innerHTML = badgeHtml;
    if (stickyEl) stickyEl.textContent = edition.status === "sold_out" ? t.soldOut : t.available(edition.available_seats);

    var submitBtn = form.querySelector(".residency-submit");
    if (submitBtn) submitBtn.textContent = joinWaitlistMode ? t.joinWaitlist : t.register;
    var waitlistNote = document.getElementById("voxpop-waitlist-note");
    if (waitlistNote) waitlistNote.hidden = edition.status !== "sold_out";
  }

  fetch("/eventos/voxpop/api/editions?slug=" + encodeURIComponent(citySlug))
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (!d.ok) throw new Error(d.error);
      edition = d.edition;
      renderAvailability();
      populateDinnerOption();
    })
    .catch(function () {
      if (availabilityEl) availabilityEl.textContent = "";
    });

  function populateDinnerOption() {
    var dinnerField = document.getElementById("voxpop-dinner-field");
    if (!dinnerField) return;
    if (edition.dinner_addon_cents) {
      dinnerField.hidden = false;
      var priceEl = dinnerField.querySelector(".dinner-price");
      if (priceEl) priceEl.textContent = "+" + (edition.dinner_addon_cents / 100).toFixed(0) + " €";
    } else {
      dinnerField.hidden = true;
    }
  }

  // ── Individual / Group conditional fields ──────────────────────────────
  var typeInputs = form.querySelectorAll('input[name="participation_type"]');
  var groupFields = form.querySelector('[data-fields="group"]');
  var individualFields = form.querySelector('[data-fields="individual"]');
  function updateTypeFields() {
    var type = form.querySelector('input[name="participation_type"]:checked');
    var v = type ? type.value : "";
    if (groupFields) groupFields.hidden = v !== "group";
    if (individualFields) individualFields.hidden = v !== "individual";
    updatePriceSummary();
  }
  typeInputs.forEach(function (input) { input.addEventListener("change", updateTypeFields); });

  var numSingersInput = form.querySelector('input[name="num_singers"]');
  if (numSingersInput) numSingersInput.addEventListener("input", updatePriceSummary);
  var dinnerCheckbox = form.querySelector('input[name="dinner_selected"]');
  if (dinnerCheckbox) dinnerCheckbox.addEventListener("change", updatePriceSummary);

  function currentParticipants() {
    var type = form.querySelector('input[name="participation_type"]:checked');
    if (type && type.value === "group") {
      return Math.max(1, parseInt((numSingersInput && numSingersInput.value) || "1", 10) || 1);
    }
    return 1;
  }

  function updatePriceSummary() {
    var summaryEl = document.getElementById("voxpop-price-summary");
    if (!summaryEl || !edition) return;
    var type = form.querySelector('input[name="participation_type"]:checked');
    var isGroup = type && type.value === "group";
    var n = currentParticipants();
    var base = (isGroup && edition.price_group_cents ? edition.price_group_cents : edition.price_individual_cents || 0) * n;
    var dinnerOn = dinnerCheckbox && dinnerCheckbox.checked;
    var dinner = dinnerOn && edition.dinner_addon_cents ? edition.dinner_addon_cents * n : 0;
    var total = base + dinner;
    var euros = function (c) { return (c / 100).toLocaleString(lang === "pt" ? "pt-PT" : "en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 }); };
    var rows = "";
    rows += "<dt>" + (lang === "pt" ? "Participantes" : "Participants") + "</dt><dd>" + n + "</dd>";
    rows += "<dt>" + (lang === "pt" ? "Inscrição" : "Registration") + "</dt><dd>" + euros(base) + " €</dd>";
    if (dinnerOn) rows += "<dt>" + (lang === "pt" ? "Jantar" : "Dinner") + "</dt><dd>" + euros(dinner) + " €</dd>";
    rows += "<dt><b>" + t.totalLabel + "</b></dt><dd><b>" + euros(total) + " €</b></dd>";
    summaryEl.innerHTML = "<dl>" + rows + "</dl>";
  }

  // ── Payment method detail boxes ─────────────────────────────────────────
  form.querySelectorAll('input[name="payment_method"]').forEach(function (input) {
    input.addEventListener("change", function () {
      form.querySelectorAll(".payment-details-box").forEach(function (box) { box.hidden = true; });
      var box = document.getElementById("details-" + input.value);
      if (box) box.hidden = false;
    });
  });

  // ── Wizard navigation ────────────────────────────────────────────────────
  var panels = Array.prototype.slice.call(form.querySelectorAll(".wizard-panel"));
  var dots = Array.prototype.slice.call(form.closest("main").querySelectorAll(".wizard-step-dot"));
  var current = 1;
  var totalSteps = panels.length;

  function showStep(n) {
    current = n;
    panels.forEach(function (p) { p.classList.toggle("is-active", Number(p.dataset.panel) === n); });
    dots.forEach(function (d) {
      var s = Number(d.dataset.step);
      d.classList.toggle("is-active", s === n);
      d.classList.toggle("is-done", s < n);
    });
    if (n === totalSteps) updatePriceSummary();
    form.closest("main").scrollIntoView({ behavior: "smooth" });
  }
  function validateStep(n) {
    var panel = form.querySelector('.wizard-panel[data-panel="' + n + '"]');
    var fields = panel.querySelectorAll("input:not([hidden]), select:not([hidden]), textarea:not([hidden])");
    for (var i = 0; i < fields.length; i++) {
      if (fields[i].closest("[hidden]")) continue;
      if (!fields[i].checkValidity()) { fields[i].reportValidity(); return false; }
    }
    return true;
  }
  form.querySelectorAll(".wizard-next").forEach(function (btn) {
    btn.addEventListener("click", function () { if (validateStep(current) && current < totalSteps) showStep(current + 1); });
  });
  form.querySelectorAll(".wizard-back").forEach(function (btn) {
    btn.addEventListener("click", function () { if (current > 1) showStep(current - 1); });
  });
  updateTypeFields();

  // ── Submit ───────────────────────────────────────────────────────────────
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var errorBox = form.querySelector(".form-erro");
    var statusBox = document.getElementById("voxpop-status");
    if (errorBox) errorBox.style.display = "none";
    statusBox.className = "residency-status";
    var btn = form.querySelector(".residency-submit");
    btn.disabled = true;
    btn.textContent = t.sending;

    form.querySelector('input[name="language"]').value = lang;
    var fd = new FormData(form);
    fd.set("edition_slug", citySlug);
    if (joinWaitlistMode) fd.set("join_waitlist", "1");

    fetch("/eventos/voxpop/api/register", { method: "POST", body: fd })
      .then(function (r) { return r.json().then(function (d) { return { httpStatus: r.status, data: d }; }); })
      .then(function (res) {
        var d = res.data;
        if (!d.ok) {
          if (d.error === "insufficient_capacity" || d.error === "sold_out") {
            joinWaitlistMode = true;
            renderAvailability();
            if (errorBox) {
              errorBox.style.display = "block";
              errorBox.textContent = d.error === "sold_out" ? t.soldOutMessage : t.insufficientCapacity(d.available);
            }
            btn.disabled = false;
            return;
          }
          throw new Error(d.error || "error");
        }
        form.querySelectorAll(".wizard-panel, .wizard-progress").forEach(function (el) { el.hidden = true; });
        statusBox.classList.add("is-visible", "ok");
        var title = d.status === "waitlist" ? t.waitlistTitle : (d.status === "payment_review" ? t.reviewTitle : t.receivedTitle);
        var bodyText = d.status === "waitlist" ? t.waitlistBody : (d.status === "payment_review" ? t.reviewBody : t.receivedBody);
        statusBox.innerHTML = "<b>" + title + "</b><br>" + bodyText + "<br>" + t.idLabel + ": <b>" + d.voxpopId + "</b>";
        statusBox.scrollIntoView({ behavior: "smooth" });
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = joinWaitlistMode ? t.joinWaitlist : t.register;
        if (errorBox) {
          errorBox.style.display = "block";
          errorBox.textContent = t.genericError;
        }
      });
  });
})();
