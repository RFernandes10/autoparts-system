# 🚗 AutoParts System

Sistema completo de gestão para lojas de autopeças, com foco em **controle de estoque, organização de produtos e visão gerencial** do negócio.

<div align="center">
  [![Status](https://img.shields.io/badge/Status-Concluído-success?style=for-the-badge)](https://github.com/RFernandes10/autoparts-system)
  [![Licença MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
  <br/>
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
</div>

---

## ✨ Funcionalidades Principais

### 📦 Gestão de Produtos
- **Cadastro Completo:** Custo, preço de venda, estoque mínimo e atual
- **Categorias Específicas:** Pneus, baterias e autopeças
- **Especificações Técnicas:** Detalhes por tipo de produto
- **Compatibilidade:** Associação com veículos (modelo/marca/ano)
- **Busca Avançada:** Filtros por categoria, marca e disponibilidade

### 👥 Gestão de Clientes e Fornecedores
- **CRUD Completo:** Cadastro, edição e inativação
- **Dados de Contato:** Telefone, email, endereço
- **Identificação:** CPF/CNPJ com validação
- **Histórico:** Compras e vendas por cliente

### 💰 Vendas
- **Registro de Vendas:** Itens, quantidade e forma de pagamento
- **Atualização Automática:** Estoque baixa automaticamente na venda
- **Múltiplos Itens:** Carrinho de compras integrado
- **Notas Fiscais:** Suporte a numeração e série (em desenvolvimento)

### 📊 Dashboard Gerencial
- **Resumo de Produtos:** Total cadastrado e valor em estoque
- **Estoque Baixo:** Alertas de produtos abaixo do mínimo
- **Distribuição por Categoria:** Gráficos visuais
- **Itens Críticos:** Lista dos produtos mais caros e com estoque crítico
- **Movimentação:** Histórico de entradas e saídas

---

## 📸 Screenshots

### Dashboard
<div align="center">
  <img src="./frontend/public/Screenshot_2.png" alt="Dashboard AutoParts" width="100%" style="border-radius: 10px;"/>
  <br/>
  <em>Painel de controle com estatísticas e visão geral</em>
</div>

### Listagem de Produtos
<div align="center">
  <img src="./frontend/public/Screenshot_1.png" alt="Produtos AutoParts" width="100%" style="border-radius: 10px;"/>
  <br/>
  <em>Tela de produtos com cards responsivos</em>
</div>

---

## 🛠 Tecnologias Utilizadas

### Backend
| Tecnologia | Descrição |
|------------|-----------|
| **Node.js** | Runtime JavaScript |
| **TypeScript** | Superset tipado do JavaScript |
| **Express.js** | Framework web minimalista |
| **Prisma ORM** | Object-Relational Mapping moderno |
| **PostgreSQL** | Banco de dados relacional robusto |
| **Dotenv** | Gerenciamento de variáveis de ambiente |

### Frontend
| Tecnologia | Descrição |
|------------|-----------|
| **React 18** | Biblioteca para construção de interfaces |
| **TypeScript** | Tipagem estática para JavaScript |
| **Vite** | Build tool moderna e rápida |
| **React Router** | Navegação SPA (Single Page Application) |
| **Axios** | Cliente HTTP para requisições |
| **CSS3** | Estilização com Flexbox/Grid |

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [PostgreSQL](https://www.postgresql.org/) (versão 14 ou superior)
- [Git](https://git-scm.com/)
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/RFernandes10/autoparts-system.git
cd autoparts-system
```

### 2. Configurar o Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend`:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/autoparts?schema=public"
PORT=3000
```

Execute as migrations do banco de dados:
```bash
npx prisma migrate dev
npx prisma generate
```

Inicie o servidor:
```bash
npm run dev
```

✅ O backend estará rodando em `http://localhost:3000`

### 3. Configurar o Frontend

Abra um **novo terminal**:
```bash
cd frontend
npm install
npm run dev
```

✅ O frontend estará rodando em `http://localhost:5173`

### 4. Acessar a aplicação
Abra seu navegador e acesse: `http://localhost:5173`

---

## 📂 Estrutura do Projeto

```
autoparts-system/
├── backend/              # API REST (Node.js/Express)
│   ├── src/
│   │   ├── controllers/  # Controladores
│   │   ├── services/     # Lógica de negócio
│   │   ├── routes/       # Rotas da API
│   │   └── config/      # Configurações
│   ├── prisma/
│   │   └── schema.prisma # Modelo do banco
│   └── package.json
│
└── frontend/             # Interface web (React)
    ├── src/
    │   ├── components/   # Componentes React
    │   ├── pages/        # Páginas da aplicação
    │   ├── contexts/     # Context API
    │   ├── hooks/        # Custom hooks
    │   ├── services/     # Integração com API
    │   └── types/       # Tipos TypeScript
    ├── public/           # Imagens e estáticos
    └── package.json
```

---

## 🗄️ Modelo de Dados (Principal)

| Tabela | Descrição |
|---------|-----------|
| `produtos` | Catálogo de produtos com especificações |
| `clientes` | Cadastro de clientes |
| `fornecedores` | Cadastro de fornecedores |
| `vendas` | Registro de vendas |
| `itens_venda` | Itens de cada venda |
| `movimentacoes_estoque` | Histórico de entrada e saída |

---

## 🎯 Status do Projeto

- ✅ Módulo de produtos com layout premium e responsivo
- ✅ Gestão de clientes e fornecedores
- ✅ Dashboard com estatísticas de estoque e categorias
- ✅ Módulo de vendas básico
- 🚧 Relatórios gerenciais (em desenvolvimento)
- 🚧 Autenticação e controle de acessos
- 🚧 PDV (Ponto de Venda) otimizado para balcão

---

## 🎯 Diferenciais

- **Controle de Estoque Inteligente:** Alertas automáticos de reposição
- **Compatibilidade Veicular:** Busca por modelo/marca/ano
- **Categorias Específicas:** Pneus, baterias e autopeças
- **Dashboard Gerencial:** Visão completa do negócio
- **Full-Stack TypeScript:** Tipagem em todo o stack
- **Código Limpo:** Separação de responsabilidades

---

## 📫 Contato

<div align="center">
  <a href="https://www.linkedin.com/in/roberto-wolowitz/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/>
  </a>
  <a href="mailto:robertofernandes144@gmail.com">
    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white"/>
  </a>
  <a href="https://github.com/RFernandes10">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white"/>
  </a>
</div>

---

<div align="center">
  <h3>⭐ Se este projeto foi útil, considere dar uma estrela!</h3>
  <p>Feito com ❤️ e ☕ por <strong>Roberto Fernandes</strong></p>
  <p><em>Projeto focado em aprendizado com boas práticas de front-end, back-end e versionamento</em></p>
</div>
