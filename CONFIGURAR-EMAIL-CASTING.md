# Ativar os emails do casting

O formulário já está preparado com o nome `inscricao-voxlaci`, campo `email`, assunto próprio e consentimento.

## 1. Receber cada casting na VoxLaci

Na Netlify:

1. Abra o projeto VoxLaci.
2. Entre em **Project configuration → Notifications → Emails and webhooks**.
3. Em **Form submission notifications**, escolha **Add notification → Email notification**.
4. Selecione o formulário `inscricao-voxlaci`.
5. Indique `info@voxlaci.com`.
6. Guarde e faça um casting de teste.

O email introduzido pela pessoa fica como `Reply-to`, permitindo responder-lhe diretamente.

## 2. Enviar automaticamente uma cópia à pessoa

A Netlify não envia nativamente uma resposta personalizada para o endereço escrito no formulário. A forma sem código mais simples é:

1. Criar uma automatização no Zapier.
2. Trigger: **Netlify → New Form Submission**.
3. Filtrar pelo formulário `inscricao-voxlaci`.
4. Action: **Gmail → Send Email**.
5. Destinatário: selecionar o campo `email` recebido do formulário.
6. Assunto: `Recebemos o seu casting VoxLaci`.
7. No corpo, inserir os campos do casting e esta introdução:

   `Olá {{nome}}, recebemos o seu casting e o comprovativo da inscrição. Esta é a cópia dos dados que enviou. A equipa VoxLaci entrará em contacto consigo para indicar o próximo passo.`

8. Em BCC, indicar `info@voxlaci.com`.
9. Testar e só depois ativar a automatização.

## Confirmação necessária

Este projeto usa `info@voxlaci.com`, que é o endereço existente no site e no backup. Confirmar antes de configurar caso o endereço oficial seja diferente.
