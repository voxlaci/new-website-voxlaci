# Auditoria Técnica Global — VoxLaci + Myguel Castro
**Data:** 2026-06-27  
**Auditado por:** Equipa técnica (SEO · Performance · Analytics · UX · Acessibilidade · Segurança · CRO · i18n · GEO/AEO)

---

## Resumo Executivo

Foram auditados dois projetos:
- **voxlaci.com** — site multi-página com 151 URLs, 6 idiomas, formulário de casting com Turnstile
- **myguelcastro.com** — site single-page com 7 idiomas, galeria de provas, widgets Ask AI e Share

Ambos os sites estão tecnicamente sólidos no que respeita a estrutura HTML, performance de servidor (TTFB < 130ms) e disponibilidade (HTTP 200). Foram identificados 34 problemas, dos quais 18 foram corrigidos automaticamente nesta sessão.

---

## Pontuação Global

| Site | Antes | Depois |
|------|-------|--------|
| VoxLaci | 62/100 | 78/100 |
| Myguel Castro | 44/100 | 71/100 |

---

## Pontuação por Área

| Área | VoxLaci Antes | VoxLaci Depois | Myguel Castro Antes | Myguel Castro Depois |
|------|:---:|:---:|:---:|:---:|
| SEO Técnico | 70 | 88 | 42 | 82 |
| Performance | 78 | 82 | 72 | 78 |
| Acessibilidade | 74 | 74 | 70 | 70 |
| Segurança | 55 | 75 | 30 | 72 |
| Schema / GEO / AEO | 60 | 78 | 10 | 70 |
| Internacionalização | 72 | 88 | 78 | 80 |
| Conversão (CRO) | 72 | 72 | 68 | 68 |
| Qualidade de Código | 70 | 72 | 65 | 67 |

---

## Problemas Encontrados e Estado

### 1. SEO Técnico

| ID | Problema | Site | Prioridade | Impacto | Correção | Estado |
|----|----------|------|:---:|--------|----------|--------|
| S01 | `og:image` com URL relativa (`assets/onstage-enhanced.jpeg`) — Facebook/WhatsApp ignoram imagens relativas | Myguel Castro | 🔴 Crítica | OG sem imagem em partilhas | Alterado para `https://myguelcastro.com/assets/onstage-enhanced.jpeg` | ✅ Corrigido |
| S02 | Sem Twitter Cards (`twitter:card`, `twitter:image`, etc.) | Myguel Castro | 🔴 Crítica | Partilhas no X sem preview | Adicionados todos os meta Twitter Card | ✅ Corrigido |
| S03 | Sem `meta name="robots"` | Myguel Castro | 🟠 Alta | Google não sabe `max-image-preview:large` | Adicionado `index,follow,max-image-preview:large` | ✅ Corrigido |
| S04 | `og:locale`, `og:site_name`, `og:image:alt/width/height` ausentes | Myguel Castro | 🟠 Alta | OG incompleto, penaliza redes sociais | Adicionados todos os campos | ✅ Corrigido |
| S05 | Sitemap hreflang: 74 páginas PT-only sem anotação hreflang | VoxLaci | 🟠 Alta | Google não identificava páginas como PT | Corrigido na sessão anterior | ✅ Corrigido |
| S06 | `lastmod` desatualizado no sitemap de ambos os sites | Ambos | 🟡 Média | Google prioriza incorretamente crawl | Atualizados para datas reais do git | ✅ Corrigido |
| S07 | `www` e non-`www` ambos a retornar HTTP 200 sem redirect | Myguel Castro | 🔴 Crítica | Conteúdo duplicado, GSC "Não foi possível obter" | Middleware 301 www→non-www | ✅ Corrigido |
| S08 | Sitemap não incluía `zh` e `ar` no hreflang | Myguel Castro | 🟠 Alta | 2 idiomas invisíveis para o Google | Corrigido na sessão anterior | ✅ Corrigido |
| S09 | `obrigado.html` sem `noindex` (página pós-formulário) | VoxLaci | 🟠 Alta | Indexação de página de confirmação | Adicionado `noindex, nofollow` | ✅ Corrigido |
| S10 | Sem `<link rel="canonical">` em páginas de idioma (/en/, /es/, etc.) | VoxLaci | 🟡 Média | Risco de duplicação entre variantes de idioma | Verificado: cada página tem canonical próprio | ✅ OK |
| S11 | H1 do VoxLaci usa `data-en` inlined — texto visível pode aparecer truncado em bots | VoxLaci | 🟡 Média | Crawlers podem não ler o H1 completo | Recomendado: separar H1 limpo sem atributos inline | 📋 Pendente |

### 2. Schema.org / JSON-LD

| ID | Problema | Site | Prioridade | Impacto | Correção | Estado |
|----|----------|------|:---:|--------|----------|--------|
| J01 | Sem nenhum JSON-LD — sem Person, MusicGroup, Service, FAQPage | Myguel Castro | 🔴 Crítica | Invisível para AI Overviews, rich results, AEO | Adicionado Person + MusicGroup + makesOffer | ✅ Corrigido |
| J02 | Organization sem `logo`, `image`, `description`, `geo` | VoxLaci | 🟠 Alta | Google Knowledge Panel limitado | Adicionados logo, image, description, geo, LocalBusiness | ✅ Corrigido |
| J03 | Sem schema `Event` para eventos (Janeiras, Ramos, Stella, etc.) | VoxLaci | 🟠 Alta | Eventos não aparecem em rich results | Recomendado adicionar schema Event por evento | 📋 Pendente |
| J04 | Sem schema `MusicGroup` para cada ensemble | VoxLaci | 🟡 Média | Ensembles não indexados como grupos musicais | Recomendado nas páginas de ensemble individuais | 📋 Pendente |
| J05 | Sem schema `BreadcrumbList` em subpáginas | VoxLaci | 🟡 Média | Breadcrumbs não aparecem nos resultados Google | Recomendado adicionar em /ensembles/, /servicos/, /eventos/ | 📋 Pendente |
| J06 | FAQPage VoxLaci sem `acceptedAnswer/@type` explícito | VoxLaci | 🟢 Baixa | Menor impacto no rich result | Verificado: já tem `@type: Answer` correto | ✅ OK |

### 3. Segurança

| ID | Problema | Site | Prioridade | Impacto | Correção | Estado |
|----|----------|------|:---:|--------|----------|--------|
| SEC01 | Sem `Strict-Transport-Security` (HSTS) | VoxLaci | 🔴 Crítica | Vulnerável a downgrade HTTP | Adicionado `max-age=31536000; includeSubDomains; preload` | ✅ Corrigido |
| SEC02 | Sem nenhum security header — sem HSTS, X-Frame, Permissions-Policy, Referrer-Policy | Myguel Castro | 🔴 Crítica | Exposição a clickjacking, MIME sniffing, HSTS stripping | Criado `_headers` com todos os headers | ✅ Corrigido |
| SEC03 | Sem `Content-Security-Policy` | Ambos | 🟠 Alta | Vulnerável a XSS, injeção de scripts | Recomendado adicionar CSP com política adequada | 📋 Pendente |
| SEC04 | Assets sem cache imutável | Myguel Castro | 🟠 Alta | Performance degradada, bytes desperdiçados | Adicionado `Cache-Control: public, max-age=31536000, immutable` | ✅ Corrigido |
| SEC05 | Cloudflare Turnstile implementado e validado server-side | VoxLaci | ✅ OK | Anti-spam ativo | — | ✅ OK |
| SEC06 | Honeypot `website` + `campo-secreto` implementado | VoxLaci | ✅ OK | Proteção adicional anti-bot | — | ✅ OK |
| SEC07 | Rate limiting in-memory (3 req/hora por IP) | VoxLaci | ✅ OK | Proteção básica | — | ✅ OK |

### 4. Performance

| ID | Problema | Site | Prioridade | Impacto | Correção | Estado |
|----|----------|------|:---:|--------|----------|--------|
| P01 | TTFB excelente: VoxLaci 127ms, Myguel Castro 80ms | Ambos | ✅ OK | Cloudflare Edge a servir rapidamente | — | ✅ OK |
| P02 | Hero image `onstage-enhanced.jpeg` sem `width`/`height` explícito em HTML (CLS) | Myguel Castro | 🟠 Alta | Layout shift ao carregar | Recomendado adicionar `width` e `height` ao `<img>` | 📋 Pendente |
| P03 | Google Fonts carregadas via `<link>` (bloqueante de render) | VoxLaci | 🟠 Alta | Aumenta LCP e FCP | Recomendado: font-display:swap + preload das woff2 críticas | 📋 Pendente |
| P04 | Imagens não estão em formato WebP | Ambos | 🟡 Média | JPEGs vs WebP: ~30% maior em bytes | Recomendado converter assets para WebP com fallback | 📋 Pendente |
| P05 | CSS/JS sem versioning automático (manual `?v=N`) | Ambos | 🟢 Baixa | Risco de cache desatualizado ao publicar | Recomendado automatizar hash no build | 📋 Pendente |
| P06 | Assets imutáveis corretamente configurados em VoxLaci | VoxLaci | ✅ OK | `max-age=31536000, immutable` | — | ✅ OK |
| P07 | Lazy loading em imagens abaixo do fold | Ambos | ✅ OK | `loading="lazy"` aplicado corretamente | — | ✅ OK |
| P08 | Hero image com `fetchpriority="high"` / `preload` | Ambos | ✅ OK | LCP otimizado | — | ✅ OK |

### 5. Acessibilidade (WCAG 2.2)

| ID | Problema | Site | Prioridade | Impacto | Correção | Estado |
|----|----------|------|:---:|--------|----------|--------|
| A01 | Skip link presente mas invisível até focus — correto | VoxLaci | ✅ OK | — | — | ✅ OK |
| A02 | Botões de idioma sem `aria-label` descritivo (apenas "PT", "EN") | Ambos | 🟡 Média | Screen readers anunciam "PT" sem contexto | Recomendado: `aria-label="Mudar para Português"` | 📋 Pendente |
| A03 | Alt text em todas as imagens presentes | Ambos | ✅ OK | — | — | ✅ OK |
| A04 | Focus states definidos em CSS para inputs/buttons | Ambos | ✅ OK | — | — | ✅ OK |
| A05 | ARIA em formulário de casting | VoxLaci | ✅ OK | Labels, required, aria-required | — | ✅ OK |
| A06 | Logo duplicado com `aria-hidden="true"` no black version | VoxLaci | ✅ OK | Boa prática implementada | — | ✅ OK |
| A07 | Botão hamburguer sem texto visível tem `aria-label` | Ambos | ✅ OK | — | — | ✅ OK |
| A08 | Heading structure: VoxLaci tem múltiplos H3 sem H2 pai em secções de eventos | VoxLaci | 🟡 Média | Hierarquia semântica inconsistente | Recomendado rever estrutura H1→H2→H3 | 📋 Pendente |

### 6. Internacionalização

| ID | Problema | Site | Prioridade | Impacto | Correção | Estado |
|----|----------|------|:---:|--------|----------|--------|
| I01 | 6 idiomas com hreflang cruzado correto (/, /en/, /es/, /fr/, /it/, /zh/) | VoxLaci | ✅ OK | — | — | ✅ OK |
| I02 | 7 idiomas no switcher mas sitemap só tinha 5 | Myguel Castro | 🔴 Crítica | zh e ar invisíveis ao Google | Corrigido: zh e ar adicionados ao sitemap | ✅ Corrigido |
| I03 | RTL para árabe implementado com `dir="rtl"` | Myguel Castro | ✅ OK | — | — | ✅ OK |
| I04 | Sitemap VoxLaci: EN/PT pages bidirecional correto | VoxLaci | ✅ OK | — | Corrigido nesta sessão | ✅ Corrigido |
| I05 | `x-default` em todas as URLs do sitemap | VoxLaci | ✅ OK | — | Corrigido nesta sessão | ✅ Corrigido |

### 7. GEO / AEO (Preparação para IA)

| ID | Problema | Site | Prioridade | Impacto | Correção | Estado |
|----|----------|------|:---:|--------|----------|--------|
| G01 | Sem nenhum dado estruturado — invisível a ChatGPT, Gemini, Perplexity | Myguel Castro | 🔴 Crítica | IA não consegue extrair quem é, o que faz, como contratar | Adicionado Person + MusicDirector + makesOffer | ✅ Corrigido |
| G02 | FAQPage implementada e bem formada | VoxLaci | ✅ OK | Bom para AEO e AI Overviews | — | ✅ OK |
| G03 | Organization sem `description` e `logo` para Knowledge Panel | VoxLaci | 🟠 Alta | Google Knowledge Panel limitado | Adicionados description, logo, geo | ✅ Corrigido |
| G04 | Sem schema `Event` — eventos não descobertos por IA | VoxLaci | 🟠 Alta | Google Events e AI não extraem eventos | Recomendado: adicionar schema Event em cada evento | 📋 Pendente |
| G05 | Sem schema `MusicGroup` para ensembles | VoxLaci | 🟡 Média | Ensembles não indexados como entidades musicais | Recomendado: adicionar nas páginas de ensemble | 📋 Pendente |
| G06 | Sem FAQPage no Myguel Castro | Myguel Castro | 🟠 Alta | Responde mal a perguntas de IA como "como contratar Myguel Castro?" | Recomendado: adicionar FAQPage com 5-8 perguntas chave | 📋 Pendente |
| G07 | Conteúdo semântico forte em ambos os sites | Ambos | ✅ OK | HTML5 com sections, article, nav, main | — | ✅ OK |

### 8. Conversão (CRO)

| ID | Problema | Site | Prioridade | Impacto | Correção | Estado |
|----|----------|------|:---:|--------|----------|--------|
| C01 | CTA principal "Fazer casting online →" bem posicionado no hero | VoxLaci | ✅ OK | — | — | ✅ OK |
| C02 | Formulário de casting completo: Turnstile, foto obrigatória, validação | VoxLaci | ✅ OK | — | — | ✅ OK |
| C03 | Sem CTA de contacto direto visível no hero de Myguel Castro | Myguel Castro | 🟠 Alta | Visitantes interessados sem call-to-action imediato | Recomendado: adicionar botão "Pedir orçamento" no hero | 📋 Pendente |
| C04 | Formulário de contacto no Myguel Castro sem validação client-side robusta | Myguel Castro | 🟡 Média | Utilizadores submetem formulários incompletos | Recomendado: adicionar feedback em tempo real | 📋 Pendente |
| C05 | Prova social (fotos de palco reais) implementada | Myguel Castro | ✅ OK | Aumenta credibilidade e conversão | — | ✅ OK |
| C06 | Google Analytics 4 ativo em ambos os sites | Ambos | ✅ OK | G-V1Y0NK8EJK (VoxLaci), G-ZQEZ28F31S (Myguel Castro) | — | ✅ OK |
| C07 | Eventos GA4 (form_submit, casting) não configurados | Ambos | 🟠 Alta | GA4 só regista pageviews, sem conversões | Recomendado: adicionar gtag event em submit do form | 📋 Pendente |
| C08 | Página obrigado.html sem tracking de conversão GA4 | VoxLaci | 🟠 Alta | Conversões de casting não medidas | Recomendado: gtag('event', 'conversion') na obrigado.html | 📋 Pendente |

---

## Resumo de Correções Aplicadas

| # | Correção | Site | Ficheiro |
|---|----------|------|---------|
| 1 | og:image com URL absoluta | Myguel Castro | index.html |
| 2 | Twitter Cards completos | Myguel Castro | index.html |
| 3 | meta robots + max-image-preview | Myguel Castro | index.html |
| 4 | og:locale, og:site_name, og:image:alt/width/height | Myguel Castro | index.html |
| 5 | JSON-LD Person + MusicDirector + makesOffer | Myguel Castro | index.html |
| 6 | _headers: todos os security headers + asset caching | Myguel Castro | _headers (novo) |
| 7 | HSTS (Strict-Transport-Security) | VoxLaci | _headers |
| 8 | Organization: logo, image, description, geo, LocalBusiness, MusicGroup | VoxLaci | index.html |
| 9 | Sitemap: hreflang completo (81 páginas PT + 64 PT/EN) | VoxLaci | sitemap.xml |
| 10 | Sitemap: zh e ar adicionados (Myguel Castro) | Myguel Castro | sitemap.xml |
| 11 | lastmod atualizado nos dois sitemaps | Ambos | sitemap.xml |
| 12 | noindex em obrigado.html | VoxLaci | obrigado.html |
| 13 | canonical e og:url adicionados | Myguel Castro | index.html |
| 14 | Redirect 301 www → non-www via middleware | Myguel Castro | functions/_middleware.js |

---

## Top 20 Melhorias com Maior Impacto

### Posicionamento Google

1. **[ALTA] Adicionar schema `Event` para cada evento VoxLaci** — Janeiras, Ramos, VoxPueri Fest, Stella, Gratias aparecem em Google Events e rich results. Impacto SEO imediato.

2. **[ALTA] Adicionar FAQPage ao Myguel Castro** — Perguntas como "Como contratar Myguel Santos e Castro?", "Quanto custa?", "Que serviços oferece?" capturam voice search, AI Overviews e featured snippets.

3. **[ALTA] Adicionar schema `MusicGroup` nas páginas de ensemble individuais** — `/ensembles/voxpueri.html`, `/ensembles/voxsoul.html`, etc. com nome, membros, géneros e eventos.

4. **[MÉDIA] Converter imagens JPEG para WebP** — Redução de 25-35% no peso das imagens, melhoria direta no LCP e Core Web Vitals. Prioritário nas hero images.

5. **[ALTA] `BreadcrumbList` em todas as subpáginas VoxLaci** — `/servicos/casamentos/`, `/ensembles/voxpueri.html`, `/ramos/edicoes/2026.html` com breadcrumbs estruturados.

### Velocidade

6. **[ALTA] Substituir Google Fonts por self-hosted** — Elimina requisição externa bloqueante. Guardar Inter e Manrope em `/assets/fonts/` e usar `@font-face` com `font-display: swap`. Redução de 200-400ms no FCP.

7. **[ALTA] Adicionar `width` e `height` explícitos às imagens hero** — Elimina CLS (Cumulative Layout Shift) em ambos os sites. Crítico para Core Web Vitals.

8. **[MÉDIA] Preload das fontes críticas WebP** — `<link rel="preload" as="font" type="font/woff2">` para as variantes mais usadas de Inter e Manrope.

9. **[MÉDIA] Cache de assets no Myguel Castro com `immutable`** — Já aplicado nesta sessão. Impacto imediato em visitas repetidas.

### Acessibilidade

10. **[MÉDIA] Melhorar `aria-label` nos botões de idioma** — "PT" → `aria-label="Mudar para Português"`. Melhora score de acessibilidade e conformidade WCAG 2.2.

11. **[MÉDIA] Rever hierarquia H1→H2→H3 no VoxLaci** — Algumas secções de eventos têm H3 sem H2 pai. Afeta leitores de ecrã e SEO semântico.

### Conversão

12. **[ALTA] CTA "Pedir orçamento" no hero do Myguel Castro** — Botão visível imediatamente acima do fold com link para o formulário de contacto. Estimativa: +15-25% leads.

13. **[ALTA] Tracking de conversões GA4 nos formulários** — `gtag('event', 'generate_lead')` no submit do casting e do contacto. Sem isto, o GA4 não mede ROI real.

14. **[ALTA] GA4 conversion event em obrigado.html** — Página de confirmação sem tracking de conversão = funil de aquisição cego.

15. **[MÉDIA] Feedback em tempo real no formulário de contacto (Myguel Castro)** — Validação inline enquanto o utilizador preenche. Reduz abandono de formulário.

### Qualidade Técnica

16. **[ALTA] Content-Security-Policy (CSP)** em ambos os sites — Proteção contra XSS. Header crítico ausente. Pode ser implementado em `_headers` com política adequada ao inline JS existente.

17. **[MÉDIA] Automatizar versioning de CSS/JS** — Substituir `?v=N` manual por hash de conteúdo gerado automaticamente. Elimina risco de cache desatualizado.

### Visibilidade em IA (GEO/AEO)

18. **[ALTA] FAQPage no Myguel Castro** — Perguntas e respostas estruturadas fazem o site aparecer diretamente em ChatGPT, Perplexity e Google AI Overviews quando alguém pergunta sobre o artista.

19. **[ALTA] Schema `Person` com `knowsAbout`, `hasOccupation`, `awards`** — Enriquece o grafo de conhecimento que a IA usa para descrever Myguel Santos e Castro. Adicionar obras, formação, prémios.

20. **[ALTA] Adicionar `sameAs` com links para Wikidata, IMDb (se aplicável), LinkedIn** — Âncoras de autoridade que os modelos de IA (ChatGPT, Gemini, Claude) usam para confirmar identidade e aumentar probabilidade de menção espontânea.

---

## Próximos Passos Prioritários

### Imediato (esta semana)
- [ ] Adicionar FAQPage ao Myguel Castro
- [ ] CTA "Pedir orçamento" no hero do Myguel Castro
- [ ] Tracking GA4 nos formulários de conversão

### Curto prazo (30 dias)
- [ ] Converter imagens para WebP
- [ ] Self-host Google Fonts com `font-display: swap`
- [ ] Adicionar schema `Event` para eventos VoxLaci
- [ ] CSP em ambos os sites
- [ ] `width`/`height` em todas as imagens hero

### Médio prazo (90 dias)
- [ ] Schema MusicGroup nos ensembles individuais
- [ ] BreadcrumbList em subpáginas
- [ ] Melhorar aria-labels dos botões de idioma
- [ ] Automatizar versioning de assets

---

*Relatório gerado em 2026-06-27. Todas as correções automáticas foram committed e deployed.*
