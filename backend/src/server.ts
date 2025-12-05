import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./config/database";

// Importar rotas
import produtoRoutes from "./routes/produto.routes";
import usuarioRoutes from "./routes/usuario.routes";
import clienteRoutes from "./routes/cliente.routes";
import fornecedorRoutes from "./routes/fornecedor.routes";
import vendaRoutes from "./routes/venda.routes";
import servicoRoutes from "./routes/servico.routes";
import { errorHandler } from "./middlewares/error.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do CORS
const corsOptions = {
  origin: "http://localhost:5173", // URL do Vite
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middlewares
app.use(cors(corsOptions));
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

// Middleware de Tratamento de Erros (DEVE SER O ÚLTIMO)
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || "development"}`);
});

// Tratamento de erros do Prisma
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
