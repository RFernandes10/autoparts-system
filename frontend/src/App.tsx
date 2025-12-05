import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import DashboardPage from "./pages/DashboardPage";
import ProdutosPage from "./pages/ProdutosPage";
import ClientesPage from "./pages/ClientesPage";
import FornecedoresPage from "./pages/FornecedoresPage";
import VendasPage from "./pages/VendasPage";
import { ThemeProvider } from "./contexts/ThemeContext";
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="produtos" element={<ProdutosPage />} />
            <Route path="clientes" element={<ClientesPage />} />
            <Route path="fornecedores" element={<FornecedoresPage />} />
            <Route path="vendas" element={<VendasPage />} />
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
    </ThemeProvider>
  );
}

export default App;
