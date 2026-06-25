# VoxLaci — novo site

Site estático bilingue, responsivo e preparado para publicação rápida via GitHub
e Cloudflare Pages.

## Identidade visual

A paleta oficial é preto profundo, branco-gelo, prata e violeta orbital
controlado. As regras completas estão em `DESIGN_RULES.md`.

## Inscrições e pagamento

- A inscrição online inclui o pagamento obrigatório de 20€.
- O formulário recebe fotografia ou PDF do comprovativo.
- Na Netlify, consulte **Forms → inscricao-voxlaci** para ver as submissões.
- Uma submissão Netlify só é recebida depois de esta pasta estar publicada; abrir o ficheiro no computador serve apenas para testar o aspeto.
- Visa, Mastercard, Apple Pay e Google Pay só devem ser ativados através de Stripe ou Mollie. Nunca recolha números de cartão neste formulário.
- Para receber os castings e enviar uma cópia automática à pessoa, seguir `CONFIGURAR-EMAIL-CASTING.md`.

## Princípios de conversão aplicados

Com base no documento *Every Page Counts*:

- uma ação principal clara em cada momento;
- casting repetido ao longo de páginas extensas;
- botões com promessas concretas, em vez de “clique aqui”;
- leitura em F e hierarquia tipográfica fácil de percorrer;
- ações essenciais sempre disponíveis no telemóvel;
- cada página ou cartão conduz a inscrição, contacto ou participação.

## Versão 10

- teste de voz com três experiências independentes: falar, cantar e seguir;
- páginas bilingues PT/EN para ensembles, eventos e Ramos;
- 20 páginas históricas de Ramos em português e 20 em inglês;
- página local dedicada a pesquisas por coros em Cascais;
- Qūórum e Vox Petrus com imagens próprias;
- excertos VoxAtma e VoxCor nos momentos indicados;
- SEO local, `hreflang`, FAQ estruturada, páginas por intenção e guia de ativação.

## Versão 11

- inventário integral das 81 páginas publicadas no WordPress;
- migração estática de 71 páginas históricas adicionais;
- 169 imagens antigas copiadas e otimizadas localmente;
- arquivo completo com ensembles, projetos, serviços, inscrições, media e eventos;
- 143 endereços públicos incluídos no sitemap;
- faixa horizontal de ensembles e arquivo horizontal Ramos por maestro/edição;
- caixa inicial de casting e inscrições com três caminhos;
- nova direção visual preto, branco e vermelho-laca;
- arquivo Ramos com cartazes e fotografias de maestros;
- conteúdo antigo preservado sem scripts, formulários ou código WordPress inseguro.

## Ver localmente

Abra `index.html` no browser ou execute:

```bash
python3 -m http.server 8080
```

e visite `http://localhost:8080`.

## Publicação rápida

O caminho recomendado é Cloudflare Pages ligado ao repositório GitHub
`voxlaci/new-website-voxlaci`. As instruções completas estão em
`CLOUDFLARE-PAGES.md`.

## Integração com redes sociais

Publicações automáticas nos dois sentidos não funcionam apenas com HTML. A solução recomendada é:

1. usar um CMS simples (WordPress, Sanity ou Contentful) para agenda/notícias;
2. ligar o CMS a Metricool, Buffer ou Make para publicar automaticamente em Instagram, Facebook, LinkedIn e Google Business Profile;
3. mostrar no site o feed de Instagram/YouTube através das APIs oficiais ou de um serviço de feed consentido;
4. manter uma única ficha de evento e distribuí-la para site, Google Calendar e redes.

## Concierge multilingue

O site inclui uma primeira versão funcional do `VoxLaci Concierge`. Esta versão:

- dá as boas-vindas em várias línguas;
- orienta visitantes em português, inglês, espanhol, francês, italiano e alemão;
- interpreta perguntas simples sobre coros, crianças, eventos, contratação, localização e contactos;
- funciona diretamente no browser, sem custos de API.

Para permitir conversa livre e tradução dinâmica em praticamente qualquer língua, o passo seguinte será ligar o concierge a um serviço de IA através de uma função segura no servidor. A chave da API nunca deve ser colocada no ficheiro JavaScript público. Antes da ativação será necessário definir limites de utilização, consentimento de privacidade, respostas baseadas apenas no conteúdo aprovado da VoxLaci e transferência para atendimento humano.

## Antes de publicar

- confirmar próximos eventos e datas;
- confirmar todos os ensembles atualmente ativos e respetivas idades;
- acrescentar política de privacidade/cookies e consentimento de analytics;
- confirmar na Netlify que o formulário `inscricao-voxlaci` foi detetado e ativar notificações por email;
- instalar Google Search Console, Bing Webmaster Tools e analytics consentido;
- criar páginas individuais PT/EN para cada ensemble, serviço e festival.
-Deployment refresh i June 2026
