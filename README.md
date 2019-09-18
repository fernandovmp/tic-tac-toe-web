# Tic Tac Toe Web
Aplicação de jogo da velha online, onde é possível se cadastrar como usuário e jogar online com amigos.

<img src="https://user-images.githubusercontent.com/45287292/65180855-368ee600-da34-11e9-868b-07b241f6f572.png" width=40%/><img src="https://user-images.githubusercontent.com/45287292/65180856-37277c80-da34-11e9-924b-583c817452e4.png" width=40% hspace=2/>
<img src="https://user-images.githubusercontent.com/45287292/65180857-37277c80-da34-11e9-9d0e-5530b0eae5ef.png" width=40% /><img src="https://user-images.githubusercontent.com/45287292/65180859-37c01300-da34-11e9-99fe-70f33b4011ea.png" width=40% hspace=2/>
<img src="https://user-images.githubusercontent.com/45287292/65180860-37c01300-da34-11e9-9321-23346bb244a7.png" width=40% /><img src="https://user-images.githubusercontent.com/45287292/65180861-37c01300-da34-11e9-96de-d9b732d2a994.png" width=40% hspace=2/>

# Conteúdo
- [Motivação](#motivação)
- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Estrutura de pastas](#estrutura-de-pastas)
- [API do servidor](https://github.com/fernandovmp/tic-tac-toe-server)

# Motivação
Este projeto é parte do meu portfólio pessoal, então feedbacks sobre o projeto, implementação e outros pontos são bem vindos.

# Funcionalidades
- Cadastro e Login
- Enviar convites
- Aba de notificação de convites em tempo real
- Jogar online

# Instalação
1. Baixe e instale o Node: https://nodejs.org
2. Clone esse repositório: \
`git clone https://github.com/fernandovmp/tic-tac-toe-web.git`
3. Instale as dependências do projeto: `yarn install`
4. Levante o [servidor](https://github.com/fernandovmp/tic-tac-toe-server)
5. Inicie o ambiente de desenvolvimento: `yarn start`

# Estrutura de pastas
- public/
    - index.html
- src/ 
  - services/ \
  Chamada a API
    - api.js \
    Exporta a função de chamada a API
  - Pages/ \
  Paginas da aplicação
    - Login.js
    - Login.css
    - Home.js
    - Home.css
  - components/
    - tic-tac-toe/ \
    Componentes do jogo
      - Board.css
      - Borad.js
      - MatchResult.css
      - MatchResult.js
      - PlayerCard.css
      - PlayerCard.js
      - TicTacToe.css
      - TicTacToe.js
    - NotificationBox.css
    - NotificationBox.js
    - UserMenu.css
    - UserMenu.js
  - assets/ \
  Assets do projeto
    - account-plus.svg
    - bell-outline.svg
    - email.svg
  - App.css \
  CSS global do html
  - App.js
  - index.js
  - routes.js
