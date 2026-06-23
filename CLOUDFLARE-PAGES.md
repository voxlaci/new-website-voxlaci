# Publicação em Cloudflare Pages

Este é agora o caminho recomendado para publicar o site VoxLaci.

## Configuração inicial

1. Abrir Cloudflare Dashboard.
2. Ir a **Workers & Pages**.
3. Escolher **Create application**.
4. Escolher **Pages**.
5. Ligar ao GitHub.
6. Escolher o repositório `voxlaci/new-website-voxlaci`.

## Build settings

Como o site é estático:

- Framework preset: `None`
- Build command: deixar vazio
- Build output directory: `/`
- Root directory: `/`
- Branch: `main`

## Funções incluídas

O repositório já inclui funções Cloudflare Pages em `functions/`:

- `/youtube-latest` mostra automaticamente o vídeo mais recente do canal VoxLaci.
- `/instagram-latest` mostra a última imagem do Instagram quando a variável existir.

## Variáveis de ambiente

Para ativar o Instagram automático:

- Nome: `INSTAGRAM_ACCESS_TOKEN`
- Valor: token oficial Instagram/Meta

Sem esta variável, o site usa a imagem de reserva definida em `social-feed.json`.

## Formulários

Importante: Cloudflare Pages não processa automaticamente formulários como a
Netlify Forms. O formulário visual existe, mas para receber inscrições reais é
necessário escolher uma destas soluções:

1. Cloudflare Pages Function + serviço de email/API;
2. Formspree, Basin, Tally ou outro serviço externo;
3. Google Forms embutido;
4. sistema próprio de pagamentos/CRM.

Até isso estar configurado, testar o formulário na Cloudflare pode não enviar
submissões reais.
