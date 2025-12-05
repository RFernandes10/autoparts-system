import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxes,
  FaUsers,
  FaTruck,
  FaShoppingCart,
  FaChartBar,
  FaCog,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import "./Layout.css";
import { useTheme } from "../../contexts/ThemeContext";

function Layout() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: "/", label: "Painel de Controle", icon: <FaTachometerAlt /> },
    { path: "/produtos", label: "Produtos", icon: <FaBoxes /> },
    { path: "/clientes", label: "Clientes", icon: <FaUsers /> },
    { path: "/fornecedores", label: "Fornecedores", icon: <FaTruck /> },
    { path: "/vendas", label: "Vendas", icon: <FaShoppingCart /> },
    { path: "/relatorios", label: "Relatórios", icon: <FaChartBar /> },
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">AP</div>
            <span className="brand-text">AutoParts</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-link settings">
            <FaCog className="sidebar-icon" />
            <span className="sidebar-label">Configurações</span>
          </button>
        </div>
      </aside>

      <div className="main-wrapper">
        <header className="topbar">
          <div className="topbar-content">
            <h1 className="topbar-title">
              {navItems.find((item) => item.path === location.pathname)
                ?.label || "Painel de Controle"}
            </h1>

            <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                {theme === 'light' ? <FaMoon /> : <FaSun />}
              </button>
              <div className="user-menu">
                <div className="user-info">
                  <span className="user-name">Sistema de Gestão</span>
                  <span className="user-role">Administrador</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>

        <footer className="footer">
          <span>
            © 2025 AutoParts System. Desenvolvido por Roberto Fernandes Engenheiro de Software & Programador FullStack 😎
          </span>
          <span className="footer-version">v1.0.0</span>
        </footer>
      </div>
    </div>
  );
}

export default Layout;
