# Evolução do VoxLaci Concierge para IA

## Experiência pretendida

1. Detetar o idioma do visitante ou perguntar a preferência.
2. Responder na mesma língua.
3. Consultar apenas informação aprovada sobre ensembles, idades, horários, eventos, inscrições, serviços e contactos.
4. Fazer perguntas curtas para encontrar o ensemble ou serviço certo.
5. Encaminhar para formulário, WhatsApp, email ou atendimento humano.

## Arquitetura segura

- O browser envia a pergunta para uma função protegida no servidor.
- A função consulta uma base de conhecimento VoxLaci.
- O modelo recebe apenas o contexto necessário.
- A chave da API permanece no servidor.
- As conversas não devem ser usadas para publicidade nem guardar dados pessoais sem consentimento.

## Regras essenciais

- Nunca inventar datas, preços, horários ou disponibilidade.
- Identificar claramente quando a resposta é automática.
- Permitir falar com uma pessoa em qualquer momento.
- Não pedir dados sensíveis.
- Pedir consentimento antes de guardar nome, email ou telefone.
- Implementar limites contra abuso e custos inesperados.
