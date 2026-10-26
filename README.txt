MARMITAS VALARETTO - VERSÃO COMPLETA PARA PUBLICAR DO ZERO

ESTRUTURA DA RAIZ DO GITHUB
- netlify/
- public/
- netlify.toml
- package.json
- .nvmrc
- README.txt

REGRAS DO PEDIDO
- Mini R$ 20: até 1 refogado, até 1 massa e 1 carne.
- Médio R$ 25: até 1 refogado, até 1 massa e 2 porções de carne. Pode escolher 1 tipo de carne (dobrada) ou 2 tipos.
- Grande R$ 35: até 1 refogado, até 2 massas e 2 porções de carne. Pode escolher 1 tipo de carne (dobrada) ou 2 tipos.
- Arroz: opções definidas pelo admin.
- Feijão: com ou sem.
- Farofa: com ou sem.
- Refogado: pode escolher ou marcar que não quer.
- Massa: pode escolher ou marcar que não quer.
- Admin aceita até 5 tipos de carne por dia.
- É possível adicionar várias marmitas ao mesmo pedido.

ENTREGA
- Sem cálculo automático de taxa.
- Cliente informa CEP, rua, número e complemento opcional.
- A taxa é informada pelo atendimento no WhatsApp.

PAGAMENTO
- Cartão, Dinheiro ou PIX.
- Entrega: pagamento somente no momento da entrega.
- Retirada: pagamento somente no caixa.

WHATSAPP
- Destino: (17) 98113-0555.
- Mensagem organizada por blocos e sem emojis.

ADMIN
- URL: /admin/
- A senha NÃO fica no código.
- Na Netlify crie a variável de ambiente ADMIN_PASSWORD.
- Se quiser manter a senha usada anteriormente, use: Valaretto2026
- Depois de criar/alterar ADMIN_PASSWORD, faça um novo deploy.

PUBLICAÇÃO DO ZERO
1. Crie um repositório NOVO no GitHub.
2. Descompacte este ZIP.
3. Envie TODO o conteúdo descompactado diretamente para a raiz do repositório. Não crie uma pasta extra.
4. Na Netlify: Add new project > Import an existing project > GitHub.
5. Selecione o repositório novo. O netlify.toml já define public e functions.
6. Depois do primeiro deploy, crie ADMIN_PASSWORD em Environment variables.
7. Faça novo deploy.
8. Abra /admin/, entre com a senha, altere o cardápio e salve.
9. Abra o site público e confirme a mudança.

O cardápio salvo no admin usa Netlify Blobs e é compartilhado entre novos deploys do mesmo projeto.
