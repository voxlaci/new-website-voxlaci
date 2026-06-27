const topbar = document.querySelector(".topbar");
const menuButton = document.querySelector(".menu-toggle");
const desktopNav = document.querySelector(".desktop-nav");
const languageButton = document.querySelector(".lang-toggle");
const supportedLanguages = ["pt", "en", "es", "fr", "it", "zh"];
const pathLanguage = location.pathname.split("/").filter(Boolean)[0];
let language = supportedLanguages.includes(pathLanguage) ? pathLanguage : (supportedLanguages.includes(document.documentElement.lang) ? document.documentElement.lang : "pt");
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

const languageMeta = {
  pt: {
    title: "VoxLaci | Coros, grupos vocais e canto em Cascais e Lisboa",
    description: "VoxLaci é uma comunidade coral em Cascais e Grande Lisboa. Coros e grupos vocais para crianças, jovens e adultos, eventos, festivais, inscrições e serviços musicais."
  },
  en: {
    title: "VoxLaci | Choirs, vocal groups and singing in Cascais and Lisbon",
    description: "VoxLaci is a choral community in Cascais and Greater Lisbon, with choirs and vocal groups for children, teenagers and adults."
  },
  es: {
    title: "VoxLaci | Coros, grupos vocales y canto en Cascais y Lisboa",
    description: "VoxLaci es una comunidad coral en Cascais y Gran Lisboa, con coros y grupos vocales para niños, jóvenes y adultos."
  },
  fr: {
    title: "VoxLaci | Chœurs, ensembles vocaux et chant à Cascais et Lisbonne",
    description: "VoxLaci est une communauté chorale à Cascais et dans le Grand Lisbonne, avec des chœurs et groupes vocaux pour enfants, jeunes et adultes."
  },
  it: {
    title: "VoxLaci | Cori, gruppi vocali e canto a Cascais e Lisbona",
    description: "VoxLaci è una comunità corale a Cascais e nella Grande Lisbona, con cori e gruppi vocali per bambini, giovani e adulti."
  },
  zh: {
    title: "VoxLaci | 卡斯凯什与里斯本的合唱团与声乐团体",
    description: "VoxLaci是葡萄牙卡斯凯什大里斯本地区的合唱社区，为儿童、青少年和成人提供合唱团和声乐团体。"
  }
};

const uiTranslations = {
  es: {
    "Casting / Inscrições": "Casting / Inscripciones",
    "Projetos": "Proyectos",
    "Serviços": "Servicios",
    "Eventos": "Eventos",
    "Fazer casting": "Hacer casting",
    "Cascais · Desde 1996": "Cascais · Desde 1996",
    "A voz<br>é um lugar.": "La voz<br>es un lugar.",
    "Entre. Escute. Encontre a sua.": "Entre. Escuche. Encuentre la suya.",
    "OUVIR A VOXLACI · OUVIR A VOXLACI · ": "ESCUCHAR VOXLACI · ESCUCHAR VOXLACI · ",
    "anos a transformar<br>respiração em pertença": "años transformando<br>respiración en pertenencia",
    "Começar a experiência": "Comenzar la experiencia",
    "A nossa razão": "Nuestra razón",
    "Mais do que unirmos vozes.<br><em>Transformamos mundos.</em>": "Más que unir voces.<br><em>Transformamos mundos.</em>",
    "Crianças, jovens, adultos, famílias, maestros e públicos. Há trinta anos que criamos ligações através da voz.": "Niños, jóvenes, adultos, familias, directores y públicos. Desde hace treinta años creamos vínculos a través de la voz.",
    "anos de história": "años de historia",
    "ensembles e caminhos": "ensembles y caminos",
    "anos. Todas as idades.": "años. Todas las edades.",
    "Ainda não sabe qual é o grupo certo? Nós ajudamos a encontrar.": "¿Todavía no sabe cuál es el grupo adecuado? Le ayudamos a encontrarlo.",
    "Fazer casting online →": "Hacer casting online →",
    "Encontre a sua voz": "Encuentre su voz",
    "Não há um só caminho para cantar.": "No hay un único camino para cantar.",
    "Escolha uma fase da vida ou siga a curiosidade.": "Elija una etapa de la vida o siga la curiosidad.",
    "Ouvir 10 segundos": "Escuchar 10 segundos",
    "Todos os ensembles": "Todos los ensembles",
    "Eventos VoxLaci": "Eventos VoxLaci",
    "Cada evento<br>abre um mundo.": "Cada evento<br>abre un mundo.",
    "Crie connosco": "Cree con nosotros",
    "A sua ideia.<br>A nossa voz.": "Su idea.<br>Nuestra voz.",
    "Digital Home para artistas <i>↗</i>": "Digital Home para artistas <i>↗</i>",
    "Experiência interativa": "Experiencia interactiva",
    "Onde vive<br>a sua voz?": "¿Dónde vive<br>su voz?",
    "Casting e inscrição online": "Casting e inscripción online",
    "A sua voz<br>começa aqui.": "Su voz<br>empieza aquí.",
    "Pagamentos 2026": "Pagos 2026",
    "Duas formas<br>de participar.": "Dos formas<br>de participar.",
    "A sua voz começa aqui": "Su voz empieza aquí",
    "Encontre o seu novo grupo.": "Encuentre su nuevo grupo.",
    "Encontrar o meu novo grupo": "Encontrar mi nuevo grupo",
    "A VoxLaci está viva": "VoxLaci está viva",
    "Veja. Receba.<br>Faça parte.": "Vea. Reciba.<br>Forme parte.",
    "Falar connosco": "Contactar",
    "Acompanhar": "Seguir"
  },
  fr: {
    "Casting / Inscrições": "Casting / Inscriptions",
    "Projetos": "Projets",
    "Serviços": "Services",
    "Eventos": "Événements",
    "Fazer casting": "Faire un casting",
    "Cascais · Desde 1996": "Cascais · Depuis 1996",
    "A voz<br>é um lugar.": "La voix<br>est un lieu.",
    "Entre. Escute. Encontre a sua.": "Entrez. Écoutez. Trouvez la vôtre.",
    "OUVIR A VOXLACI · OUVIR A VOXLACI · ": "ÉCOUTER VOXLACI · ÉCOUTER VOXLACI · ",
    "anos a transformar<br>respiração em pertença": "ans à transformer<br>le souffle en appartenance",
    "Começar a experiência": "Commencer l’expérience",
    "A nossa razão": "Notre raison d’être",
    "Mais do que unirmos vozes.<br><em>Transformamos mundos.</em>": "Plus que réunir des voix.<br><em>Nous transformons des mondes.</em>",
    "Crianças, jovens, adultos, famílias, maestros e públicos. Há trinta anos que criamos ligações através da voz.": "Enfants, jeunes, adultes, familles, chefs et publics. Depuis trente ans, nous créons des liens par la voix.",
    "anos de história": "ans d’histoire",
    "ensembles e caminhos": "ensembles et parcours",
    "anos. Todas as idades.": "ans. Tous les âges.",
    "Ainda não sabe qual é o grupo certo? Nós ajudamos a encontrar.": "Vous ne savez pas encore quel groupe choisir ? Nous vous aidons à le trouver.",
    "Fazer casting online →": "Faire un casting en ligne →",
    "Encontre a sua voz": "Trouvez votre voix",
    "Não há um só caminho para cantar.": "Il n’y a pas une seule façon de chanter.",
    "Escolha uma fase da vida ou siga a curiosidade.": "Choisissez une étape de la vie ou suivez votre curiosité.",
    "Ouvir 10 segundos": "Écouter 10 secondes",
    "Todos os ensembles": "Tous les ensembles",
    "Eventos VoxLaci": "Événements VoxLaci",
    "Cada evento<br>abre um mundo.": "Chaque événement<br>ouvre un monde.",
    "Crie connosco": "Créez avec nous",
    "A sua ideia.<br>A nossa voz.": "Votre idée.<br>Notre voix.",
    "Digital Home para artistas <i>↗</i>": "Digital Home pour artistes <i>↗</i>",
    "Experiência interativa": "Expérience interactive",
    "Onde vive<br>a sua voz?": "Où vit<br>votre voix ?",
    "Casting e inscrição online": "Casting et inscription en ligne",
    "A sua voz<br>começa aqui.": "Votre voix<br>commence ici.",
    "Pagamentos 2026": "Paiements 2026",
    "Duas formas<br>de participar.": "Deux façons<br>de participer.",
    "A sua voz começa aqui": "Votre voix commence ici",
    "Encontre o seu novo grupo.": "Trouvez votre nouveau groupe.",
    "Encontrar o meu novo grupo": "Trouver mon nouveau groupe",
    "A VoxLaci está viva": "VoxLaci est vivant",
    "Veja. Receba.<br>Faça parte.": "Regardez. Recevez.<br>Participez.",
    "Falar connosco": "Nous contacter",
    "Acompanhar": "Suivre"
  },
  it: {
    "Casting / Inscrições": "Casting / Iscrizioni",
    "Projetos": "Progetti",
    "Serviços": "Servizi",
    "Eventos": "Eventi",
    "Fazer casting": "Fare il casting",
    "Cascais · Desde 1996": "Cascais · Dal 1996",
    "A voz<br>é um lugar.": "La voce<br>è un luogo.",
    "Entre. Escute. Encontre a sua.": "Entra. Ascolta. Trova la tua.",
    "OUVIR A VOXLACI · OUVIR A VOXLACI · ": "ASCOLTA VOXLACI · ASCOLTA VOXLACI · ",
    "anos a transformar<br>respiração em pertença": "anni trasformando<br>il respiro in appartenenza",
    "Começar a experiência": "Iniziare l’esperienza",
    "A nossa razão": "La nostra ragione",
    "Mais do que unirmos vozes.<br><em>Transformamos mundos.</em>": "Più che unire voci.<br><em>Trasformiamo mondi.</em>",
    "Crianças, jovens, adultos, famílias, maestros e públicos. Há trinta anos que criamos ligações através da voz.": "Bambini, giovani, adulti, famiglie, direttori e pubblico. Da trent’anni creiamo legami attraverso la voce.",
    "anos de história": "anni di storia",
    "ensembles e caminhos": "ensemble e percorsi",
    "anos. Todas as idades.": "anni. Tutte le età.",
    "Ainda não sabe qual é o grupo certo? Nós ajudamos a encontrar.": "Non sai ancora qual è il gruppo giusto? Ti aiutiamo a trovarlo.",
    "Fazer casting online →": "Fare il casting online →",
    "Encontre a sua voz": "Trova la tua voce",
    "Não há um só caminho para cantar.": "Non esiste un solo modo di cantare.",
    "Escolha uma fase da vida ou siga a curiosidade.": "Scegli una fase della vita o segui la curiosità.",
    "Ouvir 10 segundos": "Ascolta 10 secondi",
    "Todos os ensembles": "Tutti gli ensemble",
    "Eventos VoxLaci": "Eventi VoxLaci",
    "Cada evento<br>abre um mundo.": "Ogni evento<br>apre un mondo.",
    "Crie connosco": "Crea con noi",
    "A sua ideia.<br>A nossa voz.": "La tua idea.<br>La nostra voce.",
    "Digital Home para artistas <i>↗</i>": "Digital Home per artisti <i>↗</i>",
    "Experiência interativa": "Esperienza interattiva",
    "Onde vive<br>a sua voz?": "Dove vive<br>la tua voce?",
    "Casting e inscrição online": "Casting e iscrizione online",
    "A sua voz<br>começa aqui.": "La tua voce<br>inizia qui.",
    "Pagamentos 2026": "Pagamenti 2026",
    "Duas formas<br>de participar.": "Due modi<br>per partecipare.",
    "A sua voz começa aqui": "La tua voce inizia qui",
    "Encontre o seu novo grupo.": "Trova il tuo nuovo gruppo.",
    "Encontrar o meu novo grupo": "Trovare il mio nuovo gruppo",
    "A VoxLaci está viva": "VoxLaci è viva",
    "Veja. Receba.<br>Faça parte.": "Guarda. Ricevi.<br>Partecipa.",
    "Falar connosco": "Contattaci",
    "Acompanhar": "Seguire"
  },
  zh: {
    "Casting / Inscrições": "试唱 / 报名",
    "Ensembles": "合唱团",
    "Projetos": "项目",
    "Serviços": "服务",
    "Eventos": "活动",
    "Fazer casting": "参加试唱",
    "Cascais · Desde 1996": "卡斯凯什 · 自1996年",
    "A voz<br>é um lugar.": "声音，<br>是一个地方。",
    "Entre. Escute. Encontre a sua.": "走进来。聆听。找到属于你的声音。",
    "OUVIR A VOXLACI · OUVIR A VOXLACI · ": "聆听 VOXLACI · 聆听 VOXLACI · ",
    "anos a transformar<br>respiração em pertença": "年，将呼吸<br>化为归属",
    "Começar a experiência": "开始体验",
    "A nossa razão": "我们的使命",
    "Mais do que unirmos vozes.<br><em>Transformamos mundos.</em>": "不只是汇聚声音。<br><em>我们改变世界。</em>",
    "Crianças, jovens, adultos, famílias, maestros e públicos. Há trinta anos que criamos ligações através da voz.": "儿童、青少年、成人、家庭、指挥与听众。三十年来，我们用声音建立联结。",
    "anos de história": "年历史",
    "ensembles e caminhos": "个合唱团",
    "anos. Todas as idades.": "岁。各个年龄。",
    "Ainda não sabe qual é o grupo certo? Nós ajudamos a encontrar.": "不确定哪个合唱团适合您？我们来帮您找到。",
    "Fazer casting online →": "在线试唱报名 →",
    "Uma voz começa no corpo.": "声音从身体开始。",
    "Antes de cantarmos, aprendemos a reconhecer a nossa própria voz.": "在歌唱之前，我们先学会认识自己的声音。",
    "Primeiro<br>escutamos.<br>Depois,<br>o mundo muda.": "首先<br>我们聆听。<br>然后，<br>世界改变。",
    "Escutar. Respirar. Construir juntos.": "聆听。呼吸。共同建造。",
    "Cada nota abre um caminho. Juntos, transformamo-lo em música.": "每个音符开启一条路。我们共同将它化为音乐。",
    "Encontre a sua voz": "找到你的声音",
    "Não há um só caminho para cantar.": "歌唱没有唯一的路。",
    "Escolha uma fase da vida ou siga a curiosidade.": "选择一个人生阶段，或跟随好奇心。",
    "A primeira aventura coral.": "第一次合唱探险。",
    "Segunda · 17h–17h50": "周一 · 17h–17h50",
    "Segunda · 12h–13h15": "周一 · 12h–13h15",
    "Identidade, palco e mundo.": "身份、舞台与世界。",
    "Segunda · 18h–19h15": "周一 · 18h–19h15",
    "Respirar. Reencontrar. Transformar.": "呼吸。重新相遇。转变。",
    "Segunda · 20h15–21h30": "周一 · 20h15–21h30",
    "Coro adulto. Voz, repertório e comunidade.": "成人合唱团。声音、曲目与社区。",
    "Cantar coletivo": "集体歌唱",
    "Cantar em grupo, criar ligações e fazer coro.": "集体歌唱，建立联结，组成合唱团。",
    "Ouvir 10 segundos": "聆听10秒",
    "Todos os ensembles": "全部合唱团",
    "Da comunidade ao repertório profissional.": "从社区合唱到专业曲目。",
    "De Cascais para o mundo": "从卡斯凯什走向世界",
    "Cantar é também viajar.": "歌唱也是一种旅行。",
    "Lisboa. Porto. Monopoli. Dakar. Londres. Cada encontro transforma o repertório numa experiência humana.": "里斯本。波尔图。莫诺波利。达卡。伦敦。每次相遇都将曲目化为人类的共同体验。",
    "Eventos VoxLaci": "VoxLaci 活动",
    "Cada evento<br>abre um mundo.": "每场活动<br>开启一个新世界。",
    "Festivais, concertos, encontros internacionais e experiências criadas pela comunidade VoxLaci.": "节日、音乐会、国际交流及VoxLaci社区创造的体验。",
    "Cantar a tradição e começar o ano em comunidade.": "用歌声传承传统，与社区共迎新年。",
    "Música, expressão artística, movimento e descoberta.": "音乐、艺术表达、律动与探索。",
    "Um encontro coral para celebrar o Dia de Reis.": "庆祝主显节的合唱聚会。",
    "Uma experiência musical guiada pela luz e pela voz.": "由光与声引导的音乐体验。",
    "Música como gesto de gratidão e encontro.": "音乐作为感恩与相聚的姿态。",
    "Criação coral, narrativa e espetáculo.": "合唱创作、叙事与演出。",
    "Dia Mundial da Música": "世界音乐日",
    "Celebrar a música como linguagem universal.": "庆祝音乐作为普世语言。",
    "Conhecer, cantar, aprender e partilhar.": "认识、歌唱、学习与分享。",
    "Vozes, cidades e culturas em movimento.": "声音、城市与文化的流动。",
    "Encontro e desenvolvimento para maestros.": "指挥的聚会与成长。",
    "Série musical": "音乐系列",
    "Um encontro regular com música, artistas e comunidade.": "与音乐、艺术家和社区的定期相聚。",
    "Gostaria de viver estes eventos por dentro?": "想从内部体验这些活动吗？",
    "Candidatar-me à comunidade →": "申请加入社区 →",
    "Uma voz.<br>Muitas cidades.": "一个声音。<br>许多城市。",
    "Três dias de música, pertença e descoberta. Participe com o seu coro, com amigos ou individualmente.": "三天的音乐、归属感与探索。携您的合唱团、朋友或个人参与。",
    "Conhecer o conceito voX±Pop →": "了解 voX±Pop 概念 →",
    "Um festival internacional. Uma semana. Muitas culturas, uma só obra.": "一个国际节日。一周。多种文化，一部作品。",
    "Maestros convidados, masterclasses, ensaios intensivos e concertos unem participantes de diferentes países na semana que antecede a Páscoa.": "受邀指挥、大师班、密集排练和音乐会在复活节前一周汇聚来自不同国家的参与者。",
    "Explorar as 19 edições e participar ↗": "探索19届并参与 ↗",
    "Muito além do palco": "远超舞台",
    "A voz como força social.": "声音作为社会力量。",
    "A sua voz também pode criar impacto.": "您的声音也可以创造影响。",
    "Começar o meu casting →": "开始我的试唱 →",
    "Crie connosco": "与我们共创",
    "A sua ideia.<br>A nossa voz.": "您的构想。<br>我们的声音。",
    "Casamentos, cerimónias, eventos privados, empresas, team building, som, luz e produção musical.": "婚礼、典礼、私人活动、企业、团队建设、音响、灯光和音乐制作。",
    "Digital Home para artistas <i>↗</i>": "艺术家数字主页 <i>↗</i>",
    "Web design e presença digital <i>↗</i>": "网页设计与数字形象 <i>↗</i>",
    "Maestro · Fundador · Diretor Artístico": "指挥 · 创始人 · 艺术总监",
    "Uma vida dedicada a criar comunidades através da música, da direção coral e de projetos que ligam pessoas, culturas e gerações.": "一生致力于通过音乐、合唱指挥和连接人、文化与世代的项目创建社区。",
    "Conhecer a direção artística →": "了解艺术总监 →",
    "Experiência interativa": "互动体验",
    "Onde vive<br>a sua voz?": "您的声音<br>住在哪里？",
    "Três experiências simples: veja o desenho da sua fala, descubra a zona confortável do seu canto e tente acompanhar uma montanha melódica com a voz.": "三个简单体验：看看您说话的图形，发现您舒适的歌唱音域，并尝试用声音跟随一座旋律山峰。",
    "É apenas uma experiência lúdica, não uma classificação vocal. Em crianças, a voz deve ser sempre acompanhada por um professor.": "这只是一个娱乐体验，不是声部分类。儿童的声音应始终在教师的指导下培养。",
    "1 · Falar": "1 · 说话",
    "2 · Cantar": "2 · 歌唱",
    "3 · Seguir": "3 · 跟随",
    "Etapa 1: diga o seu nome e uma frase durante quatro segundos. Vamos desenhar a energia da sua fala.": "第1步：说出您的名字和一句话，持续四秒钟。我们将绘制您说话的能量。",
    "Começar a falar": "开始说话",
    "Casting e inscrição online": "在线试唱与报名",
    "A sua voz<br>começa aqui.": "您的声音<br>从这里开始。",
    "Não precisa de saber qual é o seu tipo de voz nem qual é o grupo certo. Preencha o casting; a equipa VoxLaci ajudará a encontrar o caminho mais adequado.": "您不需要知道自己的声部或哪个合唱团适合您。填写试唱表格，VoxLaci团队将帮助您找到最合适的路径。",
    "Pagamento obrigatório da inscrição / audição — 20€": "必须缴纳报名/试唱费 — 20€",
    "A inscrição só fica completa após o pagamento. Indique sempre o nome da pessoa que se está a inscrever.": "报名只有在付款后才算完成。请始终注明报名者的姓名。",
    "Forma de pagamento": "付款方式",
    "Nome usado no pagamento": "付款时使用的姓名",
    "Comprovativo do pagamento de 20€ (fotografia ou PDF) *": "20€付款凭证（照片或PDF）*",
    "Visa, Mastercard, Apple Pay e Google Pay serão disponibilizados assim que a ligação de pagamento segura Stripe/Mollie estiver associada. Nunca introduza dados do cartão diretamente neste formulário.": "一旦安全支付链接Stripe/Mollie连接，将提供Visa、Mastercard、Apple Pay和Google Pay。请勿在此表格中直接输入卡片信息。",
    "Aceito que estes dados sejam usados para responder ao meu casting e receber a confirmação por email.": "我同意这些数据用于回复我的试唱申请并通过电子邮件接收确认。",
    "Enviar casting e receber confirmação →": "提交试唱并接收确认 →",
    "Pagamentos 2026": "2026年缴费",
    "Duas formas<br>de participar.": "两种<br>参与方式。",
    "Pagamento mensal": "月付",
    "/ mês · 10 meses": "/ 月 · 10个月",
    "Julho e agosto não são pagos. Jóia anual de 30€. Transferência até ao dia 1 de cada mês.": "7月和8月不需缴费。年费30€。每月1日前转账。",
    "Pagamento temporada": "全季付",
    "temporada + jóia anual 30€": "全季 + 年费30€",
    "Equivalente a 39€/mês durante 10 meses. Pode ser dividido em duas prestações sem penalização.": "相当于10个月每月39€。可分两期付款，无罚款。",
    "Descontos": "折扣",
    "Desconto familiar de 10% a partir do segundo membro até aos 18 anos. Descontos de antiguidade: 10 temporadas, 15€; 15 temporadas, 20€; 20 temporadas, 25€. Podem existir outras condições acumuláveis, com mínimo anual aplicável.": "从第二位18岁以下成员起享有10%家庭折扣。资历折扣：10个赛季15€；15个赛季20€；20个赛季25€。可能存在其他可累积条件，适用年度最低标准。",
    "Formas de pagamento": "付款方式",
    "Indique sempre o nome completo do corista. Cartões, Visa e Apple Pay serão ativados através de uma ligação de pagamento segura.": "请始终注明合唱团员的全名。卡片、Visa和Apple Pay将通过安全支付链接激活。",
    "A sua voz começa aqui": "您的声音从这里开始",
    "Encontre o seu novo grupo.": "找到您的新合唱团。",
    "Conheça os ensembles, projetos e formas de participar na comunidade VoxLaci.": "了解VoxLaci社区的合唱团、项目和参与方式。",
    "Encontrar o meu novo grupo": "寻找我的新合唱团",
    "A VoxLaci está viva": "VoxLaci 充满活力",
    "Veja. Receba.<br>Faça parte.": "欣赏。接收。<br>成为其中一员。",
    "Acompanhe as publicações mais recentes, receba novidades por email ou peça acesso ao grupo WhatsApp.": "关注最新发布，通过电子邮件接收新闻，或申请加入WhatsApp群组。",
    "Ver as publicações mais recentes →": "查看最新发布 →",
    "Acompanhar a comunidade →": "关注社区 →",
    "Ver no YouTube →": "在YouTube上观看 →",
    "Seja o primeiro a saber.": "第一个获悉。",
    "Nome": "姓名",
    "Aceito receber novidades VoxLaci e posso cancelar a qualquer momento.": "我同意接收VoxLaci新闻，可随时取消订阅。",
    "Subscrever newsletter →": "订阅通讯 →",
    "Quero entrar no grupo de novidades.": "我想加入新闻群组。",
    "Pedir acesso →": "申请加入 →",
    "Cantar. Unir. Inspirar. Transformar.": "歌唱。联结。启发。改变。",
    "Encontrar-nos": "找到我们",
    "Falar connosco": "联系我们",
    "Acompanhar": "关注我们",
    "Arquivo completo ↗": "完整档案 ↗",
    "Casting e inscrições online": "在线试唱与报名",
    "Qual é o seu<br>próximo passo?": "您的<br>下一步是什么？",
    "Não precisa de conhecer a sua voz nem saber qual é o grupo certo. Escolha um caminho e nós ajudamos no resto.": "您不需要了解自己的声音或知道哪个合唱团合适。选择一条路，我们来帮助其余的事。",
    "Encontrar o meu ensemble": "寻找我的合唱团",
    "Crianças, jovens e adultos": "儿童、青少年和成人",
    "Ver pagamentos": "查看缴费",
    "Inscrição, jóia e mensalidades": "报名费、年费和月费",
    "Fazer casting online": "在线参加试唱",
    "Formulário e comprovativo": "表格和付款凭证",
    "Casting": "试唱",
    "Ligar": "致电"
  }
};

function translateItem(item) {
  const direct = item.dataset[language];
  const translated = uiTranslations[language]?.[item.dataset.pt];
  item.innerHTML = direct || translated || item.dataset.en || item.dataset.pt;
}

function applySiteLanguage() {
  document.documentElement.lang = language;
  const meta = languageMeta[language] || languageMeta.pt;
  document.title = meta.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
  document.querySelectorAll("[data-pt][data-en]").forEach(translateItem);
  if (languageButton) languageButton.value = language;
}
applySiteLanguage();
languageButton.addEventListener("change", () => {
  language = supportedLanguages.includes(languageButton.value) ? languageButton.value : "pt";
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
  },
  zh: {
    welcome: "好的。您想了解什么？",
    placeholder: "请输入或说话…",
    options: [["寻找我的合唱团", "sing"], ["儿童与青少年合唱团", "child"], ["棕枝主日节", "festival"], ["邀请VoxLaci演出", "book"], ["排练时间与地点", "location"], ["联系工作人员", "human"]],
    fallback: "我可以帮助您了解合唱团、节日、报名、演出、时间安排和联系方式。",
    answers: {
      sing: ["我们有适合儿童、青少年、成人、室内声乐和职业合唱的路径。请告诉我年龄或经验。", "#vozes", "探索合唱团"],
      child: ["Vox Pueri适合4至9/10岁儿童。Vox Soul适合10至18岁青少年。", "#vozes", "查看合唱团"],
      festival: ["棕枝主日节汇聚来自各国的歌手、合唱团和指挥，进行大师班、排练和音乐会。", "#festival", "了解节日"],
      book: ["我们为婚礼、典礼、企业活动和私人活动创作音乐。", "#servicos", "与我们合作"],
      location: ["我们在卡斯凯什圣多明戈斯德拉纳的Torre d'Águilha修道院排练。", "#contactos", "查看联系方式"],
      human: ["请联系 info@voxlaci.com 或致电 (+351) 925 075 186。", "mailto:info@voxlaci.com", "发送邮件"]
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
      const recognitionLanguages = { pt: "pt-PT", en: "en-GB", es: "es-ES", fr: "fr-FR", it: "it-IT", de: "de-DE", zh: "zh-CN" };
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

/* ── Instagram posts grid ───────────────────────────── */
const instaGrid = document.getElementById("insta-grid");
if (instaGrid) {
  const igIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,255,255,.9)" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`;
  fetch("/instagram-feed").then(r => r.json()).then(posts => {
    if (!Array.isArray(posts) || !posts.length) return;
    instaGrid.innerHTML = posts.map(p => `
      <a class="insta-post-item" href="${p.url}" target="_blank" rel="noopener" aria-label="Ver publicação no Instagram">
        <img src="${p.image}" alt="" loading="lazy" decoding="async">
        <div class="insta-post-overlay" aria-hidden="true">${igIcon}</div>
      </a>
    `).join("");
  }).catch(() => {});
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
