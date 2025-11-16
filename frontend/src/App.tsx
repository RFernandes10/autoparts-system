import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import DashboardPage from "./pages/DashboardPage";
import ProdutosPage from "./pages/ProdutosPage";
import ClientesPage from "./pages/ClientesPage";
import FornecedoresPage from "./pages/FornecedoresPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="produtos" element={<ProdutosPage />} />
          <Route path="clientes" element={<ClientesPage />} />
          <Route path="fornecedores" element={<FornecedoresPage />} />
          <Route
            path="vendas"
            element={
              <div style={{ padding: "20px" }}>
                Página de Vendas - Em desenvolvimento
              </div>
            }
          />
          <Route
            path="relatorios"
            element={
              <div style={{ padding: "20px" }}>
                Página de Relatórios - Em desenvolvimento
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
