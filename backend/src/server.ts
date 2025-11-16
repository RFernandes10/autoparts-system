import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./config/database";

// Importar rotas (criaremos a seguir)
import produtoRoutes from "./routes/produto.routes";
import usuarioRoutes from "./routes/usuario.routes";
import clienteRoutes from "./routes/cliente.routes";
import fornecedorRoutes from "./routes/fornecedor.routes";
import vendaRoutes from "./routes/venda.routes";
import servicoRoutes from "./routes/servico.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de teste
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API Sistema de Autopeças - Online" });
});

// Rotas da API
app.use("/api/produtos", produtoRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/fornecedores", fornecedorRoutes);
app.use("/api/vendas", vendaRoutes);
app.use("/api/servicos", servicoRoutes);

// Configuração do CORS
const corsOptions = {
  origin: "http://localhost:5173", // URL do Vite
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || "development"}`);
});

// Tratamento de erros do Prisma
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
