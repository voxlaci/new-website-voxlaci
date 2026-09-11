// Captures utm_* params from the URL into sessionStorage (so they survive a
// click from the marketing page through to the application form), exposes
// them as window.voxlaciUTM, and offers window.voxlaciAppendUTM(url) to carry
// them onto same-site links. No DOM dependency — safe to load early in <head>.
(function () {
  var KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  var params = new URLSearchParams(location.search);
  var stored = {};
  try { stored = JSON.parse(sessionStorage.getItem("voxlaci_utm") || "{}"); } catch (e) {}
  var changed = false;
  KEYS.forEach(function (k) {
    var v = params.get(k);
    if (v) { stored[k] = v; changed = true; }
  });
  if (changed) {
    try { sessionStorage.setItem("voxlaci_utm", JSON.stringify(stored)); } catch (e) {}
  }
  window.voxlaciUTM = stored;
  window.voxlaciAppendUTM = function (url) {
    try {
      var u = new URL(url, location.href);
      KEYS.forEach(function (k) {
        if (stored[k] && !u.searchParams.get(k)) u.searchParams.set(k, stored[k]);
      });
      return u.pathname + u.search + u.hash;
    } catch (e) {
      return url;
    }
  };
})();
