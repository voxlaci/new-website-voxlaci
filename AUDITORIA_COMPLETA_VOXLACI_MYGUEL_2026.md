# Auditoria completa VoxLaci + Myguel Castro — 2026

Data: 3 de novembro de 2026  
Âmbito: voxlaci.com e myguelcastro.com, com prioridade aos formulários de Casting e Team Building.

## Resumo executivo

- O Casting VoxLaci passa a guardar a candidatura antes dos emails, atribuir um identificador único, impedir duplicados e registar separadamente a aceitação do email interno e da confirmação ao candidato.
- O formulário Team Building deixa de devolver falso sucesso quando o email interno falha. A falha é apresentada ao utilizador e existe fallback explícito por email.
- Os novos logs não incluem nome, email, telefone, mensagem, IP ou outros dados pessoais completos.
- Testes: 8/8 VoxLaci e 3/3 Myguel aprovados.
- SEO técnico: nenhum ficheiro sem um único title nos 221 HTML VoxLaci e 18 HTML Myguel analisados.
- Não foi encontrada qualquer imagem sem atributo alt. O alerta GetVeritas de uma imagem sem alt repetida em 25 páginas não foi reproduzido.
- Os sitemaps são XML válido e os dois sites já têm HSTS, CSP, proteção contra framing, nosniff, política de referência e política de permissões.
- Limitação: sem acesso aos painéis Resend, Search Console, Bing e GA4, não é possível provar entrega final de email, indexação ou eventos em Realtime.

## A. Casting VoxLaci

### Estado e arquitetura

- Formulário multilingue PT, EN, ES, FR, IT e ZH.
- Endpoint Cloudflare: functions/enviar-casting.js.
- Persistência existente: Cloudflare D1, tabela casting_applications.
- Email interno: info@voxlaci.com, com Reply-To do candidato.
- Confirmação ao candidato inclui os campos submetidos; o comprovativo não é reenviado.
- Upload permitido: PDF ou imagem, máximo 8 MB.

### Problemas encontrados

1. A página de obrigado emitia conversão apenas por ser aberta.
2. O ID aceite pela Resend não era guardado.
3. Não havia estado persistente para distinguir email interno aceite, confirmação aceite e falha parcial.
4. Não havia idempotência para duplo clique.
5. Uma falha da confirmação ao candidato não era comunicada com clareza.
6. O Turnstile usa a site key pública de teste e não existe TURNSTILE_SECRET_KEY no ambiente Cloudflare; sem o segredo, a validação no servidor é permissiva.

### Correções

- Criado submission_key único por tentativa.
- Estados: pending, internal_accepted, accepted, candidate_failed e internal_failed.
- Guardados os IDs Resend aceites, sem conteúdo adicional.
- Duplo clique é suprimido; uma tentativa cujo email interno falhou pode ser repetida.
- A candidatura é inserida antes do envio.
- Falha interna produz erro detetável; falha apenas da confirmação preserva a candidatura e informa que não deve ser reenviada.
- casting_submit é emitido no submit validado; casting_confirmed só após retorno associado à mesma sessão.
- Removidos “Lorem ipsum / John Doe” de seis páginas históricas.

### Alteração D1

Adicionados, sem apagar nem modificar candidaturas existentes:

- submission_key
- notification_status
- internal_email_id
- candidate_email_id
- notification_error
- índice único parcial de submission_key

A base tinha 9 candidaturas e manteve os dados. O histórico d1_migrations estava vazio apesar de as tabelas antigas existirem; por segurança não se reaplicaram migrações antigas. Aplicou-se apenas a alteração aditiva 0012.

### Testes e Resend

- Sucesso com dois emails aceites e estados gravados.
- Falha parcial com email interno aceite e confirmação rejeitada; candidatura preservada.
- Testes Stripe existentes: pagamento único EUR 20, cartão/MB WAY, assinatura do webhook e rejeição de simulação por URL.
- Resultado: 8/8 aprovados.

Confirmado: RESEND_API_KEY existe como segredo Cloudflare; o código exige resposta HTTP de sucesso e ID Resend.  
Não verificável: delivered, bounced, rejected, complaints, suppressed, SPF, DKIM, DMARC e limites da conta. Aceite pela API não significa entregue na caixa.

## B. Team Building Myguel

### Problemas e correções

- Antes, uma falha interna podia devolver sucesso. Agora devolve 502; ausência da chave devolve 503.
- Logs deixaram de conter lead completo, IP e user agent.
- lead_form_submit só é emitido após sucesso do endpoint.
- A tentativa prévia chama-se team_building_form_attempt.
- Abertura de mailto passou a contact_form_open_email, não conversão.
- Removido o catch-all 200 que criava soft 404; redirects específicos foram preservados.
- Resultado: 3/3 testes aprovados.

Risco residual: sem armazenamento persistente, indisponibilidade da Resend e abandono do fallback podem perder o pedido. Não foi criada base de dados pessoal. Recomenda-se desenhar fila/D1 com base legal, retenção e controlo de acesso antes de implementar.

## C. SEO

- VoxLaci: 221 HTML; 0 problemas de contagem de title; 0 imagens sem alt.
- Myguel: 18 HTML; 0 problemas de title, canonical, H1, alt ou links internos no scanner.
- Descriptions em falta no VoxLaci concentram-se em páginas técnicas, redirects, templates e noindex.
- /orador/ redireciona por 301 para /orador-motivacional/ e não está no sitemap.
- Quatro páginas ainda têm avisos editoriais de informação em atualização. Não se inventou conteúdo.
- Existem testemunhos identificados apenas por nome/inicial cuja origem não pôde ser comprovada; devem ser validados documentalmente.

URLs prioritários VoxLaci: homepage, /ensembles/, /coro-cascais/, /servicos/, /eventos/, /ramos/ e /eventos/voxpop/.  
URLs prioritários Myguel: homepage, /team-building/, /orador-motivacional/, /direcao-coral/, /consultoria/ e /en/team-building/.

## D. Performance

- Não foi possível executar PageSpeed Insights nem obter CrUX; não se apresenta pontuação inventada.
- O alerta “homepage acima de 2,5 s” não pode ser confirmado sem Lighthouse/CrUX nas mesmas condições.
- VoxLaci contém dois vídeos STELLA de 10–11 MB com preload=metadata e imagens históricas de 2–9 MB. Os vídeos não estão na homepage e não são pré-carregados integralmente.
- Assets têm cache imutável de um ano; CSS e JS revalidam; fontes usam preconnect.
- Não se recomprimiram cartazes ou vídeos sem medição comparável e sem arriscar qualidade visual.

Próxima ação: criar variantes WebP/AVIF, manter originais, usar picture e medir LCP/CLS antes de publicar.

## E. Google, Bing e SEO local

Confirmado no código: sitemap válido, robots, canonical, hreflang e dados estruturados nas páginas principais; localização VoxLaci em Cascais/São Domingos de Rana/Portugal e entidade Person de Myguel ligada a Portugal.

Não verificável sem acesso autenticado: cobertura, indexação, ações manuais, Core Web Vitals, submissão Bing e Google Business Profile.

## F. GA4

Implementados no código:

- casting_submit
- casting_confirmed
- lead_form_submit
- contact_click_whatsapp
- contact_click_email
- contact_click_phone

Os eventos de contacto não enviam telefone, email nem texto. Key Events recomendados: casting_confirmed e lead_form_submit. casting_submit e cliques são microconversões.

Não foi possível confirmar DebugView/Realtime nem marcar eventos na interface.

## G. Segurança e backups

Confirmado:

- Segredos não estão versionados; .env, .dev.vars, bases e logs estão ignorados.
- Não foram encontradas chaves Stripe, Resend ou Brevo em ficheiros públicos.
- Headers: HSTS, CSP, X-Frame-Options, nosniff, Referrer-Policy e Permissions-Policy.
- Upload restringe tipo/tamanho e o webhook Stripe valida assinatura nos testes.

Pendências:

1. Crítica: Turnstile real e TURNSTILE_SECRET_KEY.
2. Rate limit em memória não é global entre isolates; complementar com Turnstile/WAF.
3. Alertas operacionais para internal_failed e candidate_failed.
4. Backup/exportação periódica do D1; GitHub não é backup das candidaturas.
5. Política RGPD de retenção, acesso e eliminação.

## H. Publicação

Commits:

- VoxLaci 8b0fe4c — Harden casting delivery and conversion tracking
- Myguel 674b57f — Harden team building lead delivery

Push para main concluído nos repositórios voxlaci/new-website-voxlaci e voxlaci/myguelcastro.

Deploy Cloudflare confirmado:

- VoxLaci Pages: produção atualizada com “Harden casting delivery and conversion tracking”.
- Myguel Pages: produção atualizada com “Harden team building lead delivery”, deployment 3f9dc592.

Validação pública:

- voxlaci.com respondeu e apresentou homepage, Casting, horários, links e formulário.
- myguelcastro.com/team-building/ respondeu e apresentou formulário, PT/EN, campos e CTAs.
- Os dois domínios estavam acessíveis por HTTPS sem regressão visual crítica observada.
- Não foi enviada candidatura real nem email para terceiros durante a validação.

## I. Próximos cinco passos

1. Configurar Turnstile real e testar token ausente/inválido.
2. Auditar Resend: domínio, SPF/DKIM/DMARC, suppressed, bounces, complaints e falhas.
3. Confirmar eventos no GA4 DebugView e marcar os dois Key Events.
4. Medir mobile/desktop com Lighthouse e PSI; otimizar só os recursos confirmados.
5. Criar rotina de backup D1 e decidir se Team Building terá fila persistente compatível com RGPD.

## Evidência

- node --test tests/*.test.mjs (VoxLaci): 8 aprovados, 0 falhados.
- node --test *.test.mjs (Myguel): 3 aprovados, 0 falhados.
- xmllint --noout sitemap.xml: aprovado nos dois projetos.
- git diff --check: aprovado antes dos commits.
