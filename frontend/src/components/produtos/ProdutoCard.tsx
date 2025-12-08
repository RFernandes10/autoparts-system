import type { Produto } from "../../types";
import {
  FaCarBattery,
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
  FaDollarSign,
  FaBox,
} from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";
import { formatarMoeda } from "../../utils/formatters";

interface ProdutoCardProps {
  produto: Produto;
  onEdit: (produto: Produto) => void;
  onDelete: (produto: Produto) => void;
}

const getEspecificacoesBateria = (produto: Produto) => {
  if (!produto.especificacoesBateria) return null;
  return Array.isArray(produto.especificacoesBateria)
    ? produto.especificacoesBateria[0]
    : produto.especificacoesBateria;
};

const getEspecificacoesPneu = (produto: Produto) => {
  if (!produto.especificacoesPneu) return null;
  return Array.isArray(produto.especificacoesPneu)
    ? produto.especificacoesPneu[0]
    : produto.especificacoesPneu;
};

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

const getTypeConfig = (tipo: string) => {
  switch (tipo.toUpperCase()) {
    case "NOVO":
      return { color: "#10b981", bg: "#d1fae5", label: "Novo" };
    case "USADO":
      return { color: "#f59e0b", bg: "#fef3c7", label: "Usado" };
    case "SEMINOVO":
      return { color: "#3b82f6", bg: "#dbeafe", label: "Seminovo" };
    default:
      return { color: "#6b7280", bg: "#e5e7eb", label: tipo };
  }
};

export function ProdutoCard({ produto, onEdit, onDelete }: ProdutoCardProps) {
  const especBateria = getEspecificacoesBateria(produto);
  const especPneu = getEspecificacoesPneu(produto);
  const categoryConfig = getCategoryConfig(produto.categoria);
  const typeConfig = getTypeConfig(produto.tipoProduto);

  const estoquePercent = Math.min(
    (produto.estoqueAtual / (produto.estoqueMinimo * 2)) * 100,
    100
  );

  const isStockLow = produto.estoqueAtual <= produto.estoqueMinimo;

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "1rem",
        padding: "1.75rem 1.5rem", // mais respiro vertical
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        border: "1px solid #e5e7eb",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        position: "relative",
        overflow: "visible",
        height: "100%",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow =
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
        e.currentTarget.style.borderColor = categoryConfig.color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
        e.currentTarget.style.borderColor = "#e5e7eb";
      }}
    >
      {/* Barra colorida superior */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: `linear-gradient(to right, ${categoryConfig.color}, ${typeConfig.color})`,
        }}
      />

      {/* Conteúdo principal que cresce */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          flex: 1,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "0.75rem",
          }}
        >
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "700",
                color: "#111827",
                margin: 0,
                lineHeight: "1.4",
              }}
            >
              {produto.nome}
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "0.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.7rem",
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
                  fontSize: "0.7rem",
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
          </div>
          <span
            style={{
              padding: "0.375rem 0.75rem",
              borderRadius: "0.5rem",
              fontSize: "0.7rem",
              fontWeight: "700",
              textTransform: "uppercase",
              color: typeConfig.color,
              backgroundColor: typeConfig.bg,
              whiteSpace: "nowrap",
            }}
          >
            {typeConfig.label}
          </span>
        </div>

        {/* Bloco de texto (descrição + compatibilidade + especificações) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
            maxHeight: "4.8rem",
            overflow: "hidden",
          }}
        >
          {produto.descricao && (
            <p
              style={{
                fontSize: "0.8125rem",
                color: "#6b7280",
                lineHeight: "1.5",
                margin: 0,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {produto.descricao}
            </p>
          )}

          {produto.compatibilidadeVeiculos &&
            produto.compatibilidadeVeiculos.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.8125rem",
                }}
              >
                <span style={{ fontWeight: "600", color: "#111827" }}>
                  Compatível:
                </span>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.375rem",
                  }}
                >
                  {produto.compatibilidadeVeiculos
                    .slice(0, 2)
                    .map((comp, idx) => (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: "#f3f4f6",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.375rem",
                          fontSize: "0.7rem",
                          color: "#6b7280",
                          fontWeight: "500",
                        }}
                      >
                        {comp.marcaVeiculo} {comp.modeloVeiculo}
                      </span>
                    ))}
                  {produto.compatibilidadeVeiculos.length > 2 && (
                    <span
                      style={{
                        backgroundColor: "#f3f4f6",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.375rem",
                        fontSize: "0.7rem",
                        color: "#6b7280",
                        fontWeight: "700",
                      }}
                    >
                      +{produto.compatibilidadeVeiculos.length - 2}
                    </span>
                  )}
                </div>
              </div>
            )}

          {especBateria &&
            (especBateria.amperagem || especBateria.voltagem) && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.8125rem",
                  color: "#6b7280",
                }}
              >
                <FaCarBattery size={14} style={{ color: "#10b981" }} />
                <span>
                  {especBateria.amperagem && `${especBateria.amperagem}Ah`}
                  {especBateria.amperagem && especBateria.voltagem && " / "}
                  {especBateria.voltagem && `${especBateria.voltagem}V`}
                  {especBateria.tipoBateria && ` • ${especBateria.tipoBateria}`}
                  {especBateria.marca && ` • ${especBateria.marca}`}
                  {especBateria.garantiaMeses &&
                    ` • ${especBateria.garantiaMeses}m garantia`}
                </span>
              </div>
            )}

          {especPneu && (especPneu.medida || especPneu.marca) && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.8125rem",
                color: "#6b7280",
              }}
            >
              <GiCarWheel size={14} style={{ color: "#f59e0b" }} />
              <span>
                {especPneu.medida && `${especPneu.medida}`}
                {especPneu.medida && especPneu.marca && " • "}
                {especPneu.marca && `${especPneu.marca}`}
              </span>
            </div>
          )}
        </div>

        {/* Preços */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            backgroundColor: "#f9fafb",
            borderRadius: "0.75rem",
            padding: "1rem",
            gap: "1rem",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                display: "block",
                fontSize: "0.7rem",
                color: "#6b7280",
                marginBottom: "0.25rem",
                fontWeight: "500",
              }}
            >
              Custo
            </span>
            <span
              style={{
                fontSize: "1rem",
                fontWeight: "700",
                color: "#111827",
              }}
            >
              {formatarMoeda(Number(produto.precoCompra))}
            </span>
          </div>
          <div
            style={{
              width: "1px",
              height: "2.5rem",
              backgroundColor: "#e5e7eb",
            }}
          />
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                display: "block",
                fontSize: "0.7rem",
                color: "#6b7280",
                marginBottom: "0.25rem",
                fontWeight: "500",
              }}
            >
              Venda
            </span>
            <span
              style={{
                fontSize: "1rem",
                fontWeight: "700",
                color: "#10b981",
              }}
            >
              {formatarMoeda(Number(produto.precoVenda))}
            </span>
          </div>
        </div>

        {/* Estoque */}
        <div
          style={{
            backgroundColor: isStockLow ? "#fef2f2" : "#f0fdf4",
            borderRadius: "0.75rem",
            padding: "0.875rem",
            border: `1px solid ${isStockLow ? "#fecaca" : "#bbf7d0"}`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.625rem",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <FaBox
                size={14}
                style={{ color: isStockLow ? "#dc2626" : "#10b981" }}
              />
              <span
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: "600",
                  color: "#111827",
                }}
              >
                Estoque
              </span>
            </div>
            {isStockLow && (
              <span
                style={{
                  backgroundColor: "#fbbf24",
                  color: "#78350f",
                  padding: "0.25rem 0.625rem",
                  borderRadius: "9999px",
                  fontSize: "0.7rem",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                }}
              >
                <FaExclamationTriangle size={10} /> Baixo
              </span>
            )}
          </div>
          <div
            style={{
              width: "100%",
              height: "0.5rem",
              backgroundColor: isStockLow ? "#fee2e2" : "#dcfce7",
              borderRadius: "9999px",
              overflow: "hidden",
              marginBottom: "0.625rem",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: "9999px",
                backgroundColor: isStockLow ? "#dc2626" : "#10b981",
                width: `${estoquePercent}%`,
                transition: "width 0.3s ease-in-out",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.7rem",
              color: "#6b7280",
            }}
          >
            <span>
              Atual:{" "}
              <strong style={{ fontWeight: "700", color: "#111827" }}>
                {produto.estoqueAtual}
              </strong>
            </span>
            <span>
              Mínimo:{" "}
              <strong style={{ fontWeight: "700", color: "#111827" }}>
                {produto.estoqueMinimo}
              </strong>
            </span>
          </div>
        </div>

        {/* Valor Total em Estoque */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.8125rem",
            color: "#6b7280",
            paddingTop: "0.75rem",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <FaDollarSign size={12} style={{ color: "#10b981" }} />
          <span>
            Valor em estoque:{" "}
            <strong style={{ fontWeight: "700", color: "#111827" }}>
              {formatarMoeda(Number(produto.precoVenda) * produto.estoqueAtual)}
            </strong>
          </span>
        </div>
      </div>

      {/* Botões de Ação */}
      <div
        style={{
          display: "flex",
          gap: "0.625rem",
          marginTop: "1rem", // mais espaço antes dos botões
        }}
      >
        <button
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            padding: "0.6rem 1rem",
            borderRadius: "0.625rem",
            fontSize: "0.8125rem",
            fontWeight: "600",
            border: "none",
            backgroundColor: "#6366f1",
            color: "white",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onClick={() => onEdit(produto)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#4f46e5";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow =
              "0 4px 6px -1px rgba(99, 102, 241, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#6366f1";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <FaEdit size={14} /> Editar
        </button>
        <button
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            padding: "0.6rem 1rem",
            borderRadius: "0.625rem",
            fontSize: "0.8125rem",
            fontWeight: "600",
            border: "none",
            backgroundColor: "#ef4444",
            color: "white",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onClick={() => onDelete(produto)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#dc2626";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow =
              "0 4px 6px -1px rgba(239, 68, 68, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#ef4444";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <FaTrash size={14} /> Excluir
        </button>
      </div>
    </div>
  );
}

export default ProdutoCard;
