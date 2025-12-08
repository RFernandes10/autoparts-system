import {
  FaSearch,
  FaTools,
  FaCarBattery,
  FaList,
  FaGripHorizontal,
} from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";
import type { Produto } from "../../types";

interface ProdutoFilterBarProps {
  busca: string;
  onBuscaChange: (value: string) => void;
  filtroCategoria: string;
  onFiltroCategoriaChange: (value: string) => void;
  produtos: Produto[];
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export function ProdutoFilterBar({
  busca,
  onBuscaChange,
  filtroCategoria,
  onFiltroCategoriaChange,
  produtos,
  viewMode,
  onViewModeChange,
}: ProdutoFilterBarProps) {
  const categorias = [
    {
      id: "TODOS",
      label: "Todos",
      icon: null,
      count: produtos.length,
      color: "#6b7280",
    },
    {
      id: "AUTOPECA",
      label: "Autopeças",
      icon: FaTools,
      count: produtos.filter((p) => p.categoria === "AUTOPECA").length,
      color: "#3b82f6",
    },
    {
      id: "BATERIA",
      label: "Baterias",
      icon: FaCarBattery,
      count: produtos.filter((p) => p.categoria === "BATERIA").length,
      color: "#10b981",
    },
    {
      id: "PNEU",
      label: "Pneus",
      icon: GiCarWheel,
      count: produtos.filter((p) => p.categoria === "PNEU").length,
      color: "#f59e0b",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.25rem",
        borderRadius: "0.75rem",
        border: "1px solid #e5e7eb",
        backgroundColor: "white",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        gap: "1.5rem",
        flexWrap: "wrap",
      }}
    >
      {/* Lado Esquerdo: Busca + Filtros */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          flex: 1,
          flexWrap: "wrap",
        }}
      >
        {/* Campo de busca */}
        <div
          style={{ position: "relative", minWidth: "300px", flex: "0 1 auto" }}
        >
          <FaSearch
            style={{
              position: "absolute",
              top: "50%",
              left: "1rem",
              transform: "translateY(-50%)",
              color: "#9ca3af",
              fontSize: "0.875rem",
            }}
          />
          <input
            type="text"
            placeholder="Buscar por nome ou código..."
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem 0.75rem 2.75rem",
              borderRadius: "0.625rem",
              border: "2px solid #e5e7eb",
              backgroundColor: "#f9fafb",
              fontSize: "0.875rem",
              color: "#111827",
              fontWeight: "500",
              transition: "all 0.2s",
              outline: "none",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#6366f1";
              e.target.style.backgroundColor = "white";
              e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e5e7eb";
              e.target.style.backgroundColor = "#f9fafb";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Filtros de categoria */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            flexWrap: "wrap",
          }}
        >
          {categorias.map(({ id, label, icon: Icon, count, color }) => {
            const isActive = filtroCategoria === id;

            return (
              <button
                key={id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.625rem 1rem",
                  borderRadius: "0.625rem",
                  border: isActive
                    ? `2px solid ${color}`
                    : "2px solid transparent",
                  backgroundColor: isActive ? `${color}15` : "#f9fafb",
                  color: isActive ? color : "#6b7280",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  outline: "none",
                }}
                onClick={() => onFiltroCategoriaChange(id)}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "#f9fafb";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                {Icon && <Icon size={14} />}
                <span>{label}</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    color: isActive ? color : "#9ca3af",
                    backgroundColor: isActive ? `${color}25` : "#e5e7eb",
                    padding: "0.125rem 0.5rem",
                    borderRadius: "9999px",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lado Direito: Seletor de visualização */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            backgroundColor: "#f3f4f6",
            borderRadius: "0.625rem",
            padding: "0.25rem",
            gap: "0.25rem",
          }}
        >
          <button
            style={{
              backgroundColor: viewMode === "list" ? "white" : "transparent",
              border: "none",
              padding: "0.625rem 0.75rem",
              cursor: "pointer",
              color: viewMode === "list" ? "#6366f1" : "#6b7280",
              borderRadius: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              boxShadow:
                viewMode === "list" ? "0 1px 3px 0 rgba(0, 0, 0, 0.1)" : "none",
              outline: "none",
            }}
            onClick={() => onViewModeChange("list")}
            title="Ver em lista"
            onMouseEnter={(e) => {
              if (viewMode !== "list") {
                e.currentTarget.style.backgroundColor = "#e5e7eb";
              }
            }}
            onMouseLeave={(e) => {
              if (viewMode !== "list") {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <FaList size={16} />
          </button>
          <button
            style={{
              backgroundColor: viewMode === "grid" ? "white" : "transparent",
              border: "none",
              padding: "0.625rem 0.75rem",
              cursor: "pointer",
              color: viewMode === "grid" ? "#6366f1" : "#6b7280",
              borderRadius: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              boxShadow:
                viewMode === "grid" ? "0 1px 3px 0 rgba(0, 0, 0, 0.1)" : "none",
              outline: "none",
            }}
            onClick={() => onViewModeChange("grid")}
            title="Ver em grade"
            onMouseEnter={(e) => {
              if (viewMode !== "grid") {
                e.currentTarget.style.backgroundColor = "#e5e7eb";
              }
            }}
            onMouseLeave={(e) => {
              if (viewMode !== "grid") {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <FaGripHorizontal size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
