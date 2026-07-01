# SERVICES_ARCHIVE_AUDIT.md

Auditoria inicial da secção **Serviços** do novo site VoxLaci.

Data: 2026-07-01  
Âmbito: apenas conteúdos relacionados com Serviços no repositório `new-website-voxlaci`.  
Regra aplicada: **não alterar Digital Home, Empresas, Team Building, Homepage, Menu principal, Design geral, Formulário de Casting, SEO global, Analytics, Search Console, Sitemap ou robots.txt.**

## 1. Resumo executivo

A auditoria encontrou uma base histórica relevante para Serviços. Existem páginas antigas já recuperadas em HTML, com texto e imagens, mas muitas estão ainda no formato “Arquivo VoxLaci” e precisam de reorganização editorial.

Serviços encontrados com conteúdo real:

- Casamentos
- Baptizados
- Missa de 7.º e 30.º dia
- Eventos Privados
- Som & Luzes
- Aprender Instrumento
- Violinos da Águilha
- Guitarras da Águilha
- Academia
- Workshop Professores
- Mentoria
- Serviços “O’Hana”
- Loja / material e serviços internos

Áreas protegidas detetadas, mas **não devem ser alteradas nesta tarefa**:

- Digital Home para Artistas
- Team Building
- Empresas / serviços para empresas

## 2. Ficheiros auditados

### Diretório principal de Serviços

- `servicos/index.html`
- `servicos/casamentos/index.html`
- `servicos/baptizados/index.html`
- `servicos/missa-de-7o-e-30o-dia/index.html`
- `servicos/eventos-privados/index.html`
- `servicos/som-luzes/index.html`
- `servicos/aprender-instrumento/index.html`
- `servicos/violinos/index.html`
- `servicos/guitarras/index.html`
- `servicos/servicos-ohana/index.html`
- `servicos/team-building/index.html` — protegido
- `servicos/digital-home-artistas/index.html` — protegido

### Páginas fora de `/servicos/` mas relacionadas com serviços

- `academia/index.html`
- `workshopprofessores/index.html`
- `mentoria/index.html`
- `loja/index.html`
- `transportedosavos/index.html` — relacionado com apoio/serviço logístico, mas pode ficar fora da secção Serviços se for considerado apoio interno.

### Ficheiros de documentação consultados

- `README.md`
- `DESIGN_RULES.md`
- `TASKS.md`
- `PRE-PUBLICACAO.md`
- `SEO-ATIVAR-APOS-DOMINIO.md`
- `CONFIGURAR-EMAIL-CASTING.md`
- `CONCIERGE-IA.md`

Não foram encontrados PDFs, DOCX ou PPTX dentro do repositório principal `new-website-voxlaci` relacionados com Serviços. A auditoria local encontrou ficheiros Markdown de apoio, mas não documentos externos de serviços.

## 3. Serviços encontrados

### 3.1 Casamentos

Ficheiro:

- `servicos/casamentos/index.html`

Conteúdo disponível:

- Coros VoxLaci disponíveis para momentos especiais.
- Orçamento histórico: 2100€ para animação em missa de casamento ou baptizado no distrito de Lisboa.
- Fora do distrito de Lisboa acresce 300€ de autocarro.
- Desconto de 10% quando reservado 6 meses antes da cerimónia com 50% do valor.
- Restantes 50% até 24h antes da cerimónia.
- Serviço cantado por VoxSoul, Hirmandade e/ou Intuição.
- Repertório variado, adaptado às expectativas dos noivos.
- Opção cantor com teclado/guitarra: 450€.
- Opção instrumental com teclado/guitarra: 250€.
- Contacto histórico: WhatsApp +351 938407985 e info@voxlaci.com.

Imagens disponíveis:

- `/legacy-media/3a5cfbc5ce72.jpg`

Observações:

- Há sobreposição quase total com Baptizados.
- Contacto +351 938407985 pode estar desatualizado face à preferência atual do site pelo número +351 925 075 186. Não alterar sem validação do responsável.
- Conteúdo real suficiente para página própria reorganizada.

### 3.2 Baptizados

Ficheiro:

- `servicos/baptizados/index.html`

Conteúdo disponível:

- Coros VoxLaci para enaltecer momentos especiais.
- Orçamento histórico idêntico ao de casamentos: 2100€ no distrito de Lisboa.
- Fora de Lisboa: +300€ de autocarro.
- Desconto de 10% com reserva 6 meses antes.
- Serviço cantado por VoxSoul, Hirmandade e/ou Intuição.
- Repertório variado, adaptado às expectativas dos pais do baptizado.
- Opções reduzidas: cantor com teclado/guitarra 450€; instrumental 250€.

Imagens disponíveis:

- `/legacy-media/f6292fc66c6b.jpg`

Observações:

- Pode ser página própria ou agrupada editorialmente com “Casamentos e Baptizados”, mas o pedido fala em páginas próprias para serviços encontrados. Recomenda-se página própria com ligações cruzadas.

### 3.3 Missa de 7.º e 30.º dia

Ficheiro:

- `servicos/missa-de-7o-e-30o-dia/index.html`

Conteúdo disponível:

- Coros VoxLaci para momentos solenes dos entes queridos.
- Orçamento histórico: 2100€ para animação numa missa de casamento ou baptizado no distrito de Lisboa.
- Fora do distrito: +300€ de autocarro.
- Desconto de 10% com reserva 6 meses antes.
- Serviço cantado por Hirmandade e/ou Intuição.
- Repertório variado e adequado ao momento solene.
- Opção cantor com teclado/guitarra: 450€.
- Opção instrumental: 250€.

Imagens disponíveis:

- `/legacy-media/49f071df8071.jpg`

Observações:

- Texto tem frase herdada “casamento ou baptizado” que deve ser reorganizada para este contexto, sem alterar o dado histórico.
- Serviço suficientemente documentado.

### 3.4 Eventos Privados

Ficheiro:

- `servicos/eventos-privados/index.html`

Conteúdo disponível:

- Pergunta central: “Gostaria de ter um, ou mais, dos coros VoxLaci a actuar no seu evento?”
- Pedido de orçamento.
- Contactos: WhatsApp (+351) 925 075 186 e info@voxlaci.com.

Imagens disponíveis:

- `/legacy-media/cc4bfe3650b0.jpg`

Observações:

- Conteúdo curto.
- Deve conter “Informação em atualização.” nas áreas onde falte metodologia, preços, exemplos ou FAQ, a menos que se reutilize informação real de Casamentos/Baptizados/Team Building — mas Team Building está protegido e não deve ser alterado.

### 3.5 Som & Luzes

Ficheiro:

- `servicos/som-luzes/index.html`

Conteúdo disponível:

- Aluguer por 12 horas; material levantado e entregue pelo próprio.
- Caução de 100€, devolvida no final.
- Sistema rápido de som: 2 colunas com tripés, mesa com tripé, 2 microfones com cabo, 2 cabos jack: 100€.
- 4 microfones profissionais sem fios de mão: 35€ cada.
- Mesa(s) de mistura.
- Amplificadores com 2 colunas.
- Carrinha KIA Hercules: 100€/dia.
- Sistema de luzes para festas caseiras: 50€.
- 2 máquinas de fumo: 30€ cada.

Imagens disponíveis:

- `/legacy-media/1def0f1d2b72.jpg`

Observações:

- Conteúdo prático e concreto.
- Falta clareza sobre disponibilidade atual, levantamento, responsabilidade, danos e contactos.
- Recomenda-se manter preços como “informação histórica / sob confirmação” se não houver validação atual.

### 3.6 Aprender Instrumento

Ficheiro:

- `servicos/aprender-instrumento/index.html`

Conteúdo disponível:

- Academia VoxLaci.
- Canto e técnica vocal, guitarra clássica, formação musical, análise, harmonia, piano, percussão.
- Mensalidade histórica: 115€ / 85€ para coristas VoxLaci.
- Disponível no texto: guitarra, percussão e teclado/órgão/piano.
- Horário: 17h–19h aulas de instrumento de 30m em grupo.
- 19h–19h45 formação musical.
- 20h–20h30 classe de conjunto.
- Pagamento na primeira aula mensal.
- Regra de faltas com 48h de aviso.
- Apresentações públicas em janeiro e junho.

Imagens disponíveis:

- `/legacy-media/04218d87e4a5.jpg`

Observações:

- Tem forte sobreposição com Academia.
- Deve ser a página agregadora de instrumentos, com links para Violinos e Guitarras.

### 3.7 Violinos da Águilha

Ficheiro:

- `servicos/violinos/index.html`

Conteúdo disponível:

- Workshop 45m: 20€.
- Horários 17h, 18h, 19h; grupos máximo 8 alunos.
- Não é necessário ter instrumento.
- “We Speak English”.
- Aulas às quintas-feiras.
- 17h, 18h e 19h — aulas de instrumento de 45m em grupo 2–10 pessoas.
- Formação e leitura musical no decorrer da aula.
- Aulas de grupo: 50€ / pacote 4 aulas.
- Aulas individuais: 15m/semana 50€/mês; 30m 90€/mês; 45m 130€/mês; 60m 140€/mês; 90m 290€/mês; 120m 320€/mês.
- Aulas privadas avulsas: blocos de 30m / 60€.
- Transporte possível da escola para Torre da Águilha: +10€ por dia.
- Contactos: WhatsApp (+351) 925 075 186; info@voxlaci.com.
- Local: Torre da Águilha, São Domingos de Rana, Cascais.
- Bio da professora Paula Fernandes.

Imagens disponíveis:

- `/legacy-media/d29ebcc7425f.jpg`
- `/legacy-media/080c93bd75d4.jpg`
- `/legacy-media/04218d87e4a5.jpg`
- `/legacy-media/112637cd9c41.jpg`

Observações:

- Conteúdo muito completo.
- A página Guitarras reutiliza parte deste texto por erro provável (“Gostava de aprender a tocar VIOLINO?” e bio de Paula Fernandes). Não corrigir sem validar? Recomenda-se assinalar como informação repetida/possível erro.

### 3.8 Guitarras da Águilha

Ficheiro:

- `servicos/guitarras/index.html`

Conteúdo disponível:

- Workshop 45m: 20€.
- Horários 17h, 18h, 19h; grupos máximo 8 alunos.
- Não é necessário ter instrumento.
- “We Speak English”.
- Aulas de grupo e individuais com preços idênticos aos Violinos.
- Contactos e local.

Imagens disponíveis:

- `/legacy-media/b537c2c47e08.jpg`
- `/legacy-media/04218d87e4a5.jpg`
- `/legacy-media/4ad0b5bc0dfa.jpg`

Informação repetida / possível erro:

- Texto fala “Gostava de aprender a tocar VIOLINO?”.
- Bio é de Paula Fernandes, professora de violino, e pode não pertencer à página de guitarras.

Recomendação:

- Como há informação específica de guitarra insuficiente/contaminada por violino, manter apenas o que é real e comum; marcar o resto como “Informação em atualização.”.

### 3.9 Academia

Ficheiro:

- `academia/index.html`

Conteúdo disponível:

- “Academia – Professores que adoram o que fazem”.
- Local: Hotel Seminário Torre d’Águilha / São Domingos de Rana.
- Conceito educativo: aprender música como aprender uma língua; exige tempo e dedicação.
- Instrumentos: guitarra, formação musical, análise, harmonia, piano, percussão, aulas de grupo.
- Conceito: aula de instrumento + formação musical + aula de conjunto.
- Horário histórico: terças, 17h–19h instrumento, 19h–19h45 formação musical, 20h–20h45 aula de conjunto.
- Preços históricos: 19€/45m, cerca de 76€/mês; regras de faltas; descontos; aulas avulso.
- Saraus no final de janeiro e junho.
- Conteúdo de ATL / horários 14h–18h e transporte AvôRoma.

Imagens disponíveis:

- `/legacy-media/1d1e72b50ebe.jpg`

Observações:

- Pode funcionar como página “Academia / Aulas de Música”.
- Parte dos preços podem estar desatualizados; manter como histórico ou pedir validação.

### 3.10 Workshop Professores

Ficheiro:

- `workshopprofessores/index.html`

Conteúdo disponível:

- A profissão de professor é essencial.
- Um professor feliz é vital para a aprendizagem.
- Workshops liderados por Myguel Santos e Castro.
- Experiência: mais de 30 anos a dirigir coros; fundador do VoxLaci em 1996; mais de 20 anos a dar aulas em escolas públicas e privadas.
- Local: Sala de Ensaios VoxLaci, Seminário Torre d’Águilha, São Domingos de Rana.
- Datas/temas históricos:
  - A disciplina em salas de aulas
  - A Saúde Mental começa na Prevenção
  - Técnicas para uma Voz Saudável
  - A Motivação e a alegria na Sala de Aula
- Texto sobre autopreservação, saúde mental/física e equilíbrio vida-trabalho.

Imagens disponíveis:

- `/legacy-media/882c49885508.jpg`

Observações:

- Conteúdo real suficiente para página própria em Serviços.
- Datas antigas devem ser apresentadas como histórico ou substituídas por “Informação em atualização.” para próximas edições.

### 3.11 Mentoria

Ficheiro:

- `mentoria/index.html`

Conteúdo disponível:

- Programa de Mentoria VoxLaci.
- Frase: “Mudar hábitos, transformar o futuro.”
- Objetivo: ajudar jovens a desenvolver autonomia no estudo.
- Eliminação de lacunas, hábitos de estudo, curiosidade, progressão para mentor, uso de IA.
- Ferramentas mencionadas: ChatGPT, Gemini, Perplexity.
- Perfil de mentor.
- Perfil de mentorando.
- Estrutura do programa.
- Frequência: uma ou duas sessões por semana, segunda e quarta antes dos ensaios.
- Modalidades individual/grupo.
- Preços históricos:
  - Não membros: 60€/semana.
  - Membros VoxLaci: 25€/semana.
- Resultados esperados em 4–6 semanas, 3–4 meses, 6 meses.
- Garantia declarada de devolução em caso de zero resultados.
- Sistema de feedback, guia de mentoria, certificados.

Imagens disponíveis:

- `/legacy-media/b82c67eb7d90.jpg`
- `/legacy-media/93b0f30da031.jpg`

Observações:

- Conteúdo muito completo.
- Deve ser incluído em Serviços, salvo se o responsável decidir tratá-lo como Projeto.
- A garantia de devolução é sensível: manter apenas se validada como atual; caso contrário assinalar como informação histórica.

### 3.12 Serviços “O’Hana”

Ficheiro:

- `servicos/servicos-ohana/index.html`

Conteúdo disponível:

- Material e serviços para coristas VoxLaci.
- Lista histórica de material: tablet, capa, teclado, película, pens, iPhone, AirPods, diapasão, phones, carrinha, máscaras.
- Conceito O’Hana: família VoxLaci numerosa; oferta/procura de serviços dentro da comunidade.
- Ideia de listagem de profissões/serviços da comunidade.
- Campos sugeridos: profissão/serviço, nome, grau parentesco do corista, coro, telemóvel/telefone, local, custo.
- Exemplos de profissões: eletricista, canalizador, carpinteiro, enfermeiro, médico, informático, designer gráfico, explicações, psicologia, babysitter, jardineiro, educador, advogado, limpeza, engomadoria, costura, cozinheiro, mecânico, fisioterapia.

Imagens disponíveis:

- `/legacy-media/dd1ff3745550.jpg`

Observações:

- É um serviço comunitário interno, diferente de serviço comercial externo.
- Pode ser página própria “O’Hana — comunidade de serviços” ou arquivado se não estiver ativo.
- Falta informação atual sobre disponibilidade, regras, privacidade e submissão.

### 3.13 Loja

Ficheiro:

- `loja/index.html`

Conteúdo disponível:

- Praticamente vazio: “Arquivo histórico VoxLaci: Loja.”

Imagens disponíveis:

- Usa imagem genérica `/assets/hero-live.jpg`.

Observações:

- Informação insuficiente.
- Se for incluído como serviço/loja, mostrar “Informação em atualização.”

## 4. Imagens disponíveis por tema

### Galeria geral de Serviços

Ficheiro `servicos/index.html` contém várias imagens antigas:

- `/legacy-media/15cbe6a9bdff.jpg`
- `/legacy-media/0ef2abccb4af.jpg`
- `/legacy-media/8d5b6a33c250.jpg`
- `/legacy-media/798d58211f15.jpg`
- `/legacy-media/33b5c77ef704.jpg`
- `/legacy-media/9b192ee0b229.jpg`
- `/legacy-media/904c90fc6cb5.jpg`
- `/legacy-media/6cdda0833e5a.jpg`
- `/legacy-media/b700456a7694.jpg`
- `/legacy-media/d00d0446bb84.jpg`
- `/legacy-media/770b37df966a.jpg`
- `/legacy-media/812ed74ae9d1.jpg`

Estas imagens devem ser avaliadas visualmente antes de serem atribuídas a serviços específicos. Não usar duplicados quando já existe imagem própria de página.

### Imagens já associadas a páginas

- Casamentos: `/legacy-media/3a5cfbc5ce72.jpg`
- Baptizados: `/legacy-media/f6292fc66c6b.jpg`
- Missa 7.º/30.º dia: `/legacy-media/49f071df8071.jpg`
- Eventos privados: `/legacy-media/cc4bfe3650b0.jpg`
- Som & Luzes: `/legacy-media/1def0f1d2b72.jpg`
- Aprender Instrumento: `/legacy-media/04218d87e4a5.jpg`
- Violinos: `/legacy-media/d29ebcc7425f.jpg`, `/legacy-media/080c93bd75d4.jpg`, `/legacy-media/04218d87e4a5.jpg`, `/legacy-media/112637cd9c41.jpg`
- Guitarras: `/legacy-media/b537c2c47e08.jpg`, `/legacy-media/04218d87e4a5.jpg`, `/legacy-media/4ad0b5bc0dfa.jpg`
- O’Hana: `/legacy-media/dd1ff3745550.jpg`
- Team Building: `/legacy-media/64b95e774f86.jpg`, `/legacy-media/c69aad359b82.jpg` — protegido
- Workshop Professores: `/legacy-media/882c49885508.jpg`
- Academia: `/legacy-media/1d1e72b50ebe.jpg`
- Mentoria: `/legacy-media/b82c67eb7d90.jpg`, `/legacy-media/93b0f30da031.jpg`
- Digital Home: `/assets/experience.jpg` — protegido

## 5. Informação repetida

Repetições claras:

- Casamentos, Baptizados e Missa 7.º/30.º dia repetem orçamento, desconto e opções de cantor/instrumental.
- Violinos e Guitarras partilham grande parte do texto; a página Guitarras parece conter texto de Violino.
- Academia e Aprender Instrumento partilham a lógica de aula de instrumento + formação musical + conjunto.
- Serviços “O’Hana” e Loja/material interno têm relação, mas Loja não tem conteúdo suficiente.

## 6. Informação em falta

Faltas gerais:

- Estado atual dos preços e disponibilidade.
- Confirmação de contactos corretos para cada serviço.
- Políticas de reserva/cancelamento atualizadas.
- Equipa atual por serviço.
- Calendário atual para workshops.
- Regras de privacidade para listagem O’Hana.
- FAQ específica para Eventos Privados, Som & Luzes e Loja.
- Traduções completas para páginas individuais de serviços.
- Confirmação se Mentoria deve ser Serviço ou Projeto.

## 7. Oportunidades de reutilização

### Página principal Serviços

Pode ser melhorada sem tocar na homepage/menu:

- Introdução editorial clara: “Serviços VoxLaci”.
- Categorias:
  - Cerimónias e momentos especiais
  - Eventos e produção
  - Formação musical
  - Mentoria e educação
  - Comunidade interna
- Cartões com ligação para páginas próprias.
- Nota “Informação em atualização” quando não houver dados validados.

### Páginas próprias recomendadas

Manter/criar/reorganizar:

- `/servicos/casamentos/`
- `/servicos/baptizados/`
- `/servicos/missa-de-7o-e-30o-dia/`
- `/servicos/eventos-privados/`
- `/servicos/som-luzes/`
- `/servicos/aprender-instrumento/`
- `/servicos/violinos/`
- `/servicos/guitarras/`
- `/servicos/workshop-professores/` — nova página baseada em `workshopprofessores/index.html`
- `/servicos/mentoria/` — nova página baseada em `mentoria/index.html`, se aprovada como Serviço
- `/servicos/academia/` — nova página baseada em `academia/index.html`
- `/servicos/servicos-ohana/`
- `/servicos/loja/` — apenas com “Informação em atualização.” se incluída

Não alterar:

- `/servicos/digital-home-artistas/`
- `/servicos/team-building/`
- conteúdos de Empresas/Team Building presentes na homepage ou em `script.js`.

## 8. SEO / GEO / IA — recomendações

Para cada página de serviço:

- Meta Title específico.
- Meta Description com serviço, local e VoxLaci.
- H1 único.
- Breadcrumb Schema.
- Organization Schema.
- Service Schema.
- FAQ Schema apenas quando houver perguntas/respostas reais.
- Conteúdo em blocos explícitos: o que é, para quem, como funciona, valores/condições quando existirem, contactos.
- CTA claro: email/WhatsApp/proposta.
- Manter linguagem natural para Google AI Overviews, ChatGPT, Claude, Gemini e Perplexity.

## 9. Traduções

Estado atual:

- O site tem sistema multilingue geral PT/EN/ES/FR/IT na homepage.
- As páginas internas de serviços estão maioritariamente em português, com alguns conteúdos pontuais em inglês herdado.

Recomendação:

- Não criar páginas com estrutura diferente por língua.
- Usar a mesma estrutura e adicionar blocos traduzíveis apenas depois da página portuguesa estar organizada.
- Onde não houver tradução validada, mostrar conteúdo PT e preparar atributos/sistema para tradução futura.

## 10. Testes necessários depois da implementação

- Verificar que Digital Home, Team Building e Empresas não foram alterados.
- Verificar links de todos os cartões da página `servicos/index.html`.
- Verificar mobile das páginas de serviço.
- Verificar imagens quebradas.
- Verificar ausência de duplicação visual das mesmas imagens.
- Verificar metadados e JSON-LD.
- Verificar que páginas com falta de conteúdo mostram “Informação em atualização.”
- Verificar que o formulário de casting não foi tocado.

## 11. Próximo passo recomendado

Depois desta auditoria, avançar para:

1. Reorganizar `servicos/index.html`.
2. Reescrever apenas páginas de serviços não protegidos com base no conteúdo real encontrado.
3. Criar páginas em `/servicos/` para `academia`, `mentoria`, `workshop-professores` e eventualmente `loja`.
4. Validar visualmente imagens antes de selecionar.
5. Adicionar SEO/Schema por página.

