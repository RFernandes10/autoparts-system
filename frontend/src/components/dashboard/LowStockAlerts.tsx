import { FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import type { Produto } from "../../types";

type ProdutoAlerta = Produto & {
  percentual: number;
  nivel: "critico" | "urgente" | "baixo";
};

type Props = {
  produtosEstoqueBaixo: ProdutoAlerta[];
};

const nivelConfig = {
  critico: {
    badgeBg: "#b91c1c",
    badgeText: "#ffffff",
    border: "#ef4444",
    progressFrom: "#b91c1c",
    progressTo: "#ef4444",
  },
  urgente: {
    badgeBg: "#ea580c",
    badgeText: "#ffffff",
    border: "#fb923c",
    progressFrom: "#ea580c",
    progressTo: "#f97316",
  },
  baixo: {
    badgeBg: "#eab308",
    badgeText: "#ffffff",
    border: "#facc15",
    progressFrom: "#eab308",
    progressTo: "#f59e0b",
  },
} as const;

export const LowStockAlerts = ({ produtosEstoqueBaixo }: Props) => {
  const temAlertas = produtosEstoqueBaixo.length > 0;

  return (
    <div
      style={{
        background: temAlertas
          ? "linear-gradient(to bottom right, #fef2f2, #fee2e2)"
          : "linear-gradient(to bottom right, #ecfdf5, #dcfce7)",
        borderRadius: "1rem",
        padding: "1.5rem",
        boxShadow: "0 1px 3px 0 rgba(0,0,0,0.08)",
        border: `1px solid ${temAlertas ? "#fecaca" : "#bbf7d0"}`,
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
          marginBottom: "0.5rem",
        }}
      >
        <h3
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "1rem",
            fontWeight: 700,
            color: temAlertas ? "#991b1b" : "#166534",
            margin: 0,
          }}
        >
          <FaExclamationTriangle
            style={{ color: temAlertas ? "#ef4444" : "#22c55e" }}
          />
          Ação Necessária
        </h3>
        <span
          style={{
            fontSize: "0.875rem",
            color: temAlertas ? "#6b7280" : "#16a34a",
          }}
        >
          {temAlertas
            ? `${produtosEstoqueBaixo.length} produto(s) precisam de atenção`
            : "Todos os produtos em níveis adequados"}
        </span>
      </div>

      {temAlertas ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {produtosEstoqueBaixo.map((produto) => {
            const cfg = nivelConfig[produto.nivel];

            return (
              <div
                key={produto.id}
                style={{
                  borderLeft: `4px solid ${cfg.border}`,
                  backgroundColor: "white",
                  borderRadius: "0.75rem",
                  padding: "0.9rem 1rem",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.06)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 15px -3px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 6px -1px rgba(0,0,0,0.06)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                  }}
                >
                  {/* Título + badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        color: "#111827",
                      }}
                    >
                      {produto.nome}
                    </span>
                    <span
                      style={{
                        borderRadius: "999px",
                        padding: "0.15rem 0.6rem",
                        fontSize: "0.6rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        backgroundColor: cfg.badgeBg,
                        color: cfg.badgeText,
                      }}
                    >
                      {produto.nivel}
                    </span>
                  </div>

                  {/* Infos */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.75rem",
                      color: "#6b7280",
                    }}
                  >
                    <span>
                      Atual:{" "}
                      <strong style={{ color: "#111827" }}>
                        {produto.estoqueAtual}
                      </strong>
                    </span>
                    <span style={{ color: "#d1d5db" }}>•</span>
                    <span>
                      Mínimo:{" "}
                      <strong style={{ color: "#111827" }}>
                        {produto.estoqueMinimo}
                      </strong>
                    </span>
                    <span style={{ marginLeft: "auto", color: "#9ca3af" }}>
                      {Math.round(produto.percentual)}% do mínimo
                    </span>
                  </div>

                  {/* Barra de progresso */}
                  <div
                    style={{
                      height: "0.5rem",
                      width: "100%",
                      borderRadius: "999px",
                      backgroundColor: "#e5e7eb",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.min(produto.percentual, 100)}%`,
                        borderRadius: "999px",
                        backgroundImage: `linear-gradient(to right, ${cfg.progressFrom}, ${cfg.progressTo})`,
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>

                  {/* Botão */}
                  <button
                    style={{
                      marginTop: "0.35rem",
                      width: "100%",
                      borderRadius: "0.5rem",
                      border: "none",
                      padding: "0.5rem 0.75rem",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      backgroundImage:
                        "linear-gradient(to right, #3b82f6, #2563eb)",
                      color: "white",
                      cursor: "pointer",
                      boxShadow: "0 4px 6px -1px rgba(37,99,235,0.4)",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow =
                        "0 10px 15px -3px rgba(37,99,235,0.6)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 6px -1px rgba(37,99,235,0.4)";
                    }}
                  >
                    Solicitar Reposição
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            borderRadius: "0.9rem",
            backgroundColor: "white",
            border: "1px solid #bbf7d0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.75rem 1.25rem",
            textAlign: "center",
            gap: "0.75rem",
            boxShadow: "0 4px 6px -1px rgba(16,185,129,0.25)",
          }}
        >
          <div
            style={{
              width: "3.5rem",
              height: "3.5rem",
              borderRadius: "999px",
              backgroundImage:
                "linear-gradient(to bottom right, #22c55e, #16a34a)",
              display: "grid",
              placeItems: "center",
              color: "white",
              boxShadow: "0 10px 15px -3px rgba(34,197,94,0.4)",
            }}
          >
            <FaCheckCircle size={26} />
          </div>
          <p
            style={{
              fontSize: "0.9rem",
              fontWeight: 500,
              color: "#166534",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Parabéns! Todos os produtos estão com estoque adequado.
          </p>
        </div>
      )}
    </div>
  );
};

export default LowStockAlerts;
