const topbar = document.querySelector(".topbar");
const menuButton = document.querySelector(".menu-toggle");
const desktopNav = document.querySelector(".desktop-nav");
const languageButton = document.querySelector(".lang-toggle");
let language = document.documentElement.lang === "en" ? "en" : "pt";
let chatLanguage = "pt";
const castingWelcome = document.querySelector(".casting-welcome");
const castingWelcomeClose = document.querySelector(".casting-welcome-close");

window.addEventListener("scroll", () => topbar.classList.toggle("scrolled", scrollY > 40), { passive: true });

if (castingWelcome) {
  setTimeout(() => {
    if (!castingWelcome.open) castingWelcome.showModal();
  }, 850);
  castingWelcomeClose.addEventListener("click", () => castingWelcome.close());
  castingWelcome.addEventListener("click", (event) => {
    if (event.target === castingWelcome) castingWelcome.close();
  });
  castingWelcome.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => castingWelcome.close()));
}

const watchLive = document.querySelector(".watch-live");
const heroVideo = document.querySelector(".hero-video");
const heroVideoFrame = heroVideo.querySelector("iframe");
const videoClose = document.querySelector(".video-close");
watchLive.addEventListener("click", () => {
  if (!heroVideoFrame.src) heroVideoFrame.src = heroVideoFrame.dataset.src;
  heroVideo.classList.add("active");
  videoClose.classList.add("active");
  heroVideo.setAttribute("aria-hidden", "false");
});
videoClose.addEventListener("click", () => {
  heroVideo.classList.remove("active");
  videoClose.classList.remove("active");
  heroVideo.setAttribute("aria-hidden", "true");
  heroVideoFrame.src = "";
});

menuButton.addEventListener("click", () => {
  const open = desktopNav.classList.toggle("mobile-open");
  menuButton.setAttribute("aria-expanded", String(open));
});

function applySiteLanguage() {
  document.documentElement.lang = language;
  document.querySelectorAll("[data-pt][data-en]").forEach((item) => item.innerHTML = item.dataset[language]);
  languageButton.textContent = language === "pt" ? "EN" : "PT";
}
applySiteLanguage();
languageButton.addEventListener("click", () => {
  language = language === "pt" ? "en" : "pt";
  applySiteLanguage();
  if (voiceModeCopy?.[voiceMode] && !voiceBusy) setVoiceMode(voiceMode);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: .12 });
document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const details = {
  pueri: {
    title: "Vox Pueri",
    body: "Para crianças dos 4 aos 9/10 anos. Uma primeira experiência musical que desenvolve escuta, confiança, linguagem, coordenação e alegria de criar em grupo.",
    meta: "Segundas-feiras · 17h–17h50"
  },
  soul: {
    title: "Vox Soul",
    body: "Para jovens dos 10 aos 18 anos. Técnica vocal, repertório, palco, amizades e oportunidades para atuar e viajar em Portugal e no estrangeiro.",
    meta: "Segundas-feiras · 18h–19h15"
  },
  atma: {
    title: "Vox Atma",
    body: "Coro de adultos com ou sem experiência musical. Um espaço seguro para respirar, cantar repertório variado, criar relações e reencontrar a própria voz.",
    meta: "Segundas-feiras · 20h15–21h30"
  },
  voxcor: {
    title: "VoxCor",
    body: "Coro adulto e grupo vocal da comunidade VoxLaci. Um espaço para cantar em conjunto, trabalhar repertório, desenvolver a voz e criar relações, com acolhimento para diferentes níveis de experiência.",
    meta: "Coro adulto · Cascais"
  },
  tutti: {
    title: "Tutti",
    body: "Tutti é um grupo próprio da comunidade VoxLaci: cantar coletivo, cantar em grupo e fazer coro. Uma experiência de pertença, escuta e construção musical partilhada.",
    meta: "Cantar coletivo · Cantar em grupo"
  },
  ramos: {
    title: "Ramos · Palm Sunday Festival",
    body: "Um projeto internacional da VoxLaci que reúne maestros convidados, cantores individuais e coros na semana anterior à Páscoa. O programa combina masterclasses, ensaios intensivos, desenvolvimento artístico e concertos em Cascais e Lisboa. A página completa reunirá todas as edições, maestros, fotografias, cartazes e formas de participação.",
    meta: "Cascais + Lisboa · International Choral Festival"
  },
  janeiras: { title: "Janeiras", body: "Um projeto que recupera a tradição de cantar as Janeiras e transforma o início do ano num encontro de vozes, famílias e comunidade.", meta: "Tradição · Comunidade · Portugal" },
  puerifest: { title: "VoxPueri Festival", body: "Festival pensado para crianças, combinando canto coral, expressão artística, movimento, descoberta e encontro entre participantes.", meta: "Festival infantil · 6–12 anos" },
  reis: { title: "Reis", body: "Concerto e encontro coral dedicado ao Dia de Reis, reunindo repertório, tradição e comunidade.", meta: "Concerto de Reis · Janeiro" },
  stella: { title: "Stella", body: "Uma experiência musical da VoxLaci em que voz, luz e espaço constroem uma narrativa artística.", meta: "Concerto · Criação VoxLaci" },
  gratias: { title: "Gratias", body: "Música entendida como gesto de gratidão, encontro e partilha entre intérpretes e público.", meta: "Concerto · Comunidade" },
  deuses: { title: "Deuses", body: "Criação coral e cénica que cruza repertório, narrativa e espetáculo.", meta: "Criação · Espetáculo" },
  musica: { title: "Dia Mundial da Música", body: "Uma celebração da música como linguagem universal e da voz como ponto de encontro entre gerações.", meta: "1 de outubro · Música" },
  barbershop: { title: "Barbershop College", body: "Uma experiência para conhecer, aprender, cantar e partilhar a linguagem da harmonia barbershop.", meta: "Formação · Harmonia vocal" },
  voxaround: { title: "VoxAround", body: "Um projeto de circulação e encontro que liga vozes, cidades e culturas.", meta: "Intercâmbio · Internacional" },
  conductors: { title: "Conductor’s MOB", body: "Encontro dedicado à partilha, formação e desenvolvimento de maestros e líderes musicais.", meta: "Direção coral · Formação" },
  voxpop: { title: "voX±Pop", body: "Uma família de encontros e experiências internacionais da VoxLaci, com edições em Cascais, Lisboa, Porto, Londres, Monopoli e Dakar.", meta: "Cascais · Lisboa · Porto · London · Monopoli · Dakar" },
  segunda: { title: "Música de Segunda", body: "Uma série musical de proximidade: encontros regulares com artistas, repertórios e comunidade. As próximas datas serão publicadas quando estiverem confirmadas.", meta: "Série musical · VoxLaci" },
  escolas: { title: "Coros nas Escolas", body: "Projeto de prática coral para contextos educativos, levando escuta, criação, trabalho de grupo e desenvolvimento artístico a crianças e jovens.", meta: "Educação · Coros · Novas gerações" },
  maos: { title: "De Mãos Dadas", body: "A música como instrumento de inclusão, proximidade e cuidado, criando pontes entre pessoas e comunidades.", meta: "Inclusão · Impacto social" },
  frater: { title: "VoxFrater", body: "Projeto centrado na fraternidade, na partilha e na construção de comunidade através da voz.", meta: "Fraternidade · Comunidade" },
  bolsas: { title: "Bolsas e mérito", body: "Quadro de Mérito, Bolsa17 e outras formas de reconhecer dedicação, apoiar talento e abrir oportunidades de participação.", meta: "Quadro de Mérito · Bolsa17" },
  surpresa: { title: "Encontros Surpresa", body: "Intervenções e encontros inesperados que aproximam pessoas e lugares através da música.", meta: "Música · Descoberta · Comunidade" },
  casamentos: { title: "Casamentos e baptizados", body: "Música vocal e instrumental preparada para cada cerimónia, do repertório à formação artística mais adequada.", meta: "Cerimónias · Música personalizada" },
  cerimonias: { title: "Missas e cerimónias", body: "Acompanhamento musical para missas, incluindo celebrações de 7.º e 30.º dia, e outros momentos de homenagem.", meta: "Música litúrgica · Homenagens" },
  empresas: { title: "Empresas e team building", body: "Experiências de voz e canto coletivo desenhadas para equipas, eventos institucionais e desenvolvimento humano.", meta: "Empresas · Equipas · Voz" },
  producao: { title: "Som, luz e produção", body: "Apoio técnico e artístico para eventos privados, concertos e projetos especiais.", meta: "Eventos · Som · Luz" },
  instrumentos: { title: "Aprender um instrumento", body: "Percursos de aprendizagem musical, incluindo piano, violino, guitarra e outras possibilidades mediante disponibilidade.", meta: "Formação musical" },
  mentoria: { title: "Mentoria e direção artística", body: "Acompanhamento de projetos, intérpretes, maestros e organizações na criação de uma visão musical e artística.", meta: "Mentoria · Direção artística" }
};

const modal = document.querySelector(".detail-modal");
const modalContent = document.querySelector(".modal-content");
document.querySelectorAll(".panel-open, .event-card, .project-card, .services-list button").forEach((button) => {
  button.addEventListener("click", () => {
    const data = details[button.dataset.detail];
    if (!data) return;
    const eventPage = button.classList.contains("event-card") ? `eventos/#${button.dataset.detail}` : "#inscricao";
    modalContent.innerHTML = `<p class="overline">${data.meta}</p><h2>${data.title}</h2><p>${data.body}</p><a class="pill primary modal-action" href="${eventPage}">${button.classList.contains("event-card") ? "Abrir informação do evento" : "Quero saber mais"}</a>`;
    modal.showModal();
    modalContent.querySelector(".modal-action").addEventListener("click", () => modal.close());
  });
});
document.querySelector(".modal-close").addEventListener("click", () => modal.close());
modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});

document.querySelectorAll(".index-list button").forEach((button) => {
  button.addEventListener("click", () => {
    const [description, meta] = button.dataset.info.split("|");
    modalContent.innerHTML = `<p class="overline">${meta}</p><h2>${button.querySelector("b").textContent}</h2><p>${description}</p><a class="pill primary" href="#participar">Falar com a VoxLaci</a>`;
    modal.showModal();
  });
});

const conciergeLauncher = document.querySelector(".concierge-launcher");
const concierge = document.querySelector(".concierge");
const conciergeClose = document.querySelector(".concierge-close");
const conciergeBody = document.querySelector(".concierge-body");
const conciergeForm = document.querySelector(".concierge-form");
const conciergeInput = document.querySelector("#concierge-input");
const conciergeMic = document.querySelector(".concierge-mic");
const conciergeStatus = document.querySelector(".concierge-status");

const copy = {
  pt: {
    welcome: "Perfeito. O que gostaria de descobrir?",
    placeholder: "Escreva ou fale…",
    options: [["Encontrar o meu novo grupo", "sing"], ["Coros para crianças e jovens", "child"], ["Palm Sunday Festival", "festival"], ["Contratar VoxLaci", "book"], ["Horários e localização", "location"], ["Falar com uma pessoa", "human"]],
    fallback: "Posso ajudar com ensembles, festival, inscrições, atuações, horários e contactos.",
    answers: {
      sing: ["Temos caminhos para crianças, jovens, adultos, vozes de câmara e ensembles profissionais. Diga-me a idade ou experiência para ajudar a escolher.", "#vozes", "Explorar ensembles"],
      child: ["Vox Pueri recebe crianças dos 4 aos 9/10 anos. Vox Soul recebe jovens dos 10 aos 18 anos.", "#vozes", "Ver os coros"],
      festival: ["O Ramos Palm Sunday Festival junta cantores, coros e maestros internacionais em masterclasses, ensaios e concertos.", "#festival", "Descobrir o festival"],
      book: ["Criamos música para casamentos, cerimónias, empresas, eventos privados e team building.", "#servicos", "Criar connosco"],
      location: ["Ensaiamos no Seminário Torre d'Águilha, em São Domingos de Rana, Cascais.", "#contactos", "Ver contactos"],
      human: ["Pode contactar info@voxlaci.com ou ligar para (+351) 925 075 186.", "mailto:info@voxlaci.com", "Enviar email"]
    }
  },
  en: {
    welcome: "Perfect. What would you like to discover?",
    placeholder: "Type or speak…",
    options: [["Find my new group", "sing"], ["Choirs for children and teens", "child"], ["Palm Sunday Festival", "festival"], ["Book VoxLaci", "book"], ["Schedule and location", "location"], ["Talk to a person", "human"]],
    fallback: "I can help with ensembles, the festival, registration, performances, schedules and contact information.",
    answers: {
      sing: ["We have paths for children, teenagers, adults, chamber voices and professional ensembles. Tell me an age or experience level.", "#vozes", "Explore ensembles"],
      child: ["Vox Pueri welcomes ages 4–9/10. Vox Soul welcomes ages 10–18.", "#vozes", "View choirs"],
      festival: ["Ramos Palm Sunday Festival brings international singers, choirs and conductors together for masterclasses, rehearsals and concerts.", "#festival", "Discover the festival"],
      book: ["We create music for weddings, ceremonies, companies, private events and team building.", "#servicos", "Create with us"],
      location: ["We rehearse at Seminário Torre d'Águilha in São Domingos de Rana, Cascais.", "#contactos", "View contact"],
      human: ["Contact info@voxlaci.com or call (+351) 925 075 186.", "mailto:info@voxlaci.com", "Send email"]
    }
  },
  it: {
    welcome: "Perfetto. Cosa vorrebbe scoprire?",
    placeholder: "Scriva o parli…",
    options: [["Trova il mio coro", "sing"], ["Cori per bambini e giovani", "child"], ["Palm Sunday Festival", "festival"], ["Ingaggiare VoxLaci", "book"], ["Orari e luogo", "location"], ["Parlare con una persona", "human"]],
    fallback: "Posso aiutare con ensemble, festival, iscrizioni, esibizioni, orari e contatti.",
    answers: {
      sing: ["Abbiamo percorsi per bambini, giovani, adulti, cori da camera ed ensemble professionali.", "#vozes", "Esplora gli ensemble"],
      child: ["Vox Pueri accoglie bambini dai 4 ai 9/10 anni. Vox Soul accoglie giovani dai 10 ai 18 anni.", "#vozes", "Vedi i cori"],
      festival: ["Il Ramos Palm Sunday Festival riunisce cantanti, cori e direttori internazionali.", "#festival", "Scopri il festival"],
      book: ["Creiamo musica per matrimoni, cerimonie, aziende ed eventi privati.", "#servicos", "Crea con noi"],
      location: ["Proviamo al Seminário Torre d'Águilha, a Cascais.", "#contactos", "Vedi i contatti"],
      human: ["Contatti info@voxlaci.com o chiami (+351) 925 075 186.", "mailto:info@voxlaci.com", "Invia email"]
    }
  },
  es: {
    welcome: "Perfecto. ¿Qué le gustaría descubrir?",
    placeholder: "Escriba o hable…",
    options: [["Encontrar mi coro", "sing"], ["Coros infantiles y juveniles", "child"], ["Palm Sunday Festival", "festival"], ["Contratar VoxLaci", "book"], ["Horarios y ubicación", "location"], ["Hablar con una persona", "human"]],
    fallback: "Puedo ayudar con ensembles, festival, inscripciones, actuaciones, horarios y contactos.",
    answers: {
      sing: ["Tenemos opciones para niños, jóvenes, adultos y ensembles profesionales.", "#vozes", "Explorar ensembles"],
      child: ["Vox Pueri recibe niños de 4 a 9/10 años. Vox Soul recibe jóvenes de 10 a 18 años.", "#vozes", "Ver los coros"],
      festival: ["Ramos Palm Sunday Festival reúne cantantes, coros y directores internacionales.", "#festival", "Descubrir el festival"],
      book: ["Creamos música para bodas, ceremonias, empresas y eventos privados.", "#servicos", "Crear con nosotros"],
      location: ["Ensayamos en el Seminário Torre d'Águilha, Cascais.", "#contactos", "Ver contactos"],
      human: ["Contacte info@voxlaci.com o llame al (+351) 925 075 186.", "mailto:info@voxlaci.com", "Enviar email"]
    }
  },
  fr: {
    welcome: "Parfait. Que souhaitez-vous découvrir ?",
    placeholder: "Écrivez ou parlez…",
    options: [["Trouver mon chœur", "sing"], ["Chœurs enfants et jeunes", "child"], ["Palm Sunday Festival", "festival"], ["Engager VoxLaci", "book"], ["Horaires et lieu", "location"], ["Parler à une personne", "human"]],
    fallback: "Je peux aider avec les ensembles, le festival, les inscriptions, les concerts et les contacts.",
    answers: {
      sing: ["Nous avons des parcours pour enfants, jeunes, adultes et ensembles professionnels.", "#vozes", "Explorer les ensembles"],
      child: ["Vox Pueri accueille les 4–9/10 ans. Vox Soul accueille les 10–18 ans.", "#vozes", "Voir les chœurs"],
      festival: ["Le Ramos Palm Sunday Festival réunit chanteurs, chœurs et chefs internationaux.", "#festival", "Découvrir le festival"],
      book: ["Nous créons de la musique pour mariages, cérémonies et événements privés.", "#servicos", "Créer avec nous"],
      location: ["Nous répétons au Seminário Torre d'Águilha, à Cascais.", "#contactos", "Voir les contacts"],
      human: ["Contactez info@voxlaci.com ou appelez le (+351) 925 075 186.", "mailto:info@voxlaci.com", "Envoyer un email"]
    }
  },
  de: {
    welcome: "Perfekt. Was möchten Sie entdecken?",
    placeholder: "Schreiben oder sprechen…",
    options: [["Meinen Chor finden", "sing"], ["Kinder- und Jugendchöre", "child"], ["Palm Sunday Festival", "festival"], ["VoxLaci buchen", "book"], ["Zeiten und Ort", "location"], ["Mit einer Person sprechen", "human"]],
    fallback: "Ich helfe bei Ensembles, Festival, Anmeldung, Auftritten und Kontakten.",
    answers: {
      sing: ["Wir bieten Ensembles für Kinder, Jugendliche, Erwachsene und professionelle Sänger.", "#vozes", "Ensembles ansehen"],
      child: ["Vox Pueri ist für 4–9/10 Jahre, Vox Soul für 10–18 Jahre.", "#vozes", "Chöre ansehen"],
      festival: ["Das Ramos Palm Sunday Festival bringt internationale Sänger, Chöre und Dirigenten zusammen.", "#festival", "Festival entdecken"],
      book: ["Wir gestalten Musik für Hochzeiten, Zeremonien und private Veranstaltungen.", "#servicos", "Mit uns gestalten"],
      location: ["Wir proben im Seminário Torre d'Águilha in Cascais.", "#contactos", "Kontakte ansehen"],
      human: ["Kontakt: info@voxlaci.com oder (+351) 925 075 186.", "mailto:info@voxlaci.com", "E-Mail senden"]
    }
  }
};

function getCopy() { return copy[chatLanguage] || copy.en; }
function openConcierge() {
  concierge.classList.add("open");
  concierge.setAttribute("aria-hidden", "false");
  conciergeLauncher.classList.add("hidden");
  setTimeout(() => conciergeInput.focus(), 200);
}
function closeConcierge() {
  concierge.classList.remove("open");
  concierge.setAttribute("aria-hidden", "true");
  conciergeLauncher.classList.remove("hidden");
}
document.querySelectorAll(".open-concierge").forEach((button) => button.addEventListener("click", openConcierge));
conciergeLauncher.addEventListener("click", openConcierge);
conciergeClose.addEventListener("click", closeConcierge);

function addMessage(text, role = "assistant") {
  const item = document.createElement("div");
  item.className = `concierge-message ${role}`;
  item.innerHTML = `<p>${text}</p>`;
  conciergeBody.appendChild(item);
  conciergeBody.scrollTop = conciergeBody.scrollHeight;
  return item;
}
function addOptions(options) {
  const box = document.createElement("div");
  box.className = "concierge-options";
  options.forEach(([label, intent]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.dataset.intent = intent;
    box.appendChild(button);
  });
  conciergeBody.appendChild(box);
}
function speak(text) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const voice = new SpeechSynthesisUtterance(text);
  const speechLanguages = { pt: "pt-PT", en: "en-GB", es: "es-ES", fr: "fr-FR", it: "it-IT", de: "de-DE" };
  voice.lang = speechLanguages[chatLanguage] || "en-GB";
  voice.rate = .95;
  speechSynthesis.speak(voice);
}
function answer(intent) {
  const answerData = getCopy().answers[intent] || copy.en.answers[intent];
  if (!answerData) {
    addMessage(getCopy().fallback);
    addOptions(getCopy().options);
    return;
  }
  const message = addMessage(answerData[0]);
  speak(answerData[0]);
  const link = document.createElement("a");
  link.className = "concierge-result-link";
  link.href = answerData[1];
  link.textContent = `${answerData[2]} →`;
  if (answerData[1].startsWith("#")) link.addEventListener("click", closeConcierge);
  message.appendChild(link);
}
function intentFrom(text) {
  const value = text.toLowerCase();
  if (/ramos|palm|festival/.test(value)) return "festival";
  if (/crian|child|young|jov|teen|idade|age|bambin|ragazz|enfant|jugend|niñ/.test(value)) return "child";
  if (/casament|wedding|event|evento|empresa|team|matrimoni|mariage|hochzeit|boda/.test(value)) return "book";
  if (/onde|where|hor|schedule|local|map|orari|dove|horaire|lieu|zeit|ort|ubicaci/.test(value)) return "location";
  if (/pessoa|person|persona|email|contact|telefone|phone|téléphone|telefon/.test(value)) return "human";
  if (/cant|sing|coro|choir|ensemble|voz|voice|voce|stimme|chœur/.test(value)) return "sing";
  return "";
}

conciergeBody.addEventListener("click", (event) => {
  const lang = event.target.closest("[data-chat-language]");
  if (lang) {
    chatLanguage = Object.hasOwn(copy, lang.dataset.chatLanguage) ? lang.dataset.chatLanguage : "en";
    addMessage(lang.textContent, "user");
    addMessage(getCopy().welcome);
    addOptions(getCopy().options);
    conciergeInput.placeholder = getCopy().placeholder;
    lang.parentElement.remove();
    return;
  }
  const option = event.target.closest("[data-intent]");
  if (option) {
    addMessage(option.textContent, "user");
    option.parentElement.remove();
    answer(option.dataset.intent);
  }
});

conciergeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = conciergeInput.value.trim();
  if (!text) return;
  addMessage(text, "user");
  conciergeInput.value = "";
  const intent = intentFrom(text);
  if (intent) answer(intent);
  else {
    addMessage(getCopy().fallback);
    addOptions(getCopy().options);
  }
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.onstart = () => {
    conciergeMic.classList.add("listening");
    conciergeStatus.textContent = chatLanguage === "pt" ? "Estou a ouvir… fale agora." : "Listening… speak now.";
  };
  recognition.onend = () => conciergeMic.classList.remove("listening");
  recognition.onresult = (event) => {
    conciergeInput.value = event.results[0][0].transcript;
    conciergeStatus.textContent = chatLanguage === "pt" ? "Pergunta reconhecida." : "Question recognised.";
    conciergeForm.requestSubmit();
  };
  recognition.onerror = (event) => {
    conciergeMic.classList.remove("listening");
    const messages = {
      "not-allowed": "O microfone está bloqueado. Nas definições do browser, autorize o microfone para este site.",
      "service-not-allowed": "O serviço de voz está bloqueado neste browser.",
      "no-speech": "Não ouvi nenhuma voz. Aproxime-se do microfone e tente novamente.",
      "audio-capture": "Não encontrei um microfone disponível."
    };
    conciergeStatus.textContent = messages[event.error] || "Não foi possível usar o microfone. Pode escrever a pergunta.";
  };
  conciergeMic.addEventListener("click", async () => {
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      }
      const recognitionLanguages = { pt: "pt-PT", en: "en-GB", es: "es-ES", fr: "fr-FR", it: "it-IT", de: "de-DE" };
      recognition.lang = recognitionLanguages[chatLanguage] || "en-GB";
      recognition.start();
    } catch {
      conciergeStatus.textContent = "Autorize o microfone nas definições do browser e tente novamente.";
    }
  });
} else {
  conciergeMic.disabled = true;
  conciergeStatus.textContent = "Este browser não suporta reconhecimento de voz. Use Chrome ou Safari atualizado, ou escreva a pergunta.";
}

const instagramLatest = document.querySelector(".instagram-latest");
if (instagramLatest) {
  fetch("/instagram-latest").then((response) => response.json()).catch(() => (
    fetch("/.netlify/functions/instagram-latest").then((response) => response.json())
  )).then((post) => {
    if (!post.image) throw new Error("Instagram not configured");
    instagramLatest.href = post.url;
    instagramLatest.querySelector("img").src = post.image;
    instagramLatest.querySelector("p").textContent = post.caption;
  }).catch(() => fetch("/social-feed.json").then((response) => response.json()).then((feed) => {
      instagramLatest.href = feed.instagram.url;
      instagramLatest.querySelector("img").src = feed.instagram.image;
      instagramLatest.querySelector("p").textContent = feed.instagram.caption;
    }).catch(() => {}));
}

const youtubeLatest = document.querySelector(".youtube-latest");
if (youtubeLatest) {
  fetch("/youtube-latest").then((response) => response.json()).catch(() => (
    fetch("/.netlify/functions/youtube-latest").then((response) => response.json())
  )).then((video) => {
    if (!video.videoId) throw new Error("YouTube feed unavailable");
    youtubeLatest.href = video.url;
    youtubeLatest.querySelector("img").src = video.thumbnail;
    youtubeLatest.querySelector("p").textContent = video.title;
  }).catch(() => {});
}

const heroPortal = document.querySelector(".hero-portal");
const heroTitle = document.querySelector(".hero-title");
let artFrame = 0;
function moveHeroArt() {
  artFrame = 0;
  const progress = Math.min(scrollY / innerHeight, 1);
  if (heroPortal) heroPortal.style.transform = innerWidth > 600
    ? `translateX(-50%) translateY(${progress * 55}px) scale(${1 - progress * .06})`
    : `translateY(${progress * 28}px)`;
  if (heroTitle) heroTitle.style.transform = `translateY(${-progress * 45}px)`;
}
window.addEventListener("scroll", () => {
  if (!artFrame) artFrame = requestAnimationFrame(moveHeroArt);
}, { passive: true });

document.querySelectorAll(".art-frame").forEach((frame) => {
  frame.addEventListener("pointermove", (event) => {
    if (matchMedia("(pointer: coarse)").matches) return;
    const rect = frame.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    frame.querySelector("img").style.transform = `scale(1.04) translate(${x * -12}px,${y * -12}px)`;
  });
  frame.addEventListener("pointerleave", () => frame.querySelector("img").style.transform = "");
});

const clipModal = document.querySelector(".clip-modal");
const clipFrame = clipModal.querySelector("iframe");
const clipTitle = clipModal.querySelector("h2");
const clipClose = clipModal.querySelector(".clip-close");
let clipTimer;

function closeClip() {
  clearTimeout(clipTimer);
  clipFrame.src = "";
  if (clipModal.open) clipModal.close();
}

document.querySelectorAll(".clip-play").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const start = Number(button.dataset.start || 0);
    const end = start + 10;
    clipTitle.textContent = button.dataset.title;
    clipFrame.src = `https://www.youtube-nocookie.com/embed/${button.dataset.video}?start=${start}&end=${end}&autoplay=1&rel=0&modestbranding=1`;
    clipModal.showModal();
    clipTimer = setTimeout(closeClip, 10500);
  });
});
clipClose.addEventListener("click", closeClip);
clipModal.addEventListener("click", (event) => {
  if (event.target === clipModal) closeClip();
});

desktopNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  desktopNav.classList.remove("mobile-open");
  menuButton.setAttribute("aria-expanded", "false");
}));

const voiceTestButton = document.querySelector(".voice-test-start");
const voiceMeter = document.querySelector(".voice-meter span");
const voiceNote = document.querySelector(".voice-note");
const voiceInstruction = document.querySelector(".voice-instruction");
const voiceResult = document.querySelector(".voice-result");
const voiceCanvas = document.querySelector(".voice-canvas");
const voiceCanvasContext = voiceCanvas?.getContext("2d");
const voiceSteps = document.querySelectorAll("[data-voice-step]");
let voiceMode = "speak";
let voiceBusy = false;

function targetHeight(progress) {
  return .5 + Math.sin(progress * Math.PI * 3) * .25;
}

function drawVoicePath(points = [], target = false, cursor = -1) {
  if (!voiceCanvasContext || !voiceCanvas) return;
  const { width, height } = voiceCanvas;
  voiceCanvasContext.clearRect(0, 0, width, height);
  voiceCanvasContext.strokeStyle = "rgba(255,255,255,.12)";
  voiceCanvasContext.lineWidth = 1;
  for (let y = 35; y < height; y += 45) {
    voiceCanvasContext.beginPath();
    voiceCanvasContext.moveTo(0, y);
    voiceCanvasContext.lineTo(width, y);
    voiceCanvasContext.stroke();
  }
  if (target) {
    voiceCanvasContext.strokeStyle = "rgba(255,255,255,.28)";
    voiceCanvasContext.setLineDash([12, 12]);
    voiceCanvasContext.lineWidth = 5;
    voiceCanvasContext.beginPath();
    for (let x = 0; x <= width; x += 8) {
      const y = height * targetHeight(x / width);
      if (x === 0) voiceCanvasContext.moveTo(x, y); else voiceCanvasContext.lineTo(x, y);
    }
    voiceCanvasContext.stroke();
    voiceCanvasContext.setLineDash([]);
  }
  if (points.length) {
    voiceCanvasContext.strokeStyle = "#ded5c2";
    voiceCanvasContext.shadowColor = "#9a8761";
    voiceCanvasContext.shadowBlur = 14;
    voiceCanvasContext.lineWidth = 6;
    voiceCanvasContext.beginPath();
    points.forEach((point, index) => {
      const x = index / Math.max(points.length - 1, 1) * width;
      const y = height - Math.max(15, Math.min(height - 15, point));
      if (!index) voiceCanvasContext.moveTo(x, y); else voiceCanvasContext.lineTo(x, y);
    });
    voiceCanvasContext.stroke();
    voiceCanvasContext.shadowBlur = 0;
  }
  if (cursor >= 0) {
    voiceCanvasContext.fillStyle = "#fff";
    voiceCanvasContext.beginPath();
    voiceCanvasContext.arc(cursor * width, height * targetHeight(cursor), 9, 0, Math.PI * 2);
    voiceCanvasContext.fill();
  }
}
drawVoicePath();

function detectPitch(buffer, sampleRate) {
  let rms = 0;
  for (const value of buffer) rms += value * value;
  rms = Math.sqrt(rms / buffer.length);
  if (rms < .015) return -1;
  let bestOffset = -1;
  let bestCorrelation = 0;
  const minOffset = Math.floor(sampleRate / 900);
  const maxOffset = Math.floor(sampleRate / 70);
  for (let offset = minOffset; offset <= maxOffset; offset += 1) {
    let correlation = 0;
    for (let i = 0; i < buffer.length - offset; i += 1) {
      correlation += buffer[i] * buffer[i + offset];
    }
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }
  }
  return bestOffset > 0 ? sampleRate / bestOffset : -1;
}

function noteFromFrequency(frequency) {
  const names = ["Dó", "Dó♯", "Ré", "Ré♯", "Mi", "Fá", "Fá♯", "Sol", "Sol♯", "Lá", "Lá♯", "Si"];
  const midi = Math.round(69 + 12 * Math.log2(frequency / 440));
  return `${names[(midi + 120) % 12]}${Math.floor(midi / 12) - 1}`;
}

const voiceModeCopy = {
  speak: {
    instruction: ["Etapa 1: diga o seu nome e uma frase durante quatro segundos. Vamos desenhar a energia da sua fala.", "Step 1: say your name and a sentence for four seconds. We will draw the energy of your speech."],
    button: ["Começar a falar", "Start speaking"]
  },
  sing: {
    instruction: ["Etapa 2: cante uma vogal «A» confortável e deslize suavemente do grave para o agudo.", "Step 2: sing a comfortable “Ah” and gently glide from low to high."],
    button: ["Começar a cantar", "Start singing"]
  },
  follow: {
    instruction: ["Etapa 3: acompanhe a linha pontilhada. Faça a voz subir quando a montanha sobe e descer quando ela desce.", "Step 3: follow the dotted line. Raise your voice as the mountain rises and lower it as it falls."],
    button: ["Seguir a montanha", "Follow the mountain"]
  }
};

function setVoiceMode(mode) {
  if (voiceBusy) return;
  voiceMode = mode;
  voiceSteps.forEach((step) => step.classList.toggle("active", step.dataset.voiceStep === mode));
  const copyIndex = language === "pt" ? 0 : 1;
  voiceInstruction.textContent = voiceModeCopy[mode].instruction[copyIndex];
  voiceTestButton.textContent = voiceModeCopy[mode].button[copyIndex];
  voiceNote.textContent = mode === "speak" ? "voz" : "—";
  voiceResult.hidden = true;
  drawVoicePath([], mode === "follow");
}

voiceSteps.forEach((step) => step.addEventListener("click", () => setVoiceMode(step.dataset.voiceStep)));

async function openVoiceInput() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = context.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = .65;
  context.createMediaStreamSource(stream).connect(analyser);
  return { stream, context, analyser, samples: new Float32Array(analyser.fftSize) };
}

function closeVoiceInput(input) {
  input.stream.getTracks().forEach((track) => track.stop());
  input.context.close();
}

async function runSpeakTest() {
  const input = await openVoiceInput();
  const drawing = [];
  const started = performance.now();
  voiceInstruction.textContent = language === "pt" ? "Estou a ouvir… fale naturalmente." : "Listening… speak naturally.";
  return new Promise((resolve) => {
    const listen = () => {
      input.analyser.getFloatTimeDomainData(input.samples);
      let rms = 0;
      input.samples.forEach((sample) => { rms += sample * sample; });
      rms = Math.sqrt(rms / input.samples.length);
      drawing.push(Math.min(1, rms * 9) * voiceCanvas.height * .82 + 15);
      drawVoicePath(drawing.slice(-180));
      voiceMeter.style.left = `${Math.min(100, rms * 700)}%`;
      if (performance.now() - started < 4000) return requestAnimationFrame(listen);
      closeVoiceInput(input);
      const variation = Math.max(...drawing) - Math.min(...drawing);
      voiceResult.innerHTML = `<h3>${language === "pt" ? "A sua fala tem forma" : "Your speech has shape"}</h3><p>${language === "pt" ? (variation > 75 ? "A sua fala mostrou energia e variedade. A voz já transforma intenção em expressão antes mesmo de cantar." : "A sua fala mostrou uma linha serena. Experimente projetar um pouco mais e deixe a frase ganhar diferentes alturas.") : "Your speaking voice created a visible musical shape. Voice transforms intention into expression even before singing."}</p>`;
      voiceResult.hidden = false;
      resolve();
    };
    listen();
  });
}

async function runSingTest(follow = false) {
  const input = await openVoiceInput();
  const frequencies = [];
  const drawing = [];
  const started = performance.now();
  const duration = follow ? 8000 : 6000;
  let closeness = 0;
  let comparisons = 0;
  voiceInstruction.textContent = language === "pt" ? (follow ? "A montanha começou — acompanhe-a com a voz." : "Estou a ouvir… cante sem forçar.") : (follow ? "The mountain has started — follow it with your voice." : "Listening… sing without forcing.");
  return new Promise((resolve) => {
    const listen = () => {
      input.analyser.getFloatTimeDomainData(input.samples);
      const pitch = detectPitch(input.samples, input.context.sampleRate);
      const progress = Math.min(1, (performance.now() - started) / duration);
      if (pitch > 70 && pitch < 900) {
        frequencies.push(pitch);
        const normal = Math.max(0, Math.min(1, Math.log2(pitch / 70) / Math.log2(900 / 70)));
        drawing.push(normal * voiceCanvas.height);
        voiceNote.textContent = noteFromFrequency(pitch);
        voiceMeter.style.left = `${normal * 100}%`;
        if (follow) {
          const target = 1 - targetHeight(progress);
          closeness += Math.max(0, 1 - Math.abs(normal - target) * 2.5);
          comparisons += 1;
        }
      } else if (follow) drawing.push(voiceCanvas.height * .5);
      drawVoicePath(drawing.slice(-180), follow, follow ? progress : -1);
      if (performance.now() - started < duration) return requestAnimationFrame(listen);
      closeVoiceInput(input);
      if (frequencies.length < 8) {
        voiceInstruction.textContent = language === "pt" ? "Não ouvi uma nota estável. Aproxime-se do microfone e tente novamente." : "I could not hear a stable note. Move closer to the microphone and try again.";
        return resolve();
      }
      if (follow) {
        const match = comparisons ? closeness / comparisons : 0;
        voiceResult.innerHTML = `<h3>${language === "pt" ? "Conseguiu transformar a linha" : "You transformed the line"}</h3><p>${language === "pt" ? (match > .58 ? "A sua voz acompanhou bem as mudanças de direção. Tem escuta e capacidade para adaptar a altura enquanto canta." : "Conseguiu seguir partes da montanha. Repita sem procurar perfeição: escutar, ajustar e tentar novamente é exatamente como se aprende num coro.") : "You followed the changing direction with your voice. Listening, adjusting and trying again is exactly how ensemble singing grows."}</p><a class="concierge-result-link" href="#inscricao">${language === "pt" ? "Transformar esta experiência num casting" : "Turn this experience into a casting"} →</a>`;
      } else {
        frequencies.sort((a, b) => a - b);
        const middle = frequencies[Math.floor(frequencies.length / 2)];
        const zone = middle < 165 ? "grave" : middle < 260 ? "média" : "aguda";
        const suggestions = {
          grave: "A sua voz mostrou conforto numa zona mais grave. Num coro, essa cor pode transformar a base e a profundidade do som.",
          média: "A sua voz mostrou conforto numa zona média e versátil, uma excelente região para descobrir diferentes linhas de coro.",
          aguda: "A sua voz mostrou conforto numa zona mais aguda, capaz de trazer brilho e direção ao som coletivo."
        };
        voiceResult.innerHTML = `<h3>${language === "pt" ? `Zona ${zone}` : "Your comfortable zone"}</h3><p>${language === "pt" ? suggestions[zone] : "Your voice revealed a comfortable singing region. This is an invitation to explore, not a vocal classification."}</p>`;
      }
      voiceResult.hidden = false;
      resolve();
    };
    listen();
  });
}

if (voiceTestButton) voiceTestButton.addEventListener("click", async () => {
  try {
    if (voiceBusy) return;
    voiceBusy = true;
    voiceTestButton.disabled = true;
    voiceResult.hidden = true;
    if (voiceMode === "speak") await runSpeakTest();
    if (voiceMode === "sing") await runSingTest(false);
    if (voiceMode === "follow") await runSingTest(true);
  } catch {
    voiceInstruction.textContent = language === "pt" ? "Não foi possível usar o microfone. Autorize-o nas definições do browser e tente novamente." : "The microphone could not be used. Allow access in your browser settings and try again.";
  } finally {
    voiceBusy = false;
    voiceTestButton.disabled = false;
  }
});
