# SEO Audit — VoxLaci

Data: 2026-09-18

## Objetivo

Melhorar a descoberta orgânica do site VoxLaci no Google, Google AI Overviews e assistentes de IA, sem alterar a identidade visual nem a experiência principal do site.

## Implementado nesta intervenção

### 1. Sitemap técnico

- Regenerado `sitemap.xml` a partir das páginas HTML indexáveis reais.
- Excluídas páginas técnicas, administrativas, templates, páginas de obrigado e páginas com `noindex`.
- Respeitados URLs canónicos (`canonical`) quando existem.
- Mantidos `hreflang` quando declarados nas páginas.
- O sitemap passou a incluir páginas importantes que estavam ausentes:
  - ensembles;
  - eventos;
  - serviços;
  - projetos;
  - edições Ramos;
  - versões linguísticas relevantes.

### 2. Robots

Atualizado `robots.txt` com:

- `Allow: /` para conteúdo público;
- bloqueio de áreas administrativas e páginas de pós-submissão;
- referência ao sitemap canónico.

### 3. Ficheiros para IA e confiança técnica

Criados:

- `ai.txt` — resumo estruturado para motores de pesquisa e assistentes de IA;
- `humans.txt` — identificação humana/técnica do projeto e entidade responsável.

Atualizado:

- `llms.txt` — reforçado com páginas canónicas, serviços, eventos, entidade operadora e temas de pesquisa principais.

### 4. Templates internos

- `ensemble-template.html` e `ramos-edition-template.html` marcados com `noindex,nofollow`.
- Esses ficheiros continuam disponíveis para desenvolvimento, mas não devem ser indexados.

### 5. Validação

- Validado JSON-LD nas páginas principais intervencionadas recentemente.
- Validado `sitemap.xml` como XML bem formado.
- Confirmado que páginas `admin`, `area`, `obrigado`, templates e redirects antigos não entram no sitemap novo.

## Páginas prioritárias para SEO

### Prioridade máxima

- `/`
- `/coro-cascais/`
- `/inscricoes/inscricao-online/`
- `/ensembles/`
- `/ramos/`
- `/eventos/`
- `/servicos/`
- `/servicos/team-building/`
- `/servicos/violinos/`

### Eventos

- `/eventos/reis/`
- `/eventos/stella/`
- `/eventos/voxpop/`
- `/eventos/janeiras/`
- `/eventos/voxaround/`
- `/eventos/dakar-singing-festival/`

### Projetos

- `/projetos/`
- `/projetos/coros-nas-escolas/`
- `/projetos/voxfrater/`
- `/projetos/espaco-dos-avos/`

## Estratégia recomendada

### Google Search Console

Depois de publicado:

1. Submeter `https://voxlaci.com/sitemap.xml`.
2. Pedir inspeção/indexação das páginas prioritárias.
3. Verificar páginas descobertas mas não indexadas.
4. Corrigir eventuais erros de `hreflang`, duplicação ou canonicals.

### Conteúdo

Criar conteúdos úteis, não artificiais, sobre:

- como escolher um coro em Cascais;
- benefícios de cantar em grupo;
- coro infantil, juvenil e adulto;
- como funciona o casting VoxLaci;
- team building musical para empresas;
- aulas de violino em Cascais;
- história do Ramos Palm Sunday Festival;
- tradição do Concerto de Reis.

### Backlinks e autoridade

Pedir links para páginas específicas a:

- Câmara Municipal de Cascais;
- juntas de freguesia;
- escolas;
- parceiros culturais;
- espaços de eventos;
- festivais e coros participantes;
- artistas convidados;
- imprensa local/cultural.

### Redes sociais

Em cada publicação importante, apontar para a página correta:

- Ramos → `https://voxlaci.com/ramos/`
- Reis → `https://voxlaci.com/eventos/reis/`
- STELLA → `https://voxlaci.com/eventos/stella/`
- Casting → `https://voxlaci.com/inscricoes/inscricao-online/`
- Violinos → `https://voxlaci.com/servicos/violinos/`
- Team Building → `https://voxlaci.com/servicos/team-building/`

## Observações

- O site já tem uma boa base de schema.org em várias páginas.
- O maior ganho técnico imediato estava no sitemap, que estava incompleto.
- O maior ganho editorial futuro virá de páginas claras, úteis e específicas para as pesquisas reais das pessoas.
