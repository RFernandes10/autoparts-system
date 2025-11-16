# 🚗 AutoParts System

Sistema completo de gestão para autopeças, desenvolvido com **Node.js**, **TypeScript**, **React** e **PostgreSQL**.

## 📋 Funcionalidades

- ✅ **Gestão de Produtos** - CRUD completo com especificações de pneus, baterias e compatibilidade de veículos
- ✅ **Gestão de Clientes** - Cadastro e controle de clientes
- ✅ **Gestão de Fornecedores** - Cadastro e controle de fornecedores
- ✅ **Dashboard** - Visão geral do negócio com estatísticas
- 🚧 **PDV (Ponto de Venda)** - Em desenvolvimento
- 🚧 **Relatórios** - Em desenvolvimento
- 🚧 **Controle de Estoque** - Em desenvolvimento

## 🛠️ Tecnologias

### Backend
- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication (em breve)

### Frontend
- React + TypeScript
- Vite
- React Router
- Axios
- CSS Modules

## 🚀 Como Executar

### Pré-requisitos
- Node.js (v18 ou superior)
- PostgreSQL (v14 ou superior)
- npm ou yarn

### Backend

cd backend
npm install
npx prisma migrate dev
npm run dev


O backend estará rodando em: `http://localhost:3000`

### Frontend

cd frontend
npm install
npm run dev


O frontend estará rodando em: `http://localhost:5173`

## 📦 Estrutura do Projeto

autoparts-system/
├── backend/ # API REST
│ ├── src/
│ │ ├── controllers/
│ │ ├── services/
│ │ ├── routes/
│ │ └── config/
│ └── prisma/
│ └── schema.prisma
└── frontend/ # Interface Web
├── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ └── types/
└── public/


## 🗄️ Banco de Dados

O sistema utiliza **PostgreSQL** com as seguintes tabelas principais:

- `produtos` - Catálogo de produtos
- `clientes` - Cadastro de clientes
- `fornecedores` - Cadastro de fornecedores
- `vendas` - Registro de vendas
- `itens_venda` - Itens de cada venda
- `movimentacoes_estoque` - Controle de entrada/saída

## 👨‍💻 Desenvolvedor

**Roberto Fernandes**
- GitHub: [@RFernandes10](https://github.com/RFernandes10)

## 📝 Licença

Este projeto está sob a licença MIT.

---

⭐ Desenvolvido com foco em aprendizado e práticas profissionais de desenvolvimento.
