# EVENTS_ARCHIVE_AUDIT.md

Auditoria da secção **Eventos VoxLaci** realizada sobre o repositório local.

Data: 2026-07-01

## Objetivo

Reorganizar a área de Eventos, usando informação real existente no arquivo histórico VoxLaci, sem inventar dados e sem alterar áreas protegidas como casting, Resend, emails, Analytics, Search Console, sitemap, robots, identidade visual ou design geral.

## Fontes pesquisadas

Foram pesquisadas referências em:

- `/eventos/`
- `/ramos/`
- `/voxpop/`
- `/cascaisvoxpop/`
- `/lisboavoxpop/`
- `/portovoxpop/`
- `/monopolivoxpop/`
- `/londonvoxpop/`
- `/dakarvoxpop/`
- `/barbershop/`
- `/gratias/`
- `/dakar-singing-festival/`
- `/assets/`
- `/legacy-media/`
- `index.html`
- `script.js`
- páginas HTML antigas e páginas recuperadas do arquivo.

## Eventos encontrados

| Evento | Tipo | Ficheiros de origem | Imagens usadas | Estado da informação |
|---|---|---|---|---|
| Janeiras | Tradição / janeiro | `eventos/janeiras/index.html`, `eventos/agenda/index.html` | `assets/event-janeiras.jpg` | Informação parcial: tradição e referências em agenda. |
| RAMOS · Palm Sunday Festival | Festival internacional | `ramos/index.html`, `ramos/arquivo-completo/index.html`, `ramos-edition.js` | `assets/ramos/felicia-barber-2027.jpg` | Informação extensa já organizada na área RAMOS. |
| VoxPueri Festival | Festival infantil | `eventos/voxpueri-fest/index.html` | `assets/event-puerifest.jpg` | Informação substancial PT/EN: datas, idades, local, estrutura, preços e objetivos. |
| Reis | Tradição / Epifania | `eventos/reis/index.html` | `assets/event-reis.jpg` | Informação substancial sobre origem simbólica, tradição e continuidade. |
| STELLA | Natal / comunidades | `eventos/stella/index.html` | `assets/event-stella.jpg` | Informação curta PT/EN: festival antes do Natal, religiões e comunidades. |
| Gratias | Gratidão / concerto | `gratias/index.html` | `assets/event-gratias.jpg` | Informação insuficiente; página recuperada existe. |
| Deuses | Criação coral / espetáculo | `index.html`, `script.js` | `assets/event-deuses.jpg` | Informação parcial: card existente no site com descrição breve. |
| Barbershop College | Formação / harmonia | `barbershop/index.html` | `assets/event-barbershop.jpg` | Informação extensa: edições, bilhetes, sessões, convidados, alojamento e programa. |
| Dia Mundial da Música | Celebração / 1 outubro | `index.html`, `eventos/index.html` | `assets/event-worldmusic.jpg` | Informação parcial: celebração da música como linguagem universal. |
| VoxAround | Intercâmbio | `eventos/voxaround/index.html` | `assets/event-voxaround.jpg` | Informação incompleta: página antiga só indica “Informações disponíveis brevemente.” |
| Conductor’s MOB | Maestros | `eventos/conductors-mob/index.html` | `assets/event-conductors.jpg` | Informação incompleta: página antiga só indica “Informações disponíveis brevemente.” |
| voX±Pop | Eventos internacionais | `voxpop/index.html` e páginas por cidade | `legacy-media/3e18580f3c59.jpg` | Informação substancial: conceito, cidades, taxa base, formas de participação e add-ons. |
| Dakar Singing Festival | Internacional / RAMOS Journey | `dakar-singing-festival/index.html` | `legacy-media/2d6d25edea61.jpg` | Informação substancial PT/EN: sinopse, ensaios, concertos, chegada, direção artística e repertório. |
| Música de Segunda | Série musical | `index.html`, `script.js` | `assets/event-worldmusic.jpg` | Informação parcial; precisa de dados reais adicionais. |
| Agenda | Arquivo cronológico | `eventos/agenda/index.html` | `assets/hero-live.jpg` | Informação extensa em formato cronológico de eventos passados. |

## Nova estrutura criada

- `/eventos/`
- `/eventos/janeiras/`
- `/eventos/ramos/`
- `/eventos/voxpueri-festival/`
- `/eventos/reis/`
- `/eventos/stella/`
- `/eventos/gratias/`
- `/eventos/deuses/`
- `/eventos/barbershop-college/`
- `/eventos/dia-mundial-da-musica/`
- `/eventos/voxaround/`
- `/eventos/conductors-mob/`
- `/eventos/voxpop/`
- `/eventos/dakar-singing-festival/`
- `/eventos/musica-de-segunda/`
- `/eventos/agenda/`

## Informação incompleta

As seguintes páginas mostram “Informação em atualização.” onde o arquivo não tinha dados suficientes:

- Gratias
- Deuses
- VoxAround
- Conductor’s MOB
- Música de Segunda
- Dia Mundial da Música
- Janeiras

## Preservação do arquivo

As páginas antigas fora de `/eventos/` foram usadas como fontes e mantidas como referências históricas, incluindo:

- `/ramos/`
- `/voxpop/`
- `/cascaisvoxpop/`
- `/lisboavoxpop/`
- `/portovoxpop/`
- `/monopolivoxpop/`
- `/londonvoxpop/`
- `/dakarvoxpop/`
- `/barbershop/`
- `/gratias/`
- `/dakar-singing-festival/`

## SEO / IA

Implementado nas novas páginas:

- meta title;
- meta description;
- canonical;
- Open Graph básico;
- Organization schema;
- CollectionPage schema na página principal;
- Event/CreativeWork schema nas páginas individuais;
- BreadcrumbList schema nas páginas individuais;
- links internos para arquivo, páginas antigas e casting.

## Idiomas

A secção Eventos usa o mesmo sistema local da secção Projetos:

- `data-pt`
- `data-en`
- `data-es`
- `data-fr`
- `data-it`
- `data-zh`

Quando há conteúdo histórico real, foi feita tradução fiel e clara. Quando faltam dados, mantém-se “Informação em atualização.”.

## Oportunidades futuras

- Completar Gratias, VoxAround, Conductor’s MOB, Música de Segunda e Dia Mundial da Música com dados reais.
- Criar páginas internas específicas para cada cidade voX±Pop dentro de `/eventos/voxpop/` se necessário.
- Acrescentar galerias específicas por evento quando as imagens forem identificadas com segurança.
- Atualizar sitemap numa tarefa própria, pois sitemap/robots estavam protegidos nesta intervenção.
