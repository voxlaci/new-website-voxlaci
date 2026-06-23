(() => {
  if (document.querySelector(".universal-share")) return;
  const dock = document.createElement("nav");
  dock.className = "universal-share";
  dock.setAttribute("aria-label", "Partilhar esta página");
  dock.innerHTML = `<button type="button" aria-label="Abrir opções de partilha" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></svg></button><div class="universal-share-menu" hidden><a data-network="whatsapp" target="_blank" rel="noopener">WhatsApp</a><a data-network="facebook" target="_blank" rel="noopener">Facebook</a><button data-network="instagram" type="button">Instagram · copiar ligação</button><a data-network="email">Email</a><button data-network="copy" type="button">Copiar ligação</button><button data-network="native" type="button">Mais opções…</button></div>`;
  document.body.appendChild(dock);
  const trigger = dock.querySelector(":scope > button");
  const menu = dock.querySelector(".universal-share-menu");
  const pageUrl = encodeURIComponent(location.href);
  const message = encodeURIComponent("Descubra a VoxLaci — mais do que unirmos vozes, transformamos mundos.");
  dock.querySelector('[data-network="whatsapp"]').href = `https://wa.me/?text=${message}%20${pageUrl}`;
  dock.querySelector('[data-network="facebook"]').href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
  dock.querySelector('[data-network="email"]').href = `mailto:?subject=${encodeURIComponent(document.title)}&body=${message}%20${pageUrl}`;
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    menu.hidden = !menu.hidden;
    trigger.setAttribute("aria-expanded", String(!menu.hidden));
  });
  menu.addEventListener("click", (event) => event.stopPropagation());
  document.addEventListener("click", () => {
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  });
  dock.querySelector('[data-network="copy"]').addEventListener("click", async (event) => {
    await navigator.clipboard.writeText(location.href);
    event.currentTarget.textContent = "Ligação copiada ✓";
  });
  dock.querySelector('[data-network="instagram"]').addEventListener("click", async (event) => {
    await navigator.clipboard.writeText(location.href);
    event.currentTarget.textContent = "Ligação copiada · abra o Instagram ✓";
    setTimeout(() => window.open("https://www.instagram.com/", "_blank", "noopener"), 250);
  });
  const native = dock.querySelector('[data-network="native"]');
  if (!navigator.share) native.hidden = true;
  native.addEventListener("click", async () => {
    try { await navigator.share({title: document.title, url: location.href}); } catch (_) {}
  });
  if (!sessionStorage.getItem("voxlaci-share-nudge")) {
    setTimeout(() => {
      const nudge = document.createElement("aside");
      nudge.className = "share-nudge";
      nudge.innerHTML = `Gostaria de partilhar esta página?<button aria-label="Fechar">×</button>`;
      document.body.appendChild(nudge);
      sessionStorage.setItem("voxlaci-share-nudge", "1");
      nudge.querySelector("button").addEventListener("click", () => nudge.remove());
      setTimeout(() => nudge.remove(), 9000);
    }, 35000);
  }
})();
