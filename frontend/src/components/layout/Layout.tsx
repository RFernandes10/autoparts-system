import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxes,
  FaUsers,
  FaTruck,
  FaShoppingCart,
  FaChartBar,
  FaCog,
  FaBell,
  FaSignOutAlt,
} from "react-icons/fa";
import "./Layout.css";

function Layout() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/produtos", label: "Produtos", icon: <FaBoxes /> },
    { path: "/clientes", label: "Clientes", icon: <FaUsers /> },
    { path: "/fornecedores", label: "Fornecedores", icon: <FaTruck /> },
    { path: "/vendas", label: "Vendas", icon: <FaShoppingCart /> },
    { path: "/relatorios", label: "Relatórios", icon: <FaChartBar /> },
  ];

  return (
    <div className="layout">
      {/* Sidebar Navigation */}
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

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-content">
            <div className="topbar-title">
              <h1>
                {navItems.find((item) => item.path === location.pathname)
                  ?.label || "Dashboard"}
              </h1>
              <span className="breadcrumb">
                Sistema de Gestão /{" "}
                {navItems.find((item) => item.path === location.pathname)
                  ?.label || "Painel"}
              </span>
            </div>

            <div className="topbar-actions">
              <button className="topbar-btn">
                <FaBell />
                <span className="badge">3</span>
              </button>

              <div className="user-menu">
                <div className="user-info">
                  <span className="user-name">Roberto Fernandes</span>
                  <span className="user-role">Administrador</span>
                </div>
                <div className="user-avatar">RF</div>
              </div>

              <button className="topbar-btn logout">
                <FaSignOutAlt />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="content">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <span>
              © 2025 AutoParts System. Desenvolvido por Roberto Fernandes
            </span>
            <span className="footer-version">v1.0.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Layout;
