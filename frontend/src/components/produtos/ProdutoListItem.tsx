import type { Produto } from "../../types";
import { FaEdit, FaTrash, FaExclamationTriangle, FaBox } from "react-icons/fa";
import { formatarMoeda } from "../../utils/formatters";

interface ProdutoListItemProps {
  produto: Produto;
  onEdit: (produto: Produto) => void;
  onDelete: (produto: Produto) => void;
}

const getCategoryConfig = (categoria: string) => {
  switch (categoria.toUpperCase()) {
    case "AUTOPECA":
      return { color: "#3b82f6", bg: "#eff6ff", label: "Autopeças" };
    case "BATERIA":
      return { color: "#10b981", bg: "#ecfdf5", label: "Bateria" };
    case "PNEU":
      return { color: "#f59e0b", bg: "#fffbeb", label: "Pneu" };
    default:
      return { color: "#6b7280", bg: "#f3f4f6", label: categoria };
  }
};

export function ProdutoListItem({
  produto,
  onEdit,
  onDelete,
}: ProdutoListItemProps) {
  const isStockLow = produto.estoqueAtual <= produto.estoqueMinimo;
  const categoryConfig = getCategoryConfig(produto.categoria);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 1.25rem",
        border: "1px solid #e5e7eb",
        borderRadius: "0.75rem",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        backgroundColor: "white",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
        e.currentTarget.style.borderColor = categoryConfig.color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#e5e7eb";
      }}
    >
      {/* Barra lateral colorida */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "4px",
          backgroundColor: categoryConfig.color,
        }}
      />

      {/* Info do Produto */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "0.375rem",
          paddingLeft: "0.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <span
            style={{
              fontSize: "0.75rem",
              color: "#6b7280",
              fontFamily: "monospace",
              backgroundColor: "#f3f4f6",
              padding: "0.25rem 0.5rem",
              borderRadius: "0.375rem",
              fontWeight: "600",
            }}
          >
            {produto.codigoProduto}
          </span>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: "600",
              color: categoryConfig.color,
              backgroundColor: categoryConfig.bg,
              padding: "0.25rem 0.5rem",
              borderRadius: "0.375rem",
            }}
          >
            {categoryConfig.label}
          </span>
        </div>
        <span
          style={{ fontWeight: "600", color: "#111827", fontSize: "0.9375rem" }}
        >
          {produto.nome}
        </span>
      </div>

      {/* Dados */}
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        {/* Estoque */}
        <div style={{ textAlign: "right", minWidth: "100px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "0.375rem",
              marginBottom: "0.25rem",
            }}
          >
            <FaBox
              size={12}
              style={{ color: isStockLow ? "#dc2626" : "#6b7280" }}
            />
            <span
              style={{
                fontSize: "0.75rem",
                color: "#6b7280",
                fontWeight: "500",
              }}
            >
              Estoque
            </span>
          </div>
          <span
            style={{
              fontWeight: "700",
              fontSize: "1rem",
              color: isStockLow ? "#dc2626" : "#111827",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "0.375rem",
            }}
          >
            {isStockLow && (
              <FaExclamationTriangle size={12} style={{ color: "#fbbf24" }} />
            )}
            {produto.estoqueAtual}
          </span>
        </div>

        {/* Preço */}
        <div style={{ textAlign: "right", minWidth: "120px" }}>
          <span
            style={{
              display: "block",
              fontSize: "0.75rem",
              color: "#6b7280",
              marginBottom: "0.25rem",
              fontWeight: "500",
            }}
          >
            Preço Venda
          </span>
          <span
            style={{ fontWeight: "700", fontSize: "1rem", color: "#10b981" }}
          >
            {formatarMoeda(Number(produto.precoVenda))}
          </span>
        </div>

        {/* Valor Total */}
        <div style={{ textAlign: "right", minWidth: "120px" }}>
          <span
            style={{
              display: "block",
              fontSize: "0.75rem",
              color: "#6b7280",
              marginBottom: "0.25rem",
              fontWeight: "500",
            }}
          >
            Valor Total
          </span>
          <span
            style={{ fontWeight: "700", fontSize: "1rem", color: "#111827" }}
          >
            {formatarMoeda(Number(produto.precoVenda) * produto.estoqueAtual)}
          </span>
        </div>
      </div>

      {/* Ações */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginLeft: "1.5rem",
        }}
      >
        <button
          style={{
            width: "2.25rem",
            height: "2.25rem",
            border: "none",
            cursor: "pointer",
            color: "#6b7280",
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            backgroundColor: "transparent",
          }}
          onClick={() => onEdit(produto)}
          title="Editar produto"
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#6366f1";
            e.currentTarget.style.backgroundColor = "#eff6ff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#6b7280";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <FaEdit size={16} />
        </button>
        <button
          style={{
            width: "2.25rem",
            height: "2.25rem",
            border: "none",
            cursor: "pointer",
            color: "#6b7280",
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            backgroundColor: "transparent",
          }}
          onClick={() => onDelete(produto)}
          title="Excluir produto"
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#ef4444";
            e.currentTarget.style.backgroundColor = "#fef2f2";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#6b7280";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <FaTrash size={16} />
        </button>
      </div>
    </div>
  );
}
