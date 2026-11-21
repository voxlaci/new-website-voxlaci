(function () {
  const D = window.STELLA_2026;
  const I = window.STELLA_I18N;
  if (!D) return;

  const languages = ['pt', 'en', 'es', 'fr', 'it', 'zh'];
  let lang = languages.includes(localStorage.getItem('stella-programme-lang'))
    ? localStorage.getItem('stella-programme-lang')
    : 'pt';
  let active = D.days[0].id;
  let showAll = false;
  let marketFilter = 'all';

  const L = {
    pt: {
      buy: 'Comprar bilhete', confirmed: 'Confirmado', free: 'Entrada livre · sujeita à lotação',
      search: 'Pesquisar por nome, produto ou marca', searchLabel: 'Pesquisar expositores', none: 'Nenhum expositor encontrado.',
      try: 'Experimente outro nome, produto ou marca.', result: 'resultado', results: 'resultados', all: 'Todos', crafts: 'Artesanato',
      food: 'Gastronomia', fashion: 'Moda e acessórios', decor: 'Decoração e presentes', auditorium: 'Auditório',
      hall: 'STELLA Hall', church: 'Igreja', market: 'Mercado interior', workshops: 'Workshops',
      latest: 'Abra o Instagram para ver as publicações mais recentes.', more: 'Saber mais'
    },
    en: {
      buy: 'Buy ticket', confirmed: 'Confirmed', free: 'Free admission · subject to capacity',
      search: 'Search by name, product or brand', searchLabel: 'Search exhibitors', none: 'No exhibitors found.',
      try: 'Try another name, product or brand.', result: 'result', results: 'results', all: 'All', crafts: 'Crafts',
      food: 'Food', fashion: 'Fashion & accessories', decor: 'Decoration & gifts', auditorium: 'Auditorium',
      hall: 'STELLA Hall', church: 'Church', market: 'Indoor market', workshops: 'Workshops',
      latest: 'Open Instagram to see the latest posts.', more: 'Learn more'
    },
    es: {
      buy: 'Comprar entrada', confirmed: 'Confirmado', free: 'Entrada libre · sujeta al aforo',
      search: 'Buscar por nombre, producto o marca', searchLabel: 'Buscar expositores', none: 'No se encontraron expositores.',
      try: 'Pruebe con otro nombre, producto o marca.', result: 'resultado', results: 'resultados', all: 'Todos', crafts: 'Artesanía',
      food: 'Gastronomía', fashion: 'Moda y accesorios', decor: 'Decoración y regalos', auditorium: 'Auditorio',
      hall: 'STELLA Hall', church: 'Iglesia', market: 'Mercado interior', workshops: 'Talleres',
      latest: 'Abra Instagram para ver las publicaciones más recientes.', more: 'Saber más'
    },
    fr: {
      buy: 'Acheter un billet', confirmed: 'Confirmé', free: 'Entrée libre · sous réserve de places',
      search: 'Rechercher par nom, produit ou marque', searchLabel: 'Rechercher des exposants', none: 'Aucun exposant trouvé.',
      try: 'Essayez un autre nom, produit ou marque.', result: 'résultat', results: 'résultats', all: 'Tous', crafts: 'Artisanat',
      food: 'Gastronomie', fashion: 'Mode et accessoires', decor: 'Décoration et cadeaux', auditorium: 'Auditorium',
      hall: 'STELLA Hall', church: 'Église', market: 'Marché intérieur', workshops: 'Ateliers',
      latest: 'Ouvrez Instagram pour voir les publications les plus récentes.', more: 'En savoir plus'
    },
    it: {
      buy: 'Acquista biglietto', confirmed: 'Confermato', free: 'Ingresso libero · fino a esaurimento posti',
      search: 'Cerca per nome, prodotto o marchio', searchLabel: 'Cerca espositori', none: 'Nessun espositore trovato.',
      try: 'Prova un altro nome, prodotto o marchio.', result: 'risultato', results: 'risultati', all: 'Tutti', crafts: 'Artigianato',
      food: 'Gastronomia', fashion: 'Moda e accessori', decor: 'Decorazioni e regali', auditorium: 'Auditorium',
      hall: 'STELLA Hall', church: 'Chiesa', market: 'Mercato al coperto', workshops: 'Laboratori',
      latest: 'Apri Instagram per vedere i post più recenti.', more: 'Scopri di più'
    },
    zh: {
      buy: '购买门票', confirmed: '已确认', free: '免费入场 · 座位有限',
      search: '按姓名、产品或品牌搜索', searchLabel: '搜索参展商', none: '未找到参展商。',
      try: '请尝试其他姓名、产品或品牌。', result: '项结果', results: '项结果', all: '全部', crafts: '手工艺',
      food: '美食', fashion: '时尚与配饰', decor: '装饰与礼品', auditorium: '礼堂',
      hall: 'STELLA大厅', church: '教堂', market: '室内市集', workshops: '工作坊',
      latest: '打开 Instagram 查看最新帖子。', more: '了解更多'
    },
    pt: {
      buy: 'Comprar bilhete', confirmed: 'Confirmado', free: 'Entrada livre · sujeita à lotação',
      search: 'Pesquisar por nome, produto ou marca', searchLabel: 'Pesquisar expositores', none: 'Nenhum expositor encontrado.',
      try: 'Experimente outro nome, produto ou marca.', result: 'resultado', results: 'resultados', all: 'Todos', crafts: 'Artesanato',
      food: 'Gastronomia', fashion: 'Moda e acessórios', decor: 'Decoração e presentes', auditorium: 'Auditório',
      hall: 'STELLA Hall', church: 'Igreja', market: 'Mercado interior', workshops: 'Workshops',
      latest: 'Abra o Instagram para ver as publicações mais recentes.', more: 'Saber mais'
    }
  };

  const staticTranslations = {
    es: {
      'Programa':'Programa','Mercado':'Mercado','Bilhetes':'Entradas','Programação confirmada':'Programa confirmado','Descubra os 5 dias.':'Descubra los 5 días.',
      'Concertos principais':'Conciertos principales','Música que ilumina dezembro.':'Música que ilumina diciembre.','Perto do artista.':'Cerca del artista.',
      'As comunidades partilham as suas vozes.':'Las comunidades comparten sus voces.','Escutar. Compreender. Transformar.':'Escuchar. Comprender. Transformar.',
      'Esgotado para expositores':'Completo para expositores','Pesquisar':'Buscar','Ver todos os expositores':'Ver todos los expositores',
      'Acompanhe o STELLA':'Siga STELLA','A programação continua a crescer.':'El programa sigue creciendo.','Localização':'Ubicación','Página geral STELLA':'Página principal de STELLA',
      'Cinco dias. Todos diferentes. Todos STELLA.':'Cinco días. Todos diferentes. Todos STELLA.','5 DIAS. 5 EXPERIÊNCIAS. UM FESTIVAL.':'5 DÍAS. 5 EXPERIENCIAS. UN FESTIVAL.',
      'Uma luz comum':'Una luz común','Cinco dias para descobrir o STELLA.':'Cinco días para descubrir STELLA.','expositores':'expositores','mesas-dia':'mesas-día','ocupação':'ocupación'
    },
    fr: {
      'Programa':'Programme','Mercado':'Marché','Bilhetes':'Billets','Programação confirmada':'Programme confirmé','Descubra os 5 dias.':'Découvrez les 5 jours.',
      'Concertos principais':'Concerts principaux','Música que ilumina dezembro.':'La musique qui illumine décembre.','Perto do artista.':'Au plus près de l’artiste.',
      'As comunidades partilham as suas vozes.':'Les communautés partagent leurs voix.','Escutar. Compreender. Transformar.':'Écouter. Comprendre. Transformer.',
      'Esgotado para expositores':'Complet pour les exposants','Pesquisar':'Rechercher','Ver todos os expositores':'Voir tous les exposants',
      'Acompanhe o STELLA':'Suivez STELLA','A programação continua a crescer.':'Le programme continue de s’enrichir.','Localização':'Lieu','Página geral STELLA':'Page principale STELLA',
      'Cinco dias. Todos diferentes. Todos STELLA.':'Cinq jours. Tous différents. Tous STELLA.','5 DIAS. 5 EXPERIÊNCIAS. UM FESTIVAL.':'5 JOURS. 5 EXPÉRIENCES. UN FESTIVAL.',
      'Uma luz comum':'Une lumière commune','Cinco dias para descobrir o STELLA.':'Cinq jours pour découvrir STELLA.','expositores':'exposants','mesas-dia':'tables-jours','ocupação':'occupation'
    },
    it: {
      'Programa':'Programma','Mercado':'Mercato','Bilhetes':'Biglietti','Programação confirmada':'Programma confermato','Descubra os 5 dias.':'Scopri i 5 giorni.',
      'Concertos principais':'Concerti principali','Música que ilumina dezembro.':'Musica che illumina dicembre.','Perto do artista.':'Vicino all’artista.',
      'As comunidades partilham as suas vozes.':'Le comunità condividono le loro voci.','Escutar. Compreender. Transformar.':'Ascoltare. Comprendere. Trasformare.',
      'Esgotado para expositores':'Completo per gli espositori','Pesquisar':'Cerca','Ver todos os expositores':'Vedi tutti gli espositori',
      'Acompanhe o STELLA':'Segui STELLA','A programação continua a crescer.':'Il programma continua a crescere.','Localização':'Luogo','Página geral STELLA':'Pagina principale STELLA',
      'Cinco dias. Todos diferentes. Todos STELLA.':'Cinque giorni. Tutti diversi. Tutti STELLA.','5 DIAS. 5 EXPERIÊNCIAS. UM FESTIVAL.':'5 GIORNI. 5 ESPERIENZE. UN FESTIVAL.',
      'Uma luz comum':'Una luce comune','Cinco dias para descobrir o STELLA.':'Cinque giorni per scoprire STELLA.','expositores':'espositori','mesas-dia':'tavoli-giorno','ocupação':'occupazione'
    },
    zh: {
      'Programa':'节目','Mercado':'市集','Bilhetes':'门票','Programação confirmada':'已确认节目','Descubra os 5 dias.':'探索五天活动。',
      'Concertos principais':'主要音乐会','Música que ilumina dezembro.':'点亮十二月的音乐。','Perto do artista.':'走近艺术家。',
      'As comunidades partilham as suas vozes.':'社区分享他们的声音。','Escutar. Compreender. Transformar.':'聆听。理解。改变。',
      'Esgotado para expositores':'参展名额已满','Pesquisar':'搜索','Ver todos os expositores':'查看所有参展商',
      'Acompanhe o STELLA':'关注 STELLA','A programação continua a crescer.':'节目仍在不断丰富。','Localização':'地点','Página geral STELLA':'STELLA 主页',
      'Cinco dias. Todos diferentes. Todos STELLA.':'五天，各不相同，都是 STELLA。','5 DIAS. 5 EXPERIÊNCIAS. UM FESTIVAL.':'5天。5种体验。1个节日。',
      'Uma luz comum':'共同之光','Cinco dias para descobrir o STELLA.':'用五天探索 STELLA。','expositores':'参展商','mesas-dia':'展位日','ocupação':'入驻率'
    }
  };

  const safe = value => String(value || '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const tr = value => {
    if (value && typeof value === 'object') {
      if (value[lang]) return value[lang];
      if (lang === 'pt') return value.pt || value.en || '';
      if (I?.has(lang, value.pt)) return I.get(lang, value.pt);
      return value.en || value.pt || '';
    }
    return I?.get(lang, value || '') || value || '';
  };
  const img = (src, alt) => src ? `<img class="agenda-img" src="${safe(src)}" alt="${safe(alt)}" loading="lazy" onerror="this.classList.add('missing-image')">` : '';
  const eventMedia = event => {
    const sources = event.images || (event.image ? [event.image] : []);
    if (!sources.length) return '';
    const label = tr(event.artist || event.title);
    return `<div class="agenda-media${sources.length > 1 ? ' agenda-media--double' : ''}">${sources.map((src, index) => img(src, sources.length > 1 ? `${label} · ${index + 1}` : label)).join('')}</div>`;
  };

  function translatedStatic(element) {
    const pt = element.getAttribute('data-pt') || element.textContent;
    if (lang === 'pt') return pt;
    if (lang === 'en') return element.getAttribute('data-en') || pt;
    return I?.get(lang, pt) || staticTranslations[lang]?.[pt] || element.getAttribute('data-en') || pt;
  }

  function venueGroup(event) {
    const venue = `${tr(event.venue)} ${event.category || ''}`.toLowerCase();
    if (event.category === 'workshop') return 'workshops';
    if (event.category === 'market' || event.category === 'makers') return 'market';
    if (/audit/.test(venue)) return 'auditorium';
    if (/igreja|church|capela|chapel/.test(venue)) return 'church';
    return 'hall';
  }

  function renderAgenda() {
    const startMinutes = value => {
      const match = String(value || '').match(/(\d{1,2}):(\d{2})/);
      return match ? Number(match[1]) * 60 + Number(match[2]) : Number.MAX_SAFE_INTEGER;
    };
    const events = [...D.programme[active]].sort((a, b) => {
      if (a.category === 'market') return -1;
      if (b.category === 'market') return 1;
      return startMinutes(a.time) - startMinutes(b.time);
    });
    document.querySelector('.agenda').innerHTML = events.map(event => `<article class="agenda-item">
          ${eventMedia(event)}
          <div class="agenda-copy"><h3>${safe(tr(event.title))}</h3>
          <div class="agenda-time">${safe(tr(event.time))}</div>
          <p><strong>${safe(tr(event.artist))}</strong>${event.venue ? ` · ${safe(tr(event.venue))}` : ''}</p>
          ${event.summary ? `<p class="event-summary">${safe(tr(event.summary))}</p>` : ''}
          <span class="pill">${safe(tr(event.price) || L[lang].confirmed)}</span>
          <details class="event-details"><summary>${safe(L[lang].more)}</summary><p>${safe(tr(event.description))}</p>${event.category === 'choir' ? `<a class="detail-link" href="/eventos/stella/#stella-choir-day">${safe(I.get(lang,'Conhecer o STELLA Choir Day'))}</a>` : ''}</details>
          ${event.links ? `<div class="agenda-links">${event.links.map(link => `<a href="${safe(link.url)}" target="_blank" rel="noopener">${safe(link.label)}</a>`).join('')}</div>` : ''}
          ${event.ticketUrl ? `<a class="button gold" href="${event.ticketUrl}" target="_blank" rel="noopener">${L[lang].buy}</a>` : ''}</div>
        </article>`).join('');
  }

  function renderDayCards() {
    document.querySelector('#day-cards').innerHTML = D.dayCards.map(card => `<button class="day-card" type="button" data-day="${card.target}"><b>${safe(tr(card.date))}</b><span>${safe(tr(card.summary))}</span></button>`).join('');
    document.querySelectorAll('.day-card').forEach(button => button.onclick = () => {
      active = button.dataset.day; renderTabs(); renderAgenda(); document.querySelector('#programa').scrollIntoView({behavior:'smooth'});
    });
  }

  function renderTabs() {
    const container = document.querySelector('.day-tabs');
    container.innerHTML = '';
    D.days.forEach(day => {
      const button = document.createElement('button');
      button.className = 'day-tab'; button.type = 'button'; button.role = 'tab'; button.textContent = tr(day.label);
      button.setAttribute('aria-selected', day.id === active);
      button.onclick = () => { active = day.id; renderTabs(); renderAgenda(); };
      container.appendChild(button);
    });
  }

  function visualCard(item, ticket) {
    return `<article class="visual-card">${img(item.image, tr(item.title))}<div class="visual-copy"><p class="eyebrow">${safe(tr(item.date))}</p><h3>${safe(tr(item.title))}</h3>${item.subtitle ? `<p>${safe(tr(item.subtitle))}</p>` : ''}<p>${safe(tr(item.venue || ''))}${item.price ? ` · ${safe(tr(item.price))}` : ''}</p><details class="event-details"><summary>${safe(L[lang].more)}</summary><p>${safe(tr(item.description))}</p></details>${ticket ? `<a class="button gold" href="${ticket}" target="_blank" rel="noopener">${L[lang].buy}</a>` : ''}</div></article>`;
  }

  function renderChoirs() {
    document.querySelector('#choir-list').innerHTML = D.choirs.map(choir => `<article class="choir"><div class="choir-media">${img(choir.leaderImage, choir.leader)}${img(choir.image, choir.title)}</div><div class="choir-copy"><p class="eyebrow">${safe(tr(choir.dates))}</p><h3>${safe(choir.leader)}</h3><p><strong>${safe(choir.title)}</strong><br>${safe(tr(choir.place))}</p><details class="event-details"><summary>${safe(L[lang].more)}</summary><p>${safe(tr(choir.description))}</p><a class="detail-link" href="/eventos/stella/#stella-choir-day">${safe(I.get(lang,'Conhecer o STELLA Choir Day'))}</a></details></div></article>`).join('');
  }

  function marketCategory(item) {
    const value = item.join(' ').toLocaleLowerCase('pt');
    if (/doce|bolo|crepe|tosta|gastronomia|sopa|salgado|bolacha/.test(value)) return 'food';
    if (/roupa|moda|malas|bijuteria|brinco|acessório|perfume|boticário/.test(value)) return 'fashion';
    if (/natal|decora|vela|flor|caixa|quadro|cerâmica|gesso|madeira|pedra/.test(value)) return 'decor';
    return 'craft';
  }

  function renderMarketFilters() {
    const labels = {all:L[lang].all, craft:L[lang].crafts, food:L[lang].food, fashion:L[lang].fashion, decor:L[lang].decor};
    document.querySelector('#market-filters').innerHTML = Object.entries(labels).map(([key,label]) => `<button class="market-filter" type="button" data-market-filter="${key}" aria-pressed="${key === marketFilter}">${safe(label)}</button>`).join('');
    document.querySelectorAll('[data-market-filter]').forEach(button => button.onclick = () => {marketFilter = button.dataset.marketFilter; showAll = true; renderMarketFilters(); renderMarket();});
  }

  const normalise = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt').trim();
  function renderMarket() {
    const query = normalise(document.querySelector('#market-search').value);
    let list = D.exhibitors.filter(item => normalise(item.join(' ')).includes(query) && (marketFilter === 'all' || marketCategory(item) === marketFilter));
    const total = list.length;
    if (!showAll && !query && marketFilter === 'all') list = list.slice(0, 12);
    document.querySelector('#exhibitors').innerHTML = list.length ? list.map(item => {
      const participation = item[0] === 'Rita Agapito'
        ? (lang === 'pt' ? ' · 5 e 6 dezembro' : ' · 5 & 6 December')
        : '';
      return `<article class="exhibitor"><b>${safe(item[0])}</b><span>${safe(item[1])}${item[2] ? ` · ${safe(item[2])}` : ''}${participation}</span></article>`;
    }).join('') : `<article class="exhibitor"><b>${L[lang].none}</b><span>${L[lang].try}</span></article>`;
    document.querySelector('#market-results-status').textContent = query || marketFilter !== 'all' ? `${total} ${total === 1 ? L[lang].result : L[lang].results}` : '';
  }

  function renderAll() {
    renderDayCards(); renderTabs(); renderAgenda(); renderChoirs();
    document.querySelector('#concert-cards').innerHTML = D.concerts.map(item => visualCard(item, item.ticketUrl)).join('');
    document.querySelector('#mini-cards').innerHTML = D.mini.map(item => visualCard({...item, venue:'STELLA Hall', price:'5 €'}, 'https://shorturl.at/uGOtI')).join('');
    document.querySelector('#community-grid').innerHTML = D.community.map(item => `<article class="simple-card">${img(item.image, tr(item.title))}<p class="eyebrow">${safe(tr(item.date))}</p><h3>${safe(tr(item.title))}</h3>${item.subtitle ? `<p><strong>${safe(tr(item.subtitle))}</strong></p>` : ''}<span class="pill">${L[lang].free}</span>${item.description ? `<details class="community-details"><summary>${safe(I.get(lang,'Saber mais'))}</summary><p>${safe(tr(item.description))}</p></details>` : ''}</article>`).join('');
    document.querySelector('#workshop-cards').innerHTML = D.workshops.map(item => visualCard(item, item.ticketUrl)).join('');
    renderMarketFilters(); renderMarket();
  }

  function applyLanguage() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-pt]').forEach(element => element.textContent = translatedStatic(element));
    document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === lang)));
    const search = document.querySelector('#market-search');
    search.placeholder = L[lang].search; search.setAttribute('aria-label', L[lang].searchLabel);
    const stats = document.querySelectorAll('.market-stats b');
    if (stats[0]) stats[0].textContent = '68';
    if (stats[1]) stats[1].textContent = '180';
    document.title = lang === 'pt' ? 'STELLA Festival 2026 | Cascais | VoxLaci' : 'STELLA Festival 2026 | Cascais | VoxLaci';
    renderAll();
  }

  document.querySelectorAll('[data-lang]').forEach(button => button.onclick = () => {lang = button.dataset.lang; localStorage.setItem('stella-programme-lang', lang); applyLanguage();});
  document.querySelector('#market-search').oninput = renderMarket;
  document.querySelector('#market-search-form').onsubmit = event => {event.preventDefault(); showAll = true; renderMarket();};
  document.querySelector('#show-all').onclick = () => {showAll = true; document.querySelector('#market-search').value = ''; marketFilter = 'all'; renderMarketFilters(); renderMarket();};
  applyLanguage();
  const instagramGrid = document.querySelector('#stella-insta-grid');
  if (instagramGrid) {
    const fallback = instagramGrid.innerHTML;
    fetch('/instagram-feed').then(response => response.ok ? response.json() : Promise.reject(new Error('feed unavailable'))).then(posts => {
      if (!Array.isArray(posts) || !posts.length) throw new Error('empty feed');
      instagramGrid.innerHTML = posts.slice(0, 6).map(post => `<a class="insta-post-item" href="${safe(post.url)}" target="_blank" rel="noopener" aria-label="Instagram VoxLaci"><img src="${safe(post.image)}" alt="" loading="lazy"><span class="insta-post-overlay" aria-hidden="true">Instagram</span></a>`).join('');
    }).catch(() => { instagramGrid.innerHTML = fallback; });
  }
})();
