import { FaDollarSign } from "react-icons/fa";
import type { Produto } from "../../types";

const formatarMoeda = (valor: number) => {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

type Props = {
  produtosMaisCaros: Produto[];
  mostrarValor: boolean;
};

export const TopProducts = ({ produtosMaisCaros, mostrarValor }: Props) => {
  if (produtosMaisCaros.length === 0) return null;

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "1rem",
        padding: "1.5rem",
        boxShadow: "0 1px 3px 0 rgba(0,0,0,0.08)",
        border: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          marginBottom: "0.25rem",
        }}
      >
        <h3
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "1rem",
            fontWeight: 700,
            color: "#111827",
            margin: 0,
          }}
        >
          <span
            style={{
              width: "2rem",
              height: "2rem",
              borderRadius: "0.75rem",
              background: "linear-gradient(to bottom right, #fbbf24, #f59e0b)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 12px -3px rgba(245,158,11,0.5)",
            }}
          >
            <FaDollarSign style={{ color: "white" }} />
          </span>
          Maior Valor em Estoque
        </h3>
        <span
          style={{
            fontSize: "0.875rem",
            color: "#6b7280",
          }}
        >
          Top 3 produtos
        </span>
      </div>

      {/* Lista */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
        }}
      >
        {produtosMaisCaros.slice(0, 3).map((produto, index) => {
          const destaque =
            index === 0
              ? {
                  from: "#fef3c7",
                  to: "#fde68a",
                  border: "#facc15",
                }
              : {
                  from: "#fefce8",
                  to: "#fef3c7",
                  border: "#fbbf24",
                };

          return (
            <div
              key={produto.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 0.9rem",
                borderRadius: "0.85rem",
                backgroundImage: `linear-gradient(to bottom right, ${destaque.from}, ${destaque.to})`,
                border: `1px solid ${destaque.border}`,
                boxShadow:
                  index === 0
                    ? "0 10px 15px -3px rgba(250,204,21,0.4)"
                    : "0 4px 6px -1px rgba(250,204,21,0.25)",
                transition: "all 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 18px -4px rgba(250,204,21,0.55)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  index === 0
                    ? "0 10px 15px -3px rgba(250,204,21,0.4)"
                    : "0 4px 6px -1px rgba(250,204,21,0.25)";
              }}
            >
              {/* Rank */}
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "0.6rem",
                  backgroundColor: "white",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "#f59e0b",
                  flexShrink: 0,
                }}
              >
                #{index + 1}
              </div>

              {/* Info produto */}
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#92400e",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {produto.nome}
                </p>
                <p
                  style={{
                    margin: 0,
                    marginTop: "0.15rem",
                    fontSize: "0.75rem",
                    color: "#a16207",
                  }}
                >
                  {produto.estoqueAtual} unidades
                </p>
              </div>

              {/* Valor total */}
              <p
                style={{
                  margin: 0,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: "#92400e",
                  whiteSpace: "nowrap",
                }}
              >
                {mostrarValor
                  ? formatarMoeda(
                      Number(produto.precoVenda) * produto.estoqueAtual
                    )
                  : "••••••"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default TopProducts;
