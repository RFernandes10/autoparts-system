import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxes,
  FaUsers,
  FaTruck,
  FaShoppingCart,
  FaChartBar,
  FaSun,
  FaMoon,
  FaBars,
  FaXmark,
} from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";
import { useState, useEffect } from "react";

const navItems = [
  { path: "/", label: "Painel de Controle", icon: FaTachometerAlt },
  { path: "/produtos", label: "Produtos", icon: FaBoxes },
  { path: "/clientes", label: "Clientes", icon: FaUsers },
  { path: "/fornecedores", label: "Fornecedores", icon: FaTruck },
  { path: "/vendas", label: "Vendas", icon: FaShoppingCart },
  { path: "/relatorios", label: "Relatórios", icon: FaChartBar },
];

function Layout() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const pageTitle = navItems.find((item) => item.path === location.pathname)?.label || "Painel de Controle";

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-overlay md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-full w-[260px] flex flex-col bg-card border-r border-border transition-transform duration-200 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-base text-primary-foreground shadow-lg shadow-primary/20">
                AP
              </div>
              <div>
                <span className="text-lg font-bold text-foreground tracking-tight">Auto Peças</span>
                <p className="text-xs text-muted-foreground">Sistema de Gestão</p>
              </div>
            </div>
            <button
              className="md:hidden p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
              onClick={() => setSidebarOpen(false)}
              aria-label="Fechar menu"
            >
              <FaXmark size={16} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                <Icon className="shrink-0" size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-border">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
          >
            {theme === "light" ? <FaMoon size={16} /> : <FaSun size={16} />}
            <span>{theme === "light" ? "Modo Escuro" : "Modo Claro"}</span>
          </button>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-card border-b border-border shadow-sm">
          <div className="flex items-center justify-between px-4 md:px-6 h-16">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                onClick={() => setSidebarOpen(true)}
                aria-label="Abrir menu"
              >
                <FaBars size={18} />
              </button>
              <h1 className="text-xl font-bold text-foreground">{pageTitle}</h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
                aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
              >
                {theme === "light" ? <FaMoon size={15} /> : <FaSun size={15} />}
              </button>
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-foreground">Administrador</span>
                <span className="text-xs text-muted-foreground">admin@autopecas.com</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/30">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-card border-t border-border px-4 md:px-6 py-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>© 2025 AutoParts System. Todos os direitos reservados.</span>
          <span className="font-semibold text-foreground/60">v1.0.0</span>
        </footer>
      </div>
    </div>
  );
}

export default Layout;
