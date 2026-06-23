# Ativar a última publicação do Instagram

O cartão do Instagram já funciona com uma imagem de reserva. Para passar a mostrar automaticamente a publicação mais recente:

1. A conta Instagram VoxLaci deve ser profissional e estar ligada à Meta.
2. Criar um token de acesso Instagram/Meta com autorização para ler as publicações.
3. No Netlify, abrir **Site configuration → Environment variables**.
4. Criar a variável `INSTAGRAM_ACCESS_TOKEN` e inserir o token.
5. Fazer um novo deploy.

O site consulta a função `/.netlify/functions/instagram-latest` e atualiza automaticamente imagem, texto e ligação. Sem token, mantém a imagem de reserva.
