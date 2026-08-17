// Shared registration-form behaviour for all voX±Pop city pages.
(function(){
  var form = document.getElementById("voxpop-form");
  if (!form) return;
  var citySlug = form.dataset.city;

  var typeInputs = form.querySelectorAll('input[name="participation_type"]');
  var choirFields = form.querySelector('[data-fields="choir"]');
  var individualFields = form.querySelector('[data-fields="individual"]');

  function updateFields(){
    var type = form.querySelector('input[name="participation_type"]:checked');
    var v = type ? type.value : "";
    if (choirFields) choirFields.hidden = !(v === "choir" || v === "group");
    if (individualFields) individualFields.hidden = !(v === "individual");
  }
  typeInputs.forEach(function(input){ input.addEventListener("change", updateFields); });
  updateFields();

  form.addEventListener("submit", function(e){
    e.preventDefault();
    var errorBox = form.querySelector(".form-erro");
    var statusBox = document.getElementById("voxpop-status");
    if (errorBox) errorBox.style.display = "none";
    statusBox.className = "residency-status";
    var btn = form.querySelector(".residency-submit");
    btn.disabled = true;
    form.querySelector('input[name="language"]').value = document.documentElement.lang || "pt";

    fetch("/eventos/voxpop/api/register", { method: "POST", body: new FormData(form) })
      .then(function(r){ return r.json().then(function(d){ return { status: r.status, data: d }; }); })
      .then(function(res){
        if (res.data && res.data.ok) {
          if (typeof gtag === "function") {
            gtag("event", "voxpop_registration_submit", { event_category: "voxpop", event_label: citySlug });
            var opt = form.querySelector('input[name="participation_option"]:checked');
            if (opt) gtag("event", opt.value === "festival_dinner" ? "voxpop_festival_dinner" : "voxpop_festival_only", { event_category: "voxpop", event_label: citySlug });
          }
          form.hidden = true;
          statusBox.classList.add("is-visible", "ok");
          var lang = document.documentElement.lang;
          var ebLink = res.data.eventbriteUrl ? ("<br><a href=\"" + res.data.eventbriteUrl + "\" target=\"_blank\" rel=\"noopener\" data-analytics=\"voxpop_eventbrite_click\">" + (lang === "pt" ? "Completar no Eventbrite →" : "Complete on Eventbrite →") + "</a>") : "";
          statusBox.innerHTML = (lang === "pt"
            ? "<b>Inscrição registada.</b><br>ID: <b>" + res.data.voxpopId + "</b><br>Este registo não é um bilhete — para garantir o seu lugar, complete a compra no Eventbrite."
            : "<b>Registration recorded.</b><br>ID: <b>" + res.data.voxpopId + "</b><br>This is not a ticket — to secure your place, complete your purchase on Eventbrite.") + ebLink;
          statusBox.scrollIntoView({ behavior: "smooth" });
        } else {
          throw new Error((res.data && res.data.error) || "error");
        }
      })
      .catch(function(err){
        btn.disabled = false;
        if (errorBox) {
          errorBox.style.display = "block";
          errorBox.textContent = document.documentElement.lang === "pt"
            ? "Não foi possível submeter (" + err.message + "). Verifique os campos obrigatórios."
            : "Could not submit (" + err.message + "). Please check the required fields.";
        }
      });
  });

  form.addEventListener("focusin", function(){
    if (!form.dataset.startTracked && typeof gtag === "function") {
      form.dataset.startTracked = "1";
      gtag("event", "voxpop_registration_start", { event_category: "voxpop", event_label: citySlug });
    }
  });
})();
