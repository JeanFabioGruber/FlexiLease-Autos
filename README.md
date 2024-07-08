# FlexiLease Autos

## Descrição

Este projeto é uma API que simula um sistema de gerenciamento de locação de veículos. Inclui funcionalidades para registro, busca, atualização e exclusão de carros, reservas e usuários.

## Tecnologias Utilizadas

- Node.js com TypeScript
- Express.js
- MongoDB (Mongoose)
- JWT para autenticação
- Jest para testes
- Eslint e Prettier para padrões de código

## Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado:

- Node.js
- npm ou yarn
- MongoDB

## Instalação

Siga estas etapas para instalar o projeto:

1. Clone o repositório:

  `git clone https://github.com/JeanFabioGruber/FlexiLease-Autos.git`

2.  Instale as dependências:

`npm install`

3.  Crie um arquivo .env baseado no .env.example

4.  Execute o servidor de desenvolvimento
`npm run dev`

## Rotas

Aqui estão as rotas disponíveis para a API. Todas as rotas começam com `/api/v1`.

### Cars

- **GET geral**: `/cars`
- **GET específico**: `/cars/:id`
- **POST**: `/cars`
- **PUT**: `/cars/:id`
- **DELETE**: `/cars/:id`

### Reservations

- **GET geral**: `/reservations`
- **GET específico**: `/reservations/:id`
- **POST**: `/reservations`
- **PUT**: `/reservations/:id`
- **DELETE**: `/reservations/:id`

### Users

- **GET geral**: `/users`
- **GET específico**: `/users/:id`
- **POST**: `/users`
- **PUT**: `/users/:id`
- **DELETE**: `/users/:id`
- **login**: `/users/login`

