from pathlib import Path
import html
import json

ROOT = Path(__file__).resolve().parents[1]

ORG = {
    "@type": "Organization",
    "name": "VoxLaci",
    "url": "https://voxlaci.com/",
    "email": "info@voxlaci.com",
    "telephone": "+351925075186",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Seminário Torre d'Águilha",
        "addressLocality": "São Domingos de Rana",
        "addressRegion": "Cascais",
        "addressCountry": "PT",
    },
}

PROTECTED = {
    "digital-home-artistas",
    "team-building",
}

SERVICES = [
    {
        "slug": "casamentos",
        "title": "Casamentos",
        "kicker": "Cerimónias · Música personalizada",
        "description": "Coros VoxLaci disponíveis para enaltecer momentos especiais, com repertório variado e adaptado às expectativas dos noivos.",
        "image": "/legacy-media/3a5cfbc5ce72.jpg",
        "category": "Cerimónias",
        "facts": ["Distrito de Lisboa", "VoxSoul · Hirmandade · Intuição", "Orçamento histórico: 2100€"],
        "sections": [
            ("Descrição", [
                "Os coros VoxLaci estão à disposição para enaltecer momentos especiais.",
                "O repertório é variado, procurando ir ao encontro das expectativas dos noivos.",
                "Este tipo de cerimónias é cantada pelo VoxSoul, Hirmandade e/ou Intuição."
            ]),
            ("Condições históricas recuperadas", [
                "O orçamento recuperado do arquivo é de 2100€ para animação numa missa de casamento ou baptizado no distrito de Lisboa.",
                "Fora do distrito de Lisboa acresce 300€ de autocarro.",
                "Caso a cerimónia seja reservada 6 meses antes do dia da cerimónia, com 50% do valor, tem um desconto de 10%. Os restantes 50% devem ser efectuados 24h antes da cerimónia.",
                "Caso deseje apenas um cantor com teclado/guitarra para a animação da cerimónia, o valor histórico é 450€.",
                "Caso deseje apenas instrumental com teclado/guitarra, o valor histórico é 250€."
            ]),
            ("Informação em atualização", [
                "Valores, disponibilidade e contactos devem ser confirmados antes da contratação."
            ])
        ],
        "faq": [
            ("Que grupos cantam em casamentos?", "O arquivo refere VoxSoul, Hirmandade e/ou Intuição."),
            ("O repertório é fixo?", "O arquivo indica repertório variado e adaptado às expectativas dos noivos."),
            ("Os preços estão atuais?", "Os valores apresentados vêm do arquivo histórico e devem ser confirmados com a VoxLaci.")
        ],
    },
    {
        "slug": "baptizados",
        "title": "Baptizados",
        "kicker": "Cerimónias · Famílias",
        "description": "Música coral para baptizados, com repertório variado e adaptado às expectativas dos pais.",
        "image": "/legacy-media/f6292fc66c6b.jpg",
        "category": "Cerimónias",
        "facts": ["Distrito de Lisboa", "VoxSoul · Hirmandade · Intuição", "Orçamento histórico: 2100€"],
        "sections": [
            ("Descrição", [
                "Os coros VoxLaci estão à disposição para enaltecer momentos especiais.",
                "O repertório é variado, procurando ir ao encontro das expectativas dos pais do baptizado.",
                "Este tipo de cerimónias é cantada pelo VoxSoul, Hirmandade e/ou Intuição."
            ]),
            ("Condições históricas recuperadas", [
                "O orçamento recuperado do arquivo é de 2100€ para animação numa missa de casamento ou baptizado no distrito de Lisboa.",
                "Fora do distrito de Lisboa acresce 300€ de autocarro.",
                "Caso a cerimónia seja reservada 6 meses antes do dia da cerimónia, com 50% do valor, tem um desconto de 10%. Os restantes 50% devem ser efectuados 24h antes da cerimónia.",
                "Cantor com teclado/guitarra: valor histórico de 450€.",
                "Instrumental com teclado/guitarra: valor histórico de 250€."
            ]),
            ("Informação em atualização", [
                "Valores, disponibilidade e contactos devem ser confirmados antes da contratação."
            ])
        ],
        "faq": [
            ("A VoxLaci canta em baptizados com ou sem missa?", "O arquivo refere que o orçamento não sofre alteração com Missa ou sem Missa."),
            ("O número de cantores altera o orçamento?", "O arquivo indica que o orçamento não sofre alteração consoante o número de cantores."),
            ("Os valores estão confirmados?", "São valores históricos recuperados; devem ser confirmados diretamente com a VoxLaci.")
        ],
    },
    {
        "slug": "missa-de-7o-e-30o-dia",
        "title": "Missa de 7.º e 30.º dia",
        "kicker": "Cerimónias · Homenagem",
        "description": "Acompanhamento musical para missas de 7.º e 30.º dia e outros momentos solenes de homenagem.",
        "image": "/legacy-media/49f071df8071.jpg",
        "category": "Cerimónias",
        "facts": ["Momento solene", "Hirmandade · Intuição", "Repertório adequado"],
        "sections": [
            ("Descrição", [
                "Os coros VoxLaci estão à disposição para enaltecer momentos especiais dos entes mais queridos.",
                "O repertório é variado e adequado ao momento solene.",
                "Este tipo de cerimónias é cantada pelo Hirmandade e/ou Intuição."
            ]),
            ("Condições históricas recuperadas", [
                "O orçamento recuperado do arquivo é de 2100€ para animação numa missa no distrito de Lisboa.",
                "Fora do distrito de Lisboa acresce 300€ de autocarro.",
                "Cantor com teclado/guitarra: valor histórico de 450€.",
                "Instrumental com teclado/guitarra: valor histórico de 250€."
            ]),
            ("Informação em atualização", ["Valores e disponibilidade devem ser confirmados."])
        ],
        "faq": [
            ("Que grupos cantam este tipo de cerimónia?", "O arquivo refere Hirmandade e/ou Intuição."),
            ("O repertório é apropriado ao momento?", "Sim. O arquivo indica repertório variado e adequado ao momento solene."),
        ],
    },
    {
        "slug": "eventos-privados",
        "title": "Eventos Privados",
        "kicker": "Eventos · Atuação coral",
        "description": "Possibilidade de ter um ou mais coros VoxLaci a atuar em eventos privados, mediante orçamento.",
        "image": "/legacy-media/cc4bfe3650b0.jpg",
        "category": "Eventos",
        "facts": ["Orçamento por pedido", "Um ou mais coros", "Contacto: info@voxlaci.com"],
        "sections": [
            ("Descrição", [
                "Gostaria de ter um, ou mais, dos coros VoxLaci a atuar no seu evento?",
                "O arquivo indica pedido de orçamento por contacto direto."
            ]),
            ("Informação em atualização", [
                "Detalhes sobre formatos, duração, repertório, valores e disponibilidade estão em atualização."
            ])
        ],
        "faq": [
            ("É possível contratar mais do que um coro?", "O arquivo refere a possibilidade de ter um ou mais coros VoxLaci a atuar."),
            ("Como pedir orçamento?", "Através de info@voxlaci.com ou WhatsApp (+351) 925 075 186.")
        ],
    },
    {
        "slug": "som-luzes",
        "title": "Som & Luzes",
        "kicker": "Produção · Aluguer técnico",
        "description": "Material de som, luzes e apoio técnico recuperado do arquivo de serviços VoxLaci.",
        "image": "/legacy-media/1def0f1d2b72.jpg",
        "category": "Produção",
        "facts": ["Utilização histórica: 12 horas", "Caução histórica: 100€", "Material sob confirmação"],
        "sections": [
            ("Descrição", [
                "O arquivo apresenta opções de aluguer de som, luzes e material de apoio para eventos.",
                "A utilização indicada é de 12 horas, com material levantado e entregue pelo próprio."
            ]),
            ("Material e valores históricos", [
                "Sistema rápido de som: 2 colunas com tripés, mesa com tripé, 2 microfones com cabo e 2 cabos jack — 100€.",
                "Microfones profissionais sem fios de mão — 35€ cada.",
                "Carrinha KIA Hercules — 100€/dia.",
                "Sistema de luzes para festas caseiras — 50€.",
                "Máquinas de fumo — 30€ cada."
            ]),
            ("Informação em atualização", ["Disponibilidade, caução, responsabilidade e valores atuais devem ser confirmados."])
        ],
        "faq": [
            ("O material é entregue?", "O arquivo indica que o material é levantado e entregue pelo próprio."),
            ("Existe caução?", "O arquivo refere caução histórica de 100€, entregue no final."),
        ],
    },
    {
        "slug": "aprender-instrumento",
        "title": "Aprender Instrumento",
        "kicker": "Academia VoxLaci · Formação musical",
        "description": "Aulas de instrumento, formação musical e classe de conjunto em São Domingos de Rana.",
        "image": "/legacy-media/04218d87e4a5.jpg",
        "category": "Formação",
        "facts": ["Guitarra · Percussão · Teclado/Piano", "Formação musical", "Classe de conjunto"],
        "sections": [
            ("Descrição", [
                "Gostava de aprender um instrumento e evoluir o máximo com o mínimo de deslocações por semana?",
                "O arquivo apresenta a Academia VoxLaci com canto e técnica vocal, guitarra clássica, formação musical, análise, harmonia, piano, percussão e aulas de grupo."
            ]),
            ("Estrutura recuperada", [
                "17h–19h: aulas de instrumento de 30m em grupo.",
                "19h–19h45: formação musical com todos os alunos.",
                "20h–20h30: classe de conjunto com todos os alunos.",
                "Valor mensal histórico: 115€; 85€ para coristas VoxLaci."
            ]),
            ("Informação em atualização", ["Instrumentos disponíveis, horários e valores atuais devem ser confirmados."])
        ],
        "faq": [
            ("Que instrumentos aparecem no arquivo?", "Guitarra, percussão e teclado/órgão/piano, além de formação musical e canto/técnica vocal."),
            ("Existe formação musical?", "Sim. O arquivo inclui formação musical e classe de conjunto.")
        ],
    },
    {
        "slug": "violinos",
        "title": "Violinos da Águilha",
        "kicker": "Aulas de violino · São Domingos de Rana",
        "description": "Workshops e aulas de violino em grupo ou individuais, com informação histórica da professora Paula Fernandes.",
        "image": "/legacy-media/d29ebcc7425f.jpg",
        "category": "Formação",
        "facts": ["Workshop histórico: 20€", "Quintas-feiras", "Professora Paula Fernandes"],
        "sections": [
            ("Descrição", [
                "Gostava de aprender a tocar violino e evoluir semanalmente? O arquivo apresenta o projeto Violinos da Águilha, em São Domingos de Rana, na Torre da Águilha.",
                "Existem opções em grupo e/ou individual."
            ]),
            ("Horários e modalidades recuperadas", [
                "Workshop de 45m: valor histórico de 20€.",
                "Horários: 17h, 18h e 19h.",
                "Grupos de 2 a 10 alunos, aulas de 45 minutos, 1 vez por semana.",
                "Aulas de grupo: 50€ por pacote de 4 aulas.",
                "Aulas individuais: valores históricos entre 50€/mês e 320€/mês, conforme duração semanal.",
                "Aulas privadas avulsas: blocos de 30m / 60€."
            ]),
            ("Professora Paula Fernandes", [
                "Licenciada em Ciências Musicais pela FCSH — Universidade Nova de Lisboa.",
                "Diplomada com Curso Superior de Violino e Curso Geral de Viola.",
                "Docente do Ensino Artístico Especializado da Música.",
                "Professora na Escola de Música Nossa Senhora do Cabo, onde leciona Violino e Iniciação à Orquestra."
            ]),
            ("Informação em atualização", ["Horários, valores e inscrições atuais devem ser confirmados."])
        ],
        "faq": [
            ("É necessário ter instrumento?", "O arquivo indica que não é necessário ter instrumento; caso tenha, pode trazer."),
            ("Há aulas individuais?", "Sim. O arquivo apresenta modalidades individuais e em grupo.")
        ],
        "gallery": ["/legacy-media/d29ebcc7425f.jpg", "/legacy-media/080c93bd75d4.jpg", "/legacy-media/04218d87e4a5.jpg", "/legacy-media/112637cd9c41.jpg"],
    },
    {
        "slug": "guitarras",
        "title": "Guitarras da Águilha",
        "kicker": "Aulas de guitarra · Informação em atualização",
        "description": "Página recuperada do arquivo para Guitarras da Águilha. Parte do texto histórico repete conteúdo de violino e precisa de validação.",
        "image": "/legacy-media/b537c2c47e08.jpg",
        "category": "Formação",
        "facts": ["Workshop histórico: 20€", "Quintas-feiras", "Informação em atualização"],
        "sections": [
            ("Descrição recuperada", [
                "O arquivo contém uma página chamada Guitarras da Águilha.",
                "Contém referência a workshop de 45m, horários 17h, 18h e 19h, grupos máximo de 8 alunos, e indicação “We Speak English”."
            ]),
            ("Informação em atualização", [
                "A página histórica contém texto que parece pertencer a Violinos da Águilha, incluindo a frase “Gostava de aprender a tocar VIOLINO?” e bio da professora Paula Fernandes.",
                "Por esse motivo, metodologia, equipa, preços e descrição específica de guitarra devem ser validados antes de publicação definitiva."
            ])
        ],
        "faq": [
            ("A informação de guitarra está completa?", "Não. A auditoria encontrou repetição provável de conteúdo de violino."),
            ("O que fica publicado?", "Apenas informação real recuperada e a nota “Informação em atualização.” onde faltam dados validados.")
        ],
        "gallery": ["/legacy-media/b537c2c47e08.jpg", "/legacy-media/04218d87e4a5.jpg", "/legacy-media/4ad0b5bc0dfa.jpg"],
    },
    {
        "slug": "servicos-ohana",
        "title": "Serviços “O’Hana”",
        "kicker": "Comunidade · Família VoxLaci",
        "description": "Serviços, materiais e rede interna de apoio da família VoxLaci, recuperados do arquivo histórico.",
        "image": "/legacy-media/dd1ff3745550.jpg",
        "category": "Comunidade",
        "facts": ["Material para coristas", "Rede de serviços", "Informação em atualização"],
        "sections": [
            ("Descrição", [
                "A O’Hana — família — VoxLaci surge da dimensão numerosa da comunidade de coristas e familiares.",
                "A ideia original era juntar oferta e procura de serviços dentro da comunidade."
            ]),
            ("Conteúdo histórico recuperado", [
                "Material para coristas: tablet, capas, teclado, película, canetas, diapasão, phones e outros itens.",
                "Serviços potenciais da comunidade: eletricista, canalizador, carpinteiro, enfermeiro, médico, informático, designer gráfico, explicações, psicologia, babysitter, jardineiro, educador de infância, advogado, limpeza, engomadoria, costura, cozinheiro, mecânico, fisioterapia, entre outros.",
                "Campos sugeridos no arquivo: profissão/serviço, nome, grau de parentesco do corista, coro, telefone, local e custo."
            ]),
            ("Informação em atualização", [
                "Disponibilidade de materiais, regras de listagem, privacidade e submissão de serviços devem ser definidos antes de ativação pública."
            ])
        ],
        "faq": [
            ("O’Hana é um serviço externo?", "O arquivo apresenta O’Hana como rede comunitária interna de serviços e materiais."),
            ("A listagem está ativa?", "A informação está em atualização.")
        ],
    },
    {
        "slug": "academia",
        "title": "Academia VoxLaci",
        "kicker": "Professores que adoram o que fazem",
        "description": "Academia de música com instrumento, formação musical e aula de conjunto, em São Domingos de Rana.",
        "image": "/legacy-media/1d1e72b50ebe.jpg",
        "category": "Formação",
        "facts": ["Instrumento", "Formação musical", "Aula de conjunto"],
        "sections": [
            ("Descrição", [
                "Academia — Professores que adoram o que fazem.",
                "Aprender a ler música é expandir os horizontes emocionais e intelectuais.",
                "Aprender música é como aprender uma nova língua estrangeira: precisa de tempo e dedicação de quem ensina e de quem aprende."
            ]),
            ("Conceito recuperado", [
                "Um aluno que queira aprender um instrumento numa escola de música terá três disciplinas: aula do instrumento, formação musical e aula de conjunto.",
                "O arquivo apresenta instrumentos como guitarra, formação musical, análise, harmonia, piano, percussão e aulas de grupo."
            ]),
            ("Horários e valores históricos", [
                "Terças: 17h–19h aula de instrumento em grupo ou privado.",
                "19h–19h45 formação musical.",
                "20h–20h45 aula de conjunto.",
                "Valores históricos e regras de faltas devem ser confirmados antes de inscrição."
            ])
        ],
        "faq": [
            ("A Academia inclui formação musical?", "Sim. O arquivo inclui formação musical e aula de conjunto."),
            ("Os preços estão atuais?", "Os valores recuperados são históricos e devem ser confirmados.")
        ],
    },
    {
        "slug": "workshop-professores",
        "title": "Workshop Professores",
        "kicker": "Educação · Voz · Bem-estar",
        "description": "Workshops para professores sobre disciplina, saúde mental, voz saudável, motivação e alegria na sala de aula.",
        "image": "/legacy-media/882c49885508.jpg",
        "category": "Formação",
        "facts": ["Myguel Santos e Castro", "Sala de Ensaios VoxLaci", "Informação em atualização"],
        "sections": [
            ("Descrição", [
                "A profissão de professor é essencial para o desenvolvimento da sociedade.",
                "Um professor feliz é vital para a aprendizagem na sala de aula.",
                "Os workshops são liderados por Myguel Santos e Castro, com mais de 30 anos a dirigir coros, fundador do VoxLaci em 1996, e mais de 20 anos a dar aulas em escolas públicas e privadas."
            ]),
            ("Temas históricos recuperados", [
                "A disciplina em salas de aulas.",
                "A Saúde Mental começa na Prevenção.",
                "Técnicas para uma Voz Saudável.",
                "A Motivação e a alegria na Sala de Aula."
            ]),
            ("Informação em atualização", ["Datas futuras, valores e inscrições devem ser confirmados."])
        ],
        "faq": [
            ("Para quem são estes workshops?", "Para professores e escolas, segundo o conteúdo recuperado."),
            ("Quem lidera os workshops?", "O arquivo refere Myguel Santos e Castro.")
        ],
    },
    {
        "slug": "mentoria",
        "title": "Programa de Mentoria VoxLaci",
        "kicker": "Mudar hábitos, transformar o futuro",
        "description": "Programa de mentoria para desenvolver autonomia no estudo, hábitos eficazes, curiosidade e uso responsável de ferramentas de IA.",
        "image": "/legacy-media/b82c67eb7d90.jpg",
        "category": "Mentoria",
        "facts": ["Autonomia no estudo", "Mentores VoxLaci", "ChatGPT · Gemini · Perplexity"],
        "sections": [
            ("Objetivo", [
                "O Programa de Mentoria VoxLaci tem como missão ajudar jovens a desenvolver autonomia no estudo, fornecendo ferramentas eficazes para aprenderem sozinhos.",
                "O objetivo não é que o mentorando dependa do mentor, mas sim que aprenda a ser mentor de si mesmo."
            ]),
            ("O que o programa proporciona", [
                "Eliminação de lacunas no conhecimento através de uma abordagem estruturada.",
                "Desenvolvimento de hábitos de estudo eficazes e métodos de organização.",
                "Estímulo da curiosidade e do gosto pelo saber.",
                "Uso da Inteligência Artificial como ferramenta de apoio, incluindo ChatGPT, Gemini e Perplexity."
            ]),
            ("Estrutura recuperada", [
                "Primeira sessão conduzida pelo diretor artístico e/ou coordenador do programa.",
                "Sessões seguintes conduzidas pelo mentor, seguindo o plano traçado.",
                "Frequência histórica: uma ou duas sessões por semana, segunda-feira e quarta-feira, antes dos ensaios do VoxLaci.",
                "Modalidades individuais e em grupo."
            ]),
            ("Informação em atualização", [
                "Preços, garantia, calendário e equipa atual devem ser confirmados antes de novas inscrições."
            ])
        ],
        "faq": [
            ("Quem pode ser mentor?", "Membros VoxLaci com excelência académica, bons hábitos de estudo e vontade de orientar os mais novos."),
            ("Quem pode ser mentorando?", "Jovens VoxLaci ou pessoas com dificuldades em disciplinas e vontade de aprender a estudar de forma autónoma."),
            ("A IA faz parte do programa?", "Sim. O arquivo refere ChatGPT, Gemini e Perplexity como ferramentas de apoio.")
        ],
        "gallery": ["/legacy-media/b82c67eb7d90.jpg", "/legacy-media/93b0f30da031.jpg"],
    },
    {
        "slug": "loja",
        "title": "Loja",
        "kicker": "Arquivo · Informação em atualização",
        "description": "Página histórica de loja VoxLaci. A informação comercial está em atualização.",
        "image": "/assets/hero-live.jpg",
        "category": "Comunidade",
        "facts": ["Arquivo histórico", "Sem catálogo ativo", "Informação em atualização"],
        "sections": [
            ("Informação em atualização", ["O arquivo contém apenas a indicação “Loja”. Não existem produtos, preços ou condições recuperados nesta auditoria."])
        ],
        "faq": [
            ("A loja está ativa?", "Informação em atualização."),
            ("Existem produtos recuperados do arquivo?", "Não foram encontrados produtos específicos na página de Loja.")
        ],
    },
]


def esc(value):
    return html.escape(value, quote=True)


def jsonld(service):
    page_url = f"https://voxlaci.com/servicos/{service['slug']}/"
    graph = [
        {"@context": "https://schema.org", **ORG},
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "VoxLaci", "item": "https://voxlaci.com/"},
                {"@type": "ListItem", "position": 2, "name": "Serviços", "item": "https://voxlaci.com/servicos/"},
                {"@type": "ListItem", "position": 3, "name": service["title"], "item": page_url},
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": service["title"],
            "description": service["description"],
            "provider": ORG,
            "areaServed": "Cascais, Lisboa, Portugal",
            "serviceType": service["category"],
            "url": page_url,
        },
    ]
    if service.get("faq"):
        graph.append({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
                for q, a in service["faq"]
            ],
        })
    return "\n".join(f'<script type="application/ld+json">{json.dumps(item, ensure_ascii=False)}</script>' for item in graph)


def page(service):
    facts = "".join(f"<div><b>{esc(f.split(':')[0])}</b><span>{esc(f)}</span></div>" for f in service["facts"])
    sections = []
    for title, paragraphs in service["sections"]:
        body = "".join(f"<p>{esc(p)}</p>" for p in paragraphs)
        sections.append(f"<details class=\"legacy-section\" open><summary>{esc(title)}</summary><div>{body}</div></details>")
    gallery = service.get("gallery") or [service["image"]]
    gallery_html = "".join(f'<img src="{esc(src)}" alt="{esc(service["title"])}" loading="lazy">' for src in dict.fromkeys(gallery))
    faq_html = ""
    if service.get("faq"):
        faq_html = "".join(f"<details><summary>{esc(q)}</summary><div><p>{esc(a)}</p></div></details>" for q, a in service["faq"])
    else:
        faq_html = "<p>Informação em atualização.</p>"
    return f"""<!doctype html>
<html lang="pt">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{esc(service['title'])} | Serviços VoxLaci Cascais</title>
  <meta name="description" content="{esc(service['description'])}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://voxlaci.com/servicos/{esc(service['slug'])}/">
  <link rel="stylesheet" href="/subpage.css">
  <link rel="stylesheet" href="/universal-share.css?v=14">
  {jsonld(service)}
</head>
<body>
  <header class="page-nav">
    <a href="/"><img src="/assets/voxlaci-logo-white.png" alt="VoxLaci"></a>
    <nav><a href="/#vozes">Ensembles</a><a href="/eventos/">Eventos e Festivais</a><a href="/servicos/">Serviços</a></nav>
    <a class="cta" href="mailto:info@voxlaci.com?subject=Serviço%20{esc(service['title']).replace(' ', '%20')}">Pedir informação</a>
  </header>
  <main>
    <section class="page-hero">
      <img src="{esc(service['image'])}" alt="{esc(service['title'])}">
      <div class="page-hero-copy">
        <p class="eyebrow">{esc(service['kicker'])}</p>
        <h1>{esc(service['title'])}</h1>
        <p>{esc(service['description'])}</p>
        <div class="page-hero-actions">
          <a class="button primary" href="mailto:info@voxlaci.com?subject=Serviço%20{esc(service['title']).replace(' ', '%20')}">Pedir informação</a>
          <a class="button" href="#conteudo">Ver detalhes ↓</a>
        </div>
      </div>
    </section>
    <section class="intro" id="conteudo">
      <div><p class="eyebrow">Serviços VoxLaci</p><h2>Informação recuperada do arquivo.</h2></div>
      <div class="intro-copy">
        <p>{esc(service['description'])}</p>
        <div class="fact-grid">{facts}</div>
      </div>
    </section>
    <section class="section white">
      <div class="section-head"><p class="eyebrow">Conteúdo histórico organizado</p><h2>{esc(service['title'])}</h2></div>
      <div class="legacy-copy organized">{''.join(sections)}</div>
    </section>
    <section class="section">
      <div class="section-head"><p class="eyebrow">Imagens</p><h2>Arquivo visual.</h2></div>
      <div class="legacy-gallery">{gallery_html}</div>
    </section>
    <section class="section white">
      <div class="section-head"><p class="eyebrow">Perguntas frequentes</p><h2>Informação útil.</h2></div>
      <div class="accordion">{faq_html}</div>
    </section>
    <section class="page-cta">
      <p class="eyebrow">Serviços VoxLaci</p>
      <h2>Quer confirmar disponibilidade?</h2>
      <a class="button primary" href="mailto:info@voxlaci.com?subject=Serviço%20{esc(service['title']).replace(' ', '%20')}">Contactar VoxLaci</a>
    </section>
  </main>
  <footer class="page-footer">
    <div><img src="/assets/voxlaci-logo-white.png" alt="VoxLaci"><p>Cantar. Unir. Inspirar. Transformar.</p></div>
    <div><a href="mailto:info@voxlaci.com">info@voxlaci.com</a><a href="tel:+351925075186">(+351) 925 075 186</a><a href="/servicos/">Voltar aos serviços</a></div>
  </footer>
  <script src="/universal-share.js?v=14" defer></script>
</body>
</html>
"""


def index_page():
    cards = []
    for service in SERVICES:
        cards.append(f"""<a href="/servicos/{esc(service['slug'])}/">
          <span>{esc(service['category'])}</span>
          <h3>{esc(service['title'])}</h3>
          <p>{esc(service['description'])}</p>
        </a>""")
    graph = [
        {"@context": "https://schema.org", **ORG},
        {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Serviços VoxLaci",
            "description": "Serviços musicais, cerimónias, formação, produção e comunidade VoxLaci.",
            "url": "https://voxlaci.com/servicos/",
            "mainEntity": [{"@type": "Service", "name": s["title"], "url": f"https://voxlaci.com/servicos/{s['slug']}/"} for s in SERVICES],
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "VoxLaci", "item": "https://voxlaci.com/"},
                {"@type": "ListItem", "position": 2, "name": "Serviços", "item": "https://voxlaci.com/servicos/"},
            ],
        },
    ]
    scripts = "\n".join(f'<script type="application/ld+json">{json.dumps(item, ensure_ascii=False)}</script>' for item in graph)
    return f"""<!doctype html>
<html lang="pt">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Serviços VoxLaci | Música, cerimónias, formação e produção</title>
  <meta name="description" content="Serviços VoxLaci: casamentos, baptizados, missas, eventos privados, som e luzes, aulas de instrumento, workshops, mentoria e comunidade.">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://voxlaci.com/servicos/">
  <link rel="stylesheet" href="/subpage.css">
  <link rel="stylesheet" href="/universal-share.css?v=14">
  {scripts}
</head>
<body>
  <header class="page-nav">
    <a href="/"><img src="/assets/voxlaci-logo-white.png" alt="VoxLaci"></a>
    <nav><a href="/#vozes">Ensembles</a><a href="/eventos/">Eventos e Festivais</a><a href="/servicos/">Serviços</a></nav>
    <a class="cta" href="mailto:info@voxlaci.com?subject=Serviços%20VoxLaci">Pedir proposta</a>
  </header>
  <main>
    <section class="page-hero">
      <img src="/legacy-media/15cbe6a9bdff.jpg" alt="Serviços VoxLaci">
      <div class="page-hero-copy">
        <p class="eyebrow">Serviços VoxLaci</p>
        <h1>Serviços</h1>
        <p>Música para cerimónias, eventos, formação, produção, mentoria e comunidade — organizado a partir do arquivo histórico VoxLaci.</p>
        <div class="page-hero-actions"><a class="button primary" href="#servicos">Explorar serviços</a></div>
      </div>
    </section>
    <section class="intro">
      <div><p class="eyebrow">Visão geral</p><h2>Uma comunidade que também cria serviços.</h2></div>
      <div class="intro-copy">
        <p>Esta secção reúne serviços encontrados no arquivo VoxLaci. Quando a informação histórica não é suficiente ou pode estar desatualizada, a página indica claramente “Informação em atualização.”</p>
        <div class="fact-grid"><div><b>Cerimónias</b><span>Casamentos, baptizados e missas.</span></div><div><b>Formação</b><span>Instrumentos, academia, workshops e mentoria.</span></div><div><b>Produção</b><span>Eventos privados, som e luzes.</span></div></div>
      </div>
    </section>
    <section class="section dark" id="servicos">
      <div class="section-head"><p class="eyebrow">Serviços encontrados</p><h2>Escolha o serviço.</h2></div>
      <div class="event-directory">{''.join(cards)}</div>
    </section>
    <section class="page-cta">
      <p class="eyebrow">Serviços VoxLaci</p>
      <h2>Precisa de ajuda a escolher?</h2>
      <a class="button primary" href="mailto:info@voxlaci.com?subject=Serviços%20VoxLaci">Falar com a VoxLaci</a>
    </section>
  </main>
  <footer class="page-footer">
    <div><img src="/assets/voxlaci-logo-white.png" alt="VoxLaci"><p>Cantar. Unir. Inspirar. Transformar.</p></div>
    <div><a href="mailto:info@voxlaci.com">info@voxlaci.com</a><a href="tel:+351925075186">(+351) 925 075 186</a><a href="/">Voltar ao site</a></div>
  </footer>
  <script src="/universal-share.js?v=14" defer></script>
</body>
</html>
"""


def main():
    (ROOT / "servicos").mkdir(exist_ok=True)
    (ROOT / "servicos" / "index.html").write_text(index_page(), encoding="utf-8")
    for service in SERVICES:
        if service["slug"] in PROTECTED:
            continue
        folder = ROOT / "servicos" / service["slug"]
        folder.mkdir(parents=True, exist_ok=True)
        (folder / "index.html").write_text(page(service), encoding="utf-8")


if __name__ == "__main__":
    main()
