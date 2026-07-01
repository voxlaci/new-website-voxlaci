(() => {
  const supported = ["pt","en","es","fr","it","zh"];
  const saved = localStorage.getItem("voxlaci-project-lang") || document.documentElement.lang || "pt";
  function setLang(lang) {
    if (!supported.includes(lang)) return;
    document.documentElement.lang = lang;
    localStorage.setItem("voxlaci-project-lang", lang);
    document.querySelectorAll("[data-pt]").forEach((el) => {
      const value = el.getAttribute(`data-${lang}`) || el.getAttribute("data-en") || el.getAttribute("data-pt");
      if (value) el.innerHTML = value;
    });
    document.querySelectorAll("[data-set-lang]").forEach((button) => button.classList.toggle("active", button.dataset.setLang === lang));
  }
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-set-lang]");
    if (button) setLang(button.dataset.setLang);
  });
  setLang(saved);
})();