import {
  FaBoxes,
  FaExclamationTriangle,
  FaDollarSign,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const formatarMoeda = (valor: number) => {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

type Estatisticas = {
  totalProdutos: number;
  estoqueBaixo: number;
  valorTotalEstoque: number;
};

type DashboardMetricsProps = {
  estatisticas: Estatisticas;
  mostrarValor: boolean;
  toggleMostrarValor: () => void;
};

type KpiCardProps = {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  value: number | string;
  subtitle: string;
  color: "blue" | "yellow" | "green";
  badgeText?: string;
  badgeColor?: string;
  children?: React.ReactNode;
};

const getColorConfig = (color: KpiCardProps["color"]) => {
  switch (color) {
    case "blue":
      return {
        iconBg: "linear-gradient(to bottom right, #3b82f6, #60a5fa)",
        borderTop: "linear-gradient(to right, #3b82f6, #60a5fa)",
      };
    case "yellow":
      return {
        iconBg: "linear-gradient(to bottom right, #f59e0b, #fbbf24)",
        borderTop: "linear-gradient(to right, #f59e0b, #fbbf24)",
      };
    case "green":
      return {
        iconBg: "linear-gradient(to bottom right, #10b981, #22c55e)",
        borderTop: "linear-gradient(to right, #10b981, #22c55e)",
      };
  }
};

const KpiCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
  badgeText,
  children,
}: KpiCardProps) => {
  const colors = getColorConfig(color);

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "white",
        borderRadius: "1rem",
        padding: "1.5rem",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.08)",
        border: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        overflow: "hidden",
        transition: "all 0.25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow =
          "0 20px 25px -5px rgba(15, 23, 42, 0.12)";
        e.currentTarget.style.borderColor = "#cbd5f5";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.08)";
        e.currentTarget.style.borderColor = "#e5e7eb";
      }}
    >
      {/* Barra superior */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: colors.borderTop,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: "3rem",
            height: "3rem",
            borderRadius: "0.9rem",
            background: colors.iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
            flexShrink: 0,
          }}
        >
          <Icon size={20} style={{ color: "white" }} />
        </div>

        <div style={{ flex: 1, textAlign: "right" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.25rem",
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {title}
            </span>
            {badgeText && (
              <span
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  padding: "0.15rem 0.5rem",
                  borderRadius: "999px",
                  backgroundColor:
                    title === "Alertas Críticos" && Number(value) > 0
                      ? "#fef2f2"
                      : "#ecfdf3",
                  color:
                    title === "Alertas Críticos" && Number(value) > 0
                      ? "#b91c1c"
                      : "#15803d",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {badgeText}
              </span>
            )}
          </div>

          <div
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1.1,
            }}
          >
            {value}
          </div>

          <p
            style={{
              marginTop: "0.35rem",
              fontSize: "0.8rem",
              color: "#9ca3af",
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      {children && (
        <div
          style={{
            marginTop: "0.5rem",
            paddingTop: "0.75rem",
            borderTop: "1px dashed #e5e7eb",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const DashboardMetrics = ({
  estatisticas,
  mostrarValor,
  toggleMostrarValor,
}: DashboardMetricsProps) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "1rem",
      }}
    >
      <KpiCard
        icon={FaBoxes}
        title="Total de Produtos"
        value={estatisticas.totalProdutos}
        badgeText="Ativo"
        subtitle="Itens em estoque"
        color="blue"
      />

      <KpiCard
        icon={FaExclamationTriangle}
        title="Alertas Críticos"
        value={estatisticas.estoqueBaixo}
        badgeText={estatisticas.estoqueBaixo > 0 ? "Urgente" : "OK"}
        subtitle="Produtos abaixo do mínimo"
        color="yellow"
      />

      <KpiCard
        icon={FaDollarSign}
        title="Valor em Estoque"
        value={
          mostrarValor ? formatarMoeda(estatisticas.valorTotalEstoque) : "•••••"
        }
        subtitle="Capital investido"
        color="green"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#6b7280",
            }}
          >
            Valor em estoque
          </span>
          <button
            onClick={toggleMostrarValor}
            title={mostrarValor ? "Ocultar valor" : "Mostrar valor"}
            aria-label={mostrarValor ? "Ocultar valor" : "Mostrar valor"}
            style={{
              border: "none",
              backgroundColor: "transparent",
              padding: "0.25rem",
              borderRadius: "999px",
              cursor: "pointer",
              color: "#9ca3af",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f3f4f6";
              e.currentTarget.style.color = "#10b981";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#9ca3af";
            }}
          >
            {mostrarValor ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
          </button>
          
        </div>
      </KpiCard>
    </div>
  );
};
