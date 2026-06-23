# Ligação do YouTube

Canal oficial: https://www.youtube.com/@VoxLaci

## O que já está ligado

- botão e cartão YouTube na página principal;
- vídeo principal aberto dentro do site;
- excertos de 10 segundos dos ensembles;
- ligação oficial no rodapé e nos dados SEO;
- atualização automática do cartão com o vídeo mais recente do canal.

## Como funciona

A função `netlify/functions/youtube-latest.mjs` consulta o feed público oficial
do canal. Não necessita de palavra-passe, acesso à conta ou chave de API.

Depois de publicar esta pasta na Netlify, cada vídeo novo publicado no canal
aparecerá automaticamente no cartão YouTube do site. A atualização pode demorar
até cerca de 15 minutos devido à cache.

## Para acrescentar excertos a outros ensembles

É necessário indicar:

1. link do vídeo YouTube;
2. minuto e segundo onde começa o excerto;
3. ensemble correspondente.

O site reproduz apenas dez segundos e oferece depois acesso ao vídeo completo.
