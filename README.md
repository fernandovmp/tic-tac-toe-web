# Tic Tac Toe Web
Aplicação de jogo da velha online, onde é possível se cadastrar como usuário e jogar online com amigos.

### [API do servidor](https://github.com/fernandovmp/tic-tac-toe-server)

## Instalação
1. Baixe e instale o Node: https://nodejs.org
2. Clone esse repositório: \
`git clonehttps://github.com/fernandovmp/tic-tac-toe-web.git`
3. Instale as dependências do projeto: `yarn install`
4. Levante o [servidor](https://github.com/fernandovmp/tic-tac-toe-server)
5. Inicie o ambiente de desenvolvimento: `yarn start`

## Estrutura de pastas
- public/
    - index.html
- src/ 
  - services/ \
  Chamada a API
    - api.js
    Exporta a função de chamada a API
  - /Pages \
  Paginas da aplicação
    - Login.js
    - Login.css
    - Home.js
    - Home.css
  - assets/ \
  Assets do projeto
    - account-plus.svg
    - bell-outline.svg
  - App.css \
  CSS global do html
  - App.js
  - index.js
  - routes.js
