import { Link, Outlet } from 'react-router-dom';
import './Layout.css';

function Layout() {
  return (
    <div className="layout">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>Sistema de Autopeças</h1>
          <p className="subtitle">Gestão Completa</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="navbar">
        <ul className="nav-list">
          <li>
            <Link to="/" className="nav-link">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/produtos" className="nav-link">
              Produtos
            </Link>
          </li>
          <li>
            <Link to="/clientes" className="nav-link">
              Clientes
            </Link>
          </li>
          <li>
            <Link to="/fornecedores" className="nav-link">
              Fornecedores
            </Link>
          </li>
          <li>
            <Link to="/vendas" className="nav-link">
              Vendas
            </Link>
          </li>
          <li>
            <Link to="/relatorios" className="nav-link">
              Relatórios
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Sistema de Autopeças - Desenvolvido para gestão profissional</p>
      </footer>
    </div>
  );
}

export default Layout;
