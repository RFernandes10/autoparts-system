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

  const isDark = theme === "dark";

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: isDark ? "#111827" : "#f9fafb",
        transition: "background-color 0.3s",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "280px",
          backgroundColor: isDark ? "#1f2937" : "white",
          borderRight: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s",
        }}
      >
        {/* Header da Sidebar */}
        <div
          style={{
            padding: "1.5rem",
            borderBottom: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "3rem",
                height: "3rem",
                borderRadius: "0.75rem",
                background:
                  "linear-gradient(to bottom right, #3b82f6, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "1.125rem",
                color: "white",
                boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
              }}
            >
              AP
            </div>
            <span
              style={{
                fontSize: "1.25rem", // reduzido
                fontWeight: "700",
                color: isDark ? "white" : "#111827",
                letterSpacing: "-0.025em",
              }}
            >
              Auto Peças
            </span>
          </div>
        </div>

        {/* Navegação */}
        <nav style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0.75rem 1rem", // levemente menor
                  marginBottom: "0.4rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.875rem", // reduzido
                  fontWeight: 600,
                  textDecoration: "none",
                  color: isActive ? "white" : isDark ? "#d1d5db" : "#6b7280",
                  backgroundColor: isActive ? "transparent" : "transparent",
                  background: isActive
                    ? "linear-gradient(to right, #3b82f6, #8b5cf6)"
                    : "transparent",
                  boxShadow: isActive
                    ? "0 4px 6px -1px rgba(59, 130, 246, 0.3)"
                    : "none",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = isDark
                      ? "#374151"
                      : "#f3f4f6";
                    e.currentTarget.style.color = isDark ? "white" : "#111827";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = isDark
                      ? "#d1d5db"
                      : "#6b7280";
                  }
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer da Sidebar */}
        <div
          style={{
            padding: "1rem",
            borderTop: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
          }}
        >
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0.75rem 1rem",
              width: "100%",
              borderRadius: "0.75rem",
              fontSize: "0.875rem", // reduzido
              fontWeight: 600,
              border: "none",
              backgroundColor: "transparent",
              color: isDark ? "#d1d5db" : "#6b7280",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark
                ? "#374151"
                : "#f3f4f6";
              e.currentTarget.style.color = isDark ? "white" : "#111827";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = isDark ? "#d1d5db" : "#6b7280";
            }}
          >
            <FaCog style={{ fontSize: "1.1rem" }} />
            <span>Configurações</span>
          </button>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Topbar */}
        <header
          style={{
            backgroundColor: isDark ? "#1f2937" : "white",
            borderBottom: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
            padding: "0.9rem 2rem",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h1
              style={{
                fontSize: "1.5rem", // reduzido
                fontWeight: "700",
                color: isDark ? "white" : "#111827",
                margin: 0,
              }}
            >
              {navItems.find((item) => item.path === location.pathname)
                ?.label || "Painel de Controle"}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {/* Botão de Tema */}
              <button
                onClick={toggleTheme}
                style={{
                  width: "2.4rem",
                  height: "2.4rem",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: isDark ? "#374151" : "#f3f4f6",
                  color: isDark ? "#fbbf24" : "#3b82f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontSize: "1rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark
                    ? "#4b5563"
                    : "#e5e7eb";
                  e.currentTarget.style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDark
                    ? "#374151"
                    : "#f3f4f6";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {theme === "light" ? <FaMoon /> : <FaSun />}
              </button>

              {/* User Info */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <span
                  style={{
                    fontSize: "0.8125rem", // reduzido
                    fontWeight: 600,
                    color: isDark ? "white" : "#111827",
                  }}
                >
                  Sistema de Gestão
                </span>
                <span
                  style={{
                    fontSize: "0.7rem", // reduzido
                    color: isDark ? "#9ca3af" : "#6b7280",
                  }}
                >
                  Administrador
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main
          style={{
            flex: 1,
            overflow: "auto",
            padding: "2rem",
            backgroundColor: isDark ? "#111827" : "#f9fafb",
            transition: "background-color 0.3s",
          }}
        >
          <Outlet />
        </main>

        {/* Footer */}
        <footer
          style={{
            backgroundColor: isDark ? "#1f2937" : "white",
            borderTop: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
            padding: "0.85rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.8rem",
            color: isDark ? "#9ca3af" : "#6b7280",
            transition: "all 0.3s",
          }}
        >
          <span>© 2025 AutoParts System Todos os direitos reservados.</span>
          <span
            style={{
              fontWeight: "600",
              color: isDark ? "#d1d5db" : "#374151",
            }}
          >
            v1.0.0
          </span>
        </footer>
      </div>

      {/* Scroll customizado */}
      <style>{`
        * {
          scrollbar-width: thin;
          scrollbar-color: ${isDark ? "#4b5563 #1f2937" : "#cbd5e1 #f1f5f9"};
        }
        
        *::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }
        
        *::-webkit-scrollbar-track {
          background: ${isDark ? "#1f2937" : "#f1f5f9"};
          border-radius: 10px;
        }
        
        *::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 10px;
          border: 2px solid ${isDark ? "#1f2937" : "#f1f5f9"};
        }
        
        *::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </div>
  );
}

export default Layout;
