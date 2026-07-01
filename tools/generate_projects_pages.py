from __future__ import annotations

from pathlib import Path
from html import escape
import json

ROOT = Path(__file__).resolve().parents[1]

LANGS = ["pt", "en", "es", "fr", "it", "zh"]

T = {
    "pt": {
        "projects": "Projetos",
        "archive": "Arquivo recuperado",
        "overview": "Visão geral",
        "history": "História e contexto",
        "objectives": "Objetivos",
        "audience": "Destinatários",
        "info_update": "Informação em atualização.",
        "open": "Abrir projeto",
        "back": "Voltar aos projetos",
        "casting": "Fazer casting online",
        "home": "VoxLaci",
        "subtitle": "Projetos sociais, educativos, internacionais e artísticos que mostram como a VoxLaci transforma comunidade através da música.",
        "cta_title": "Mais do que unirmos vozes, transformamos mundos.",
        "source_files": "Ficheiros de origem"
    },
    "en": {
        "projects": "Projects",
        "archive": "Recovered archive",
        "overview": "Overview",
        "history": "History and context",
        "objectives": "Objectives",
        "audience": "Audience",
        "info_update": "Information being updated.",
        "open": "Open project",
        "back": "Back to projects",
        "casting": "Online casting",
        "home": "VoxLaci",
        "subtitle": "Social, educational, international and artistic projects showing how VoxLaci transforms community through music.",
        "cta_title": "More than joining voices, we transform worlds.",
        "source_files": "Source files"
    },
    "es": {
        "projects": "Proyectos",
        "archive": "Archivo recuperado",
        "overview": "Visión general",
        "history": "Historia y contexto",
        "objectives": "Objetivos",
        "audience": "Destinatarios",
        "info_update": "Información en actualización.",
        "open": "Abrir proyecto",
        "back": "Volver a proyectos",
        "casting": "Casting online",
        "home": "VoxLaci",
        "subtitle": "Proyectos sociales, educativos, internacionales y artísticos que muestran cómo VoxLaci transforma comunidad a través de la música.",
        "cta_title": "Más que unir voces, transformamos mundos.",
        "source_files": "Archivos de origen"
    },
    "fr": {
        "projects": "Projets",
        "archive": "Archive récupérée",
        "overview": "Vue d’ensemble",
        "history": "Histoire et contexte",
        "objectives": "Objectifs",
        "audience": "Publics",
        "info_update": "Information en cours de mise à jour.",
        "open": "Ouvrir le projet",
        "back": "Retour aux projets",
        "casting": "Casting en ligne",
        "home": "VoxLaci",
        "subtitle": "Projets sociaux, éducatifs, internationaux et artistiques montrant comment VoxLaci transforme la communauté par la musique.",
        "cta_title": "Plus que réunir des voix, nous transformons des mondes.",
        "source_files": "Fichiers source"
    },
    "it": {
        "projects": "Progetti",
        "archive": "Archivio recuperato",
        "overview": "Visione generale",
        "history": "Storia e contesto",
        "objectives": "Obiettivi",
        "audience": "Destinatari",
        "info_update": "Informazioni in aggiornamento.",
        "open": "Apri progetto",
        "back": "Torna ai progetti",
        "casting": "Casting online",
        "home": "VoxLaci",
        "subtitle": "Progetti sociali, educativi, internazionali e artistici che mostrano come VoxLaci trasforma la comunità attraverso la musica.",
        "cta_title": "Più che unire voci, trasformiamo mondi.",
        "source_files": "File sorgente"
    },
    "zh": {
        "projects": "项目",
        "archive": "已恢复档案",
        "overview": "概览",
        "history": "历史与背景",
        "objectives": "目标",
        "audience": "对象",
        "info_update": "信息更新中。",
        "open": "打开项目",
        "back": "返回项目",
        "casting": "在线试唱",
        "home": "VoxLaci",
        "subtitle": "社会、教育、国际和艺术项目，展示 VoxLaci 如何通过音乐改变社区。",
        "cta_title": "我们不只是汇聚声音，也改变世界。",
        "source_files": "来源文件"
    },
}

PROJECTS = [
    {
        "slug": "coros-nas-escolas",
        "title": "Coros nas Escolas",
        "category": "Educação",
        "image": "/legacy-media/bd56d8e68102.jpg",
        "old_urls": ["/projectos/coros-nas-escolas/"],
        "sources": ["projectos/coros-nas-escolas/index.html"],
        "summary": {
            "pt": "Projeto para que escolas possam ter o seu coro, dirigido por pedagogo e maestro experiente.",
            "en": "A project enabling schools to have their own choir, led by an experienced educator and conductor.",
            "es": "Proyecto para que las escuelas puedan tener su coro, dirigido por un pedagogo y director con experiencia.",
            "fr": "Projet permettant aux écoles d’avoir leur propre chœur, dirigé par un pédagogue et chef expérimenté.",
            "it": "Progetto per permettere alle scuole di avere il proprio coro, guidato da un pedagogo e direttore esperto.",
            "zh": "帮助学校建立自己的合唱团，由经验丰富的教育者和指挥带领。"
        },
        "history": [
            "Para haver bons coros, tem de haver primeiro bons músicos.",
            "O projeto apresenta às escolas a possibilidade de criarem coros com repertório, formação musical e técnica vocal.",
            "Cada coro teria 2 a 3 atuações anuais — Natal, final do ano letivo e, mais tarde, Páscoa — inseridas nas atividades da escola."
        ],
        "objectives": ["Desenvolver ouvido e voz em crianças e jovens.", "Ensinar repertório, formação musical e técnica vocal.", "Promover saber estar em grupo, respeito pelo outro e respeito por hierarquias."],
        "audience": ["Escolas.", "Crianças e jovens do 1.º ao 12.º ano."],
        "details": ["Material necessário: sala ampla, de preferência sem mesas, e dossier preto A4 para cada corista.", "Coros com 1 ensaio por semana: 1.ª+2.ª classe — 45 minutos; 3.ª+4.ª classe — 60 minutos; 5.º ao 12.º ano — 60/90 minutos.", "Condições recuperadas: 500 euros mensais por cada coro criado."]
    },
    {
        "slug": "de-maos-dadas",
        "title": "De Mãos Dadas",
        "category": "Impacto social",
        "image": "/legacy-media/3cd51248663d.jpg",
        "old_urls": ["/projectos/de-maos-dadas/"],
        "sources": ["projectos/de-maos-dadas/index.html"],
        "summary": {
            "pt": "Projeto de encontro entre “avós” e “netos” através da música, levando o VoxPueri a lares e centros de dia.",
            "en": "A project connecting “grandparents” and “grandchildren” through music, bringing VoxPueri to care homes and day centres.",
            "es": "Proyecto de encuentro entre “abuelos” y “nietos” a través de la música, llevando VoxPueri a residencias y centros de día.",
            "fr": "Projet de rencontre entre « grands-parents » et « petits-enfants » par la musique, avec VoxPueri dans des maisons de retraite et centres de jour.",
            "it": "Progetto d’incontro tra “nonni” e “nipoti” attraverso la musica, portando VoxPueri in case di riposo e centri diurni.",
            "zh": "通过音乐连接“祖父母”和“孙辈”，把 VoxPueri 带到养老院和日间中心。"
        },
        "history": ["O projeto promove encontros em lares e centros de dia, através de sorrisos, canções e histórias.", "Pretende valorizar a sabedoria e experiência dos mais velhos e a infância dos mais novos."],
        "objectives": ["Combater a solidão dos avós.", "Proporcionar momentos de alegria e ternura através da música.", "Criar ponte entre gerações."],
        "audience": ["Lares e centros de dia do concelho de Cascais e Oeiras.", "Coro VoxPueri, com crianças dos 3 aos 9/10 anos."],
        "details": ["Atuações de cerca de 20–25 minutos.", "Máximo de 2 atuações por mês.", "O pedido de atuação era enviado para info@voxlaci.com.", "Os lares podiam fazer uma doação para ajudar a manter o projeto."]
    },
    {
        "slug": "voxfrater",
        "title": "VoxFrater",
        "category": "Fraternidade",
        "image": "/legacy-media/367648568320.jpg",
        "old_urls": ["/projectos/voxfrater/"],
        "sources": ["projectos/voxfrater/index.html"],
        "summary": {
            "pt": "Projeto fraterno da VoxLaci com vertente de apoio social no terreno e apoio financeiro.",
            "en": "VoxLaci’s fraternal project, combining social action on the ground with financial support.",
            "es": "Proyecto fraterno de VoxLaci con apoyo social sobre el terreno y apoyo financiero.",
            "fr": "Projet fraternel de VoxLaci associant action sociale sur le terrain et soutien financier.",
            "it": "Progetto fraterno di VoxLaci con azione sociale sul territorio e sostegno finanziario.",
            "zh": "VoxLaci 的互助项目，结合实地社会支持和经济支持。"
        },
        "history": ["O arquivo apresenta VOX FRATER como “VoxLaci Fraterno”.", "Tem duas vertentes: apoio social no terreno e apoio financeiro."],
        "objectives": ["Envolver 3 coros VoxLaci — coro adulto, coro juvenil e coro infantil — em ações de solidariedade.", "Contribuir para instituições como lares de 3.ª idade, creches, infantários, hospitais e bombeiros voluntários."],
        "audience": ["Comunidade VoxLaci.", "Instituições sociais e comunidade envolvente."],
        "details": ["Razões recuperadas: consciência dos tempos atuais, maior solidariedade e vontade dos coristas VoxLaci para uma contribuição ativa."]
    },
    {
        "slug": "bolsa-17",
        "title": "Bolsa 17",
        "category": "Mérito",
        "image": "/legacy-media/3ed56eff7949.jpg",
        "old_urls": ["/projectos/bolsa-17/"],
        "sources": ["projectos/bolsa-17/index.html"],
        "summary": {
            "pt": "Bolsa destinada a coristas VoxLaci no ativo há mais de 2 anos que frequentem o 12.º ano e obtenham média igual ou superior a 17 valores.",
            "en": "Scholarship for active VoxLaci singers of more than two years, in the 12th grade, with an average grade of 17 or above.",
            "es": "Beca para coralistas VoxLaci activos desde hace más de dos años, en 12.º curso, con media igual o superior a 17.",
            "fr": "Bourse destinée aux choristes VoxLaci actifs depuis plus de deux ans, en 12e année, avec une moyenne de 17 ou plus.",
            "it": "Borsa per coristi VoxLaci attivi da oltre due anni, al 12º anno, con media pari o superiore a 17.",
            "zh": "面向活跃超过两年的 VoxLaci 歌者、就读 12 年级且平均成绩达到 17 分或以上的奖学金。"
        },
        "history": ["A Bolsa 17 reconhece mérito escolar e dedicação à VoxLaci.", "O cheque Bolsa 17 era oferecido no concerto em junho e convertido em VoxCredit."],
        "objectives": ["Reconhecer dedicação e mérito académico.", "Apoiar pagamentos de anuidades, viagens ou merchandising do próprio corista."],
        "audience": ["Coristas VoxLaci no ativo há mais de 2 anos.", "Alunos do 12.º ano com média igual ou superior a 17 valores e assiduidade igual ou superior a 85% em cada mês do ano letivo."],
        "details": ["Fórmula recuperada: (Média 3.º Período x 10€) + (n.º anos VOX LACI x 15€) = BOLSA 17.", "Com assiduidade de 100% nos ensaios e atuações, acrescia um bónus de 100€.", "Exemplo recuperado: 17,8 com 4 anos VoxLaci = 238€."]
    },
    {
        "slug": "quadro-de-merito",
        "title": "Quadro de Mérito",
        "category": "Mérito",
        "image": "/legacy-media/609a63ecd600.jpg",
        "old_urls": ["/projectos/quadro-de-merito/"],
        "sources": ["projectos/quadro-de-merito/index.html"],
        "summary": {
            "pt": "Incentivo à formação, educação e motivação dos coristas VoxLaci, reconhecendo regularidade e desenvolvimento intelectual.",
            "en": "An initiative supporting VoxLaci singers’ education and motivation, recognising regularity and intellectual development.",
            "es": "Iniciativa de formación, educación y motivación de los coralistas VoxLaci, reconociendo regularidad y desarrollo intelectual.",
            "fr": "Initiative de formation, d’éducation et de motivation des choristes VoxLaci, reconnaissant régularité et développement intellectuel.",
            "it": "Iniziativa per la formazione, educazione e motivazione dei coristi VoxLaci, riconoscendo regolarità e sviluppo intellettuale.",
            "zh": "支持 VoxLaci 歌者教育与动力的项目，表彰持续努力和智力发展。"
        },
        "history": ["O Quadro de Mérito nasce da uma preocupação com formação, educação e motivação dos coristas.", "Pretende promover a regularidade e o desenvolvimento intelectual dos cantores."],
        "objectives": ["Incentivar estudo e compromisso.", "Reconhecer coristas que dão o seu melhor em paralelo com a atividade no VoxLaci."],
        "audience": ["Coristas VoxLaci no ativo entre o 1.º e o 12.º ano.", "Alunos com média igual ou superior a 4/5 ou 16/20, sem negativas e com assiduidade superior a 80%."],
        "details": ["O arquivo indica que a direção oferecia um jantar ou almoço aos coristas do Quadro de Mérito."]
    },
    {
        "slug": "encontros-surpresa",
        "title": "Encontros Surpresa",
        "category": "Inspiração",
        "image": "/legacy-media/68aa470388ca.jpg",
        "old_urls": ["/projectos/encontros-surpresa/"],
        "sources": ["projectos/encontros-surpresa/index.html"],
        "summary": {
            "pt": "Encontros inesperados com pessoas de mérito que inspiram a comunidade VoxLaci.",
            "en": "Unexpected encounters with people of merit who inspire the VoxLaci community.",
            "es": "Encuentros inesperados con personas de mérito que inspiran a la comunidad VoxLaci.",
            "fr": "Rencontres inattendues avec des personnes inspirantes pour la communauté VoxLaci.",
            "it": "Incontri inattesi con persone di merito che ispirano la comunità VoxLaci.",
            "zh": "与杰出人物的惊喜相遇，启发 VoxLaci 社群。"
        },
        "history": ["Consiste em trazer pessoas que, pelo seu mérito, inspiram e são exemplo em diferentes áreas da sociedade.", "Essas pessoas apareciam de surpresa nos ensaios."],
        "objectives": ["Inspirar coristas e comunidade.", "Criar contacto direto com exemplos de mérito em diferentes áreas."],
        "audience": ["Coristas VoxLaci.", "Comunidade VoxLaci."],
        "details": ["O arquivo menciona fotografias, mas não disponibiliza nomes ou datas específicas nesta página recuperada."]
    },
    {
        "slug": "voxpop",
        "title": "voX±Pop",
        "category": "Internacional",
        "image": "/legacy-media/3e18580f3c59.jpg",
        "old_urls": ["/voxpop/", "/cascaisvoxpop/", "/lisboavoxpop/", "/portovoxpop/", "/monopolivoxpop/", "/londonvoxpop/", "/dakarvoxpop/"],
        "sources": ["voxpop/index.html", "cascaisvoxpop/index.html", "lisboavoxpop/index.html", "portovoxpop/index.html", "monopolivoxpop/index.html", "londonvoxpop/index.html", "dakarvoxpop/index.html"],
        "summary": {
            "pt": "Conceito internacional de encontro coral em cidades caminháveis, com taxa base de participação e experiências locais.",
            "en": "An international choral meeting concept in walkable cities, with a basic participation fee and local experiences.",
            "es": "Concepto internacional de encuentro coral en ciudades caminables, con cuota base de participación y experiencias locales.",
            "fr": "Concept international de rencontre chorale dans des villes accessibles à pied, avec frais de participation de base et expériences locales.",
            "it": "Concetto internazionale di incontro corale in città percorribili a piedi, con quota base e esperienze locali.",
            "zh": "在适合步行的城市举办的国际合唱相遇概念，包含基础参与费用和当地体验。"
        },
        "history": ["O conceito recuperado define voX±Pop como evento de 3 dias com música numa cidade, vila ou localidade caminhável.", "O símbolo X±P representa cada pessoa como o X que pode impactar as pessoas à sua volta.", "Edições/páginas recuperadas: Cascais, Lisboa, Porto, London, Monopoli e Dakar."],
        "objectives": ["Criar experiências corais abertas a diferentes formas de participação.", "Permitir que cada pessoa desenhe a experiência antes, durante e depois do evento.", "Convidar cidades e comunidades a criarem o seu próprio voX±Pop."],
        "audience": ["Coros.", "Ensembles criados para o evento.", "Amigos, participantes individuais e pessoas que queiram juntar-se aos workshops e cantar repertório nos concertos."],
        "details": ["Conceito recuperado: 3 dias com música, com taxa base de 99€/pessoa.", "Formas de participação: vir com o coro, criar ensemble, vir com amigos, vir sozinho e ser integrado num coro participante, participar nos workshops e cantar o repertório.", "Add-ons: cada evento voX±Pop tem experiências únicas antes e/ou depois do evento."],
        "links": [("Cascais voX±Pop", "/cascaisvoxpop/"), ("Lisboa voX±Pop", "/lisboavoxpop/"), ("Porto voX±Pop", "/portovoxpop/"), ("London voX±Pop", "/londonvoxpop/"), ("Monopoli voX±Pop", "/monopolivoxpop/"), ("Dakar voX±Pop", "/dakarvoxpop/")]
    },
    {
        "slug": "voxpueri-festival",
        "title": "VoxPueri Festival",
        "category": "Infância",
        "image": "/assets/event-puerifest.jpg",
        "old_urls": ["/eventos/voxpueri-fest/"],
        "sources": ["eventos/voxpueri-fest/index.html"],
        "summary": {
            "pt": "Semana de atividades para crianças nas férias da Páscoa, com música nas manhãs e desporto nas tardes.",
            "en": "Activity week for children during Easter holidays, with music in the mornings and sports in the afternoons.",
            "es": "Semana de actividades para niños en vacaciones de Pascua, con música por la mañana y deporte por la tarde.",
            "fr": "Semaine d’activités pour enfants pendant les vacances de Pâques, avec musique le matin et sport l’après-midi.",
            "it": "Settimana di attività per bambini durante le vacanze di Pasqua, con musica al mattino e sport al pomeriggio.",
            "zh": "复活节假期儿童活动周，上午音乐，下午运动。"
        },
        "history": ["7.ª edição recuperada: 6–9 Abril, Segunda a Quinta-Feira Santa, 9h–17h, com possibilidade de prolongamento até 19h.", "Decorreria na Fundação O Século, em São Pedro do Estoril.", "Culminava com concerto final."],
        "objectives": ["Introduzir crianças às técnicas de canto coral e repertório adequado à idade.", "Transformar férias escolares em descoberta de novas formas de comunicação e interação interpessoal.", "Unir música, jogos, surf e outras atividades."],
        "audience": ["Crianças dos 6 aos 12 anos.", "Possibilidade de aceitar crianças entre 4 e 6 anos caso tivessem irmão a participar."],
        "details": ["Línguas faladas: Português, Inglês e Espanhol.", "Direção artística de Myguel Santos e Castro e participação de maestro/maestrina convidado/a."]
    },
    {
        "slug": "ramos",
        "title": "RAMOS · Palm Sunday Festival",
        "category": "Festival",
        "image": "/assets/ramos/felicia-barber-2027.jpg",
        "old_urls": ["/ramos/"],
        "sources": ["ramos/index.html", "ramos/arquivo-completo/index.html", "ramos-edition.js"],
        "summary": {
            "pt": "Festival internacional de música coral sacra criado em 2005, trazendo maestros internacionais a Portugal.",
            "en": "International sacred choral music festival created in 2005, bringing international conductors to Portugal.",
            "es": "Festival internacional de música coral sacra creado en 2005, trayendo directores internacionales a Portugal.",
            "fr": "Festival international de musique chorale sacrée créé en 2005, invitant des chefs internationaux au Portugal.",
            "it": "Festival internazionale di musica corale sacra creato nel 2005, portando direttori internazionali in Portogallo.",
            "zh": "2005 年创立的国际圣乐合唱节，把国际指挥带到葡萄牙。"
        },
        "history": ["Desde 2005, o Ramos marca o fim de semana de Domingo de Ramos com concertos de música sacra sob direção de maestros internacionais.", "A página Ramos já possui arquivo próprio com edições, cartazes, programas, maestros e repertório."],
        "objectives": ["Dar ao público repertório e maestros internacionais.", "Proporcionar aos coristas partilha de diferentes modos de estar, ver e sentir música."],
        "audience": ["Cantores com experiência.", "Público interessado em música coral sacra.", "Maestros e comunidade coral internacional."],
        "details": ["Página principal preservada em /ramos/.", "Edição 2027 anunciada: XIX Palm Sunday Festival, 15–21 March 2027, Felicia Barber, USA."],
        "links": [("Abrir arquivo Ramos", "/ramos/")]
    },
    {
        "slug": "voxaround",
        "title": "VoxAround",
        "category": "Internacional",
        "image": "/legacy-media/993b89a84ff6.jpg",
        "old_urls": ["/eventos/voxaround/"],
        "sources": ["eventos/voxaround/index.html"],
        "summary": {
            "pt": "Projeto/evento internacional VoxLaci. A página recuperada contém apenas referência inicial.",
            "en": "VoxLaci international project/event. The recovered page contains only an initial reference.",
            "es": "Proyecto/evento internacional VoxLaci. La página recuperada contiene sólo una referencia inicial.",
            "fr": "Projet/événement international VoxLaci. La page récupérée ne contient qu’une référence initiale.",
            "it": "Progetto/evento internazionale VoxLaci. La pagina recuperata contiene solo un riferimento iniziale.",
            "zh": "VoxLaci 国际项目/活动；已恢复页面仅包含初步信息。"
        },
        "history": ["A página antiga recuperada indica: “Informações disponíveis brevemente.”"],
        "objectives": [],
        "audience": [],
        "details": []
    },
    {
        "slug": "conductors-mob",
        "title": "Conductor’s MOB",
        "category": "Maestros",
        "image": "/legacy-media/03570509a517.jpg",
        "old_urls": ["/eventos/conductors-mob/"],
        "sources": ["eventos/conductors-mob/index.html"],
        "summary": {
            "pt": "Encontro/projeto para maestros. A página recuperada contém apenas referência inicial.",
            "en": "Meeting/project for conductors. The recovered page contains only an initial reference.",
            "es": "Encuentro/proyecto para directores. La página recuperada contiene sólo una referencia inicial.",
            "fr": "Rencontre/projet pour chefs de chœur. La page récupérée ne contient qu’une référence initiale.",
            "it": "Incontro/progetto per direttori. La pagina recuperata contiene solo un riferimento iniziale.",
            "zh": "面向指挥的相遇/项目；已恢复页面仅包含初步信息。"
        },
        "history": ["A página antiga recuperada indica: “Informações disponíveis brevemente.”"],
        "objectives": [],
        "audience": [],
        "details": []
    },
    {
        "slug": "dakar-singing-festival",
        "title": "Dakar Singing Festival",
        "category": "Internacional",
        "image": "/legacy-media/2d6d25edea61.jpg",
        "old_urls": ["/dakar-singing-festival/"],
        "sources": ["dakar-singing-festival/index.html"],
        "summary": {
            "pt": "Página recuperada apresenta uma viagem RAMOS para cantores com experiência, com informação bilingue PT/EN.",
            "en": "Recovered page presenting a RAMOS journey for experienced singers, with bilingual PT/EN information.",
            "es": "Página recuperada que presenta un viaje RAMOS para cantantes con experiencia, con información bilingüe PT/EN.",
            "fr": "Page récupérée présentant un voyage RAMOS pour chanteurs expérimentés, avec information bilingue PT/EN.",
            "it": "Pagina recuperata che presenta un viaggio RAMOS per cantanti esperti, con informazione bilingue PT/EN.",
            "zh": "已恢复页面介绍面向有经验歌者的 RAMOS 旅程，包含葡英双语信息。"
        },
        "history": ["O arquivo começa com “Benvindos à viagem do RAMOS / Welcome to RAMOS Journey”.", "Inclui sinopse do ciclo Ramos, ensaios, concertos, chegada/partida, direção artística e repertório RAMOS 2022."],
        "objectives": ["Convidar cantores com experiência para uma experiência internacional.", "Ligar viagem, repertório e prática coral."],
        "audience": ["Cantores com experiência.", "Coros que viajam em grupo."],
        "details": ["Ensaios recuperados: Sunday 3 de Abril, Monday/Tuesday/Wednesday 4,5,6 April, Thursday free night.", "Concertos recuperados: Friday 8 April, Saturday 9 April, Palm Sunday 10 April.", "Repertório RAMOS 2022: Of Love, Life and Spirit."]
    },
    {
        "slug": "international-tours",
        "title": "International Tours",
        "category": "Internacional",
        "image": "/assets/hero-live.jpg",
        "old_urls": ["/vox-laci/international-tours/"],
        "sources": ["vox-laci/international-tours/index.html"],
        "summary": {
            "pt": "Arquivo cronológico de viagens, workshops, assembleias e encontros internacionais entre 2001 e 2014.",
            "en": "Chronological archive of tours, workshops, assemblies and international meetings between 2001 and 2014.",
            "es": "Archivo cronológico de viajes, talleres, asambleas y encuentros internacionales entre 2001 y 2014.",
            "fr": "Archive chronologique de voyages, ateliers, assemblées et rencontres internationales entre 2001 et 2014.",
            "it": "Archivio cronologico di viaggi, workshop, assemblee e incontri internazionali tra 2001 e 2014.",
            "zh": "2001 至 2014 年间巡演、工作坊、大会和国际相遇的时间档案。"
        },
        "history": ["O arquivo lista Eurotreff Wolfenbuttel, World Choral Symposium, Europa Cantat, Polyfollia, workshops e tours internacionais.", "Datas recuperadas cobrem 2001 a 2014."],
        "objectives": ["Preservar a memória internacional da VoxLaci e da sua direção artística.", "Mostrar circulação, aprendizagem e contacto com redes corais internacionais."],
        "audience": ["Comunidade coral.", "Maestros, coristas e parceiros internacionais."],
        "details": ["Referências recuperadas incluem Alemanha, EUA, Japão, Bélgica, França, Dinamarca, Indonésia, Suíça, Coreia do Sul, Itália, Espanha e outros contextos internacionais."]
    },
    {
        "slug": "academia",
        "title": "Academia",
        "category": "Ensino",
        "image": "/legacy-media/1d1e72b50ebe.jpg",
        "old_urls": ["/academia/", "/servicos/academia/"],
        "sources": ["academia/index.html", "servicos/academia/index.html"],
        "summary": {
            "pt": "Academia VoxLaci: aprendizagem musical com professores que adoram o que fazem.",
            "en": "VoxLaci Academy: music learning with teachers who love what they do.",
            "es": "Academia VoxLaci: aprendizaje musical con profesores que aman lo que hacen.",
            "fr": "Académie VoxLaci : apprentissage musical avec des professeurs qui aiment ce qu’ils font.",
            "it": "Accademia VoxLaci: apprendimento musicale con insegnanti che amano ciò che fanno.",
            "zh": "VoxLaci 学院：由热爱教学的老师带领音乐学习。"
        },
        "history": ["A página antiga apresenta a Academia como espaço de aprendizagem musical.", "Inclui referência ao Hotel Seminário Torre d’Águilha, São Domingos de Rana."],
        "objectives": ["Aprender a ler música.", "Expandir horizontes emocionais e intelectuais através da música.", "Integrar instrumento, formação musical e aula de conjunto."],
        "audience": ["Alunos motivados e dispostos a trabalhar em casa.", "Famílias que procuram aprendizagem musical organizada."],
        "details": ["Instrumentos/áreas recuperadas: guitarra, formação musical, análise, harmonia, piano, percussão e aulas de grupo.", "Havia duas apresentações públicas: final de janeiro e final de junho."]
    },
    {
        "slug": "espaco-dos-avos",
        "title": "Espaço dos Avós",
        "category": "Comunidade",
        "image": "/assets/encounter-live.jpg",
        "old_urls": ["/espacodosavos/"],
        "sources": ["espacodosavos/index.html"],
        "summary": {
            "pt": "Página recuperada do arquivo VoxLaci associada ao universo dos avós. Informação detalhada insuficiente no arquivo atual.",
            "en": "Recovered VoxLaci archive page connected to the grandparents universe. Detailed information is insufficient in the current archive.",
            "es": "Página recuperada del archivo VoxLaci vinculada al universo de los abuelos. La información detallada es insuficiente en el archivo actual.",
            "fr": "Page récupérée de l’archive VoxLaci liée à l’univers des grands-parents. Les informations détaillées sont insuffisantes dans l’archive actuelle.",
            "it": "Pagina recuperata dell’archivio VoxLaci legata all’universo dei nonni. Le informazioni dettagliate sono insufficienti nell’archivio attuale.",
            "zh": "VoxLaci 档案中与长辈相关的页面；当前档案缺少详细信息。"
        },
        "history": [],
        "objectives": [],
        "audience": [],
        "details": []
    },
]


def attrs(texts: dict[str, str]) -> str:
    return " ".join(f"data-{lang}={json.dumps(texts.get(lang, texts.get('pt', '')))}" for lang in LANGS)


def tkey(key: str) -> str:
    return attrs({lang: T[lang][key] for lang in LANGS})


def img_tag(src: str, alt: str) -> str:
    return f'<img src="{escape(src)}" alt="{escape(alt)}" loading="lazy">'


def page_head(title: str, desc: str, canonical: str, image: str) -> str:
    schema = {
        "@context": "https://schema.org",
        "@type": ["Organization", "PerformingGroup"],
        "name": "VoxLaci",
        "url": "https://voxlaci.com/",
        "email": "info@voxlaci.com",
        "telephone": "+351925075186",
        "sameAs": ["https://www.facebook.com/VoxLaci", "https://www.instagram.com/VoxLaci", "https://www.youtube.com/@VoxLaci"],
    }
    return f'''<!doctype html>
<html lang="pt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{escape(title)} | VoxLaci</title>
<meta name="description" content="{escape(desc)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="https://voxlaci.com{canonical}">
<meta property="og:title" content="{escape(title)} | VoxLaci">
<meta property="og:description" content="{escape(desc)}">
<meta property="og:image" content="https://voxlaci.com{escape(image)}">
<meta property="og:type" content="website">
<link rel="stylesheet" href="/subpage.css"><link rel="stylesheet" href="/universal-share.css?v=14">
<script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script>'''


def header(active_title: str = "Projetos") -> str:
    lang_buttons = "".join(f'<button type="button" data-set-lang="{lang}" aria-label="{lang.upper()}">{lang.upper()}</button>' for lang in LANGS)
    return f'''</head><body><header class="page-nav"><a href="/"><img src="/assets/voxlaci-logo-white.png" alt="VoxLaci"></a>
<nav><a href="/#vozes">Ensembles</a><a href="/eventos/">Eventos</a><a href="/projetos/">Projetos</a><a href="/#servicos">Serviços</a></nav>
<div class="project-lang" aria-label="Idiomas">{lang_buttons}</div><a class="cta" href="/#inscricao">{T["pt"]["casting"]}</a></header>'''


def footer() -> str:
    return '''<footer class="page-footer"><div><img src="/assets/voxlaci-logo-white.png" alt="VoxLaci"></div>
<div><a href="mailto:info@voxlaci.com">info@voxlaci.com</a><a href="/">Voltar ao site</a></div></footer>
<script src="/project-language.js" defer></script><script src="/universal-share.js?v=14" defer></script></body></html>'''


def schema_for_project(p: dict) -> str:
    data = {
        "@context": "https://schema.org",
        "@type": ["CreativeWork", "Project"],
        "name": p["title"],
        "description": p["summary"]["pt"],
        "url": f"https://voxlaci.com/projetos/{p['slug']}/",
        "image": f"https://voxlaci.com{p['image']}",
        "publisher": {"@type": "Organization", "name": "VoxLaci", "url": "https://voxlaci.com/"},
    }
    breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "VoxLaci", "item": "https://voxlaci.com/"},
            {"@type": "ListItem", "position": 2, "name": "Projetos", "item": "https://voxlaci.com/projetos/"},
            {"@type": "ListItem", "position": 3, "name": p["title"], "item": f"https://voxlaci.com/projetos/{p['slug']}/"},
        ],
    }
    return f'<script type="application/ld+json">{json.dumps(data, ensure_ascii=False)}</script><script type="application/ld+json">{json.dumps(breadcrumb, ensure_ascii=False)}</script>'


def list_items(items: list[str]) -> str:
    if not items:
        return f'<p class="muted" {tkey("info_update")}>{T["pt"]["info_update"]}</p>'
    return "<ul>" + "".join(f"<li>{escape(item)}</li>" for item in items) + "</ul>"


def render_project(p: dict) -> str:
    desc = p["summary"]["pt"]
    summaries = p["summary"]
    links = "".join(f'<a href="{href}">{escape(label)} <span>→</span></a>' for label, href in p.get("links", []))
    if not links:
        links = "".join(f'<a href="{url}">{escape(url)} <span>→</span></a>' for url in p.get("old_urls", []))
    sources = "".join(f"<li>{escape(src)}</li>" for src in p["sources"])
    body = page_head(p["title"], desc, f"/projetos/{p['slug']}/", p["image"]) + schema_for_project(p) + header()
    body += f'''<main>
<section class="page-hero project-hero"><img src="{escape(p["image"])}" alt="{escape(p["title"])}">
<div class="page-hero-copy"><p class="eyebrow">{escape(p["category"])}</p><h1>{escape(p["title"])}</h1><p {attrs(summaries)}>{escape(summaries["pt"])}</p>
<div class="page-hero-actions"><a class="button primary" href="#arquivo" {tkey("archive")}>{T["pt"]["archive"]}</a><a class="button" href="/projetos/" {tkey("back")}>{T["pt"]["back"]}</a></div></div></section>
<section class="intro"><div><p class="eyebrow" {tkey("overview")}>{T["pt"]["overview"]}</p><h2>{escape(p["title"])}</h2></div>
<div class="intro-copy"><p {attrs(summaries)}>{escape(summaries["pt"])}</p>
<div class="fact-grid"><div><b>Categoria</b><span>{escape(p["category"])}</span></div><div><b>Arquivo</b><span>{len(p["sources"])} ficheiro(s)</span></div><div><b>URL</b><span>/projetos/{escape(p["slug"])}/</span></div></div></div></section>
<section class="section white"><div class="benefits">
<article><h3 {tkey("history")}>{T["pt"]["history"]}</h3>{list_items(p["history"])}</article>
<article><h3 {tkey("objectives")}>{T["pt"]["objectives"]}</h3>{list_items(p["objectives"])}</article>
<article><h3 {tkey("audience")}>{T["pt"]["audience"]}</h3>{list_items(p["audience"])}</article>
</div></section>
<section class="section" id="arquivo"><div class="section-head"><p class="eyebrow" {tkey("archive")}>{T["pt"]["archive"]}</p><h2>{escape(p["title"])}</h2></div>
<div class="accordion"><details open><summary>Informação histórica organizada</summary><div>{list_items(p["details"])}</div></details>
<details><summary>Links e URLs antigas</summary><div class="ensemble-list">{links}</div></details>
<details><summary {tkey("source_files")}>{T["pt"]["source_files"]}</summary><div><ul>{sources}</ul></div></details></div></section>
<section class="section white"><div class="legacy-gallery">{img_tag(p["image"], p["title"])}</div></section>
<section class="page-cta"><p class="eyebrow">VoxLaci</p><h2 {tkey("cta_title")}>{T["pt"]["cta_title"]}</h2><a class="button primary" href="/#inscricao" {tkey("casting")}>{T["pt"]["casting"]}</a></section>
</main>'''
    return body + footer()


def render_index() -> str:
    desc = T["pt"]["subtitle"]
    item_schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Projetos VoxLaci",
        "description": desc,
        "url": "https://voxlaci.com/projetos/",
        "isPartOf": {"@type": "WebSite", "name": "VoxLaci", "url": "https://voxlaci.com/"},
        "hasPart": [{"@type": "CreativeWork", "name": p["title"], "url": f"https://voxlaci.com/projetos/{p['slug']}/"} for p in PROJECTS],
    }
    cards = ""
    for idx, p in enumerate(PROJECTS, 1):
        cards += f'''<a class="edition-card project-directory-card" href="/projetos/{escape(p["slug"])}/">{img_tag(p["image"], p["title"])}
<span>{idx:02d} · {escape(p["category"])}</span><h3>{escape(p["title"])}</h3><p {attrs(p["summary"])}>{escape(p["summary"]["pt"])}</p><b {tkey("open")}>{T["pt"]["open"]} →</b></a>'''
    body = page_head("Projetos VoxLaci", desc, "/projetos/", "/assets/hero-live.jpg") + f'<script type="application/ld+json">{json.dumps(item_schema, ensure_ascii=False)}</script>' + header()
    body += f'''<main>
<section class="page-hero project-hero"><img src="/assets/hero-live.jpg" alt="Projetos VoxLaci"><div class="page-hero-copy"><p class="eyebrow">VoxLaci</p><h1 {tkey("projects")}>{T["pt"]["projects"]}</h1><p {attrs({lang:T[lang]["subtitle"] for lang in LANGS})}>{desc}</p></div></section>
<section class="intro"><div><p class="eyebrow" {tkey("overview")}>{T["pt"]["overview"]}</p><h2>Projetos que transformam comunidade.</h2></div>
<div class="intro-copy"><p>Esta página reorganiza o arquivo histórico de Projetos VoxLaci: iniciativas sociais, educativas, internacionais, festivais e encontros que nasceram da mesma filosofia — mais do que unirmos vozes, transformamos mundos.</p>
<div class="fact-grid"><div><b>Projetos</b><span>{len(PROJECTS)}</span></div><div><b>Arquivo</b><span>Projectos, eventos e VoxLaci</span></div><div><b>Idiomas</b><span>PT · EN · ES · FR · IT · ZH</span></div></div></div></section>
<section class="section white"><div class="section-head"><p class="eyebrow" {tkey("projects")}>{T["pt"]["projects"]}</p><h2>Arquivo vivo VoxLaci</h2></div><div class="edition-grid project-directory">{cards}</div></section>
<section class="page-cta"><p class="eyebrow">VoxLaci</p><h2 {tkey("cta_title")}>{T["pt"]["cta_title"]}</h2><a class="button primary" href="/#inscricao" {tkey("casting")}>{T["pt"]["casting"]}</a></section>
</main>'''
    return body + footer()


def write_project_language_js() -> None:
    js = '''(() => {
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
})();'''
    (ROOT / "project-language.js").write_text(js, encoding="utf-8")


def main() -> None:
    (ROOT / "projetos").mkdir(exist_ok=True)
    (ROOT / "projetos" / "index.html").write_text(render_index(), encoding="utf-8")
    for p in PROJECTS:
        path = ROOT / "projetos" / p["slug"]
        path.mkdir(exist_ok=True)
        (path / "index.html").write_text(render_project(p), encoding="utf-8")
    write_project_language_js()


if __name__ == "__main__":
    main()
