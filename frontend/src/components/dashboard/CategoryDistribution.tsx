import { FaChartLine, FaInbox } from "react-icons/fa";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { useTheme } from "../../contexts/ThemeContext";
import { renderCustomizedLabel, CustomLegend, CustomTooltip } from "./Charts";

type Props = {
  categorias: { autopecas: number; baterias: number; pneus: number };
};

export const CategoryDistribution = ({ categorias }: Props) => {
  const { theme } = useTheme();

  const data = [
    { name: "Autopeças", value: categorias.autopecas },
    { name: "Baterias", value: categorias.baterias },
    { name: "Pneus", value: categorias.pneus },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const COLORS =
    theme === "dark"
      ? ["#FF8042", "#00C49F", "#0088FE"]
      : ["#FF9F40", "#00D1A1", "#3A99FF"];

  return (
    <div
      style={{
        backgroundColor: theme === "dark" ? "#020617" : "white",
        borderRadius: "1rem",
        padding: "1.5rem",
        boxShadow: "0 1px 3px 0 rgba(0,0,0,0.08)",
        border: `1px solid ${theme === "dark" ? "#1f2937" : "#e5e7eb"}`,
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
          alignItems: "center",
          justifyContent: "space-between",
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
            color: theme === "dark" ? "#e5e7eb" : "#111827",
            margin: 0,
          }}
        >
          <span
            style={{
              width: "2rem",
              height: "2rem",
              borderRadius: "0.75rem",
              background:
                "linear-gradient(to bottom right, #3b82f6, #22c55e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 12px -3px rgba(37,99,235,0.4)",
            }}
          >
            <FaChartLine style={{ color: "white" }} />
          </span>
          Distribuição por Categoria
        </h3>
      </div>

      {/* Gráfico / estado vazio */}
      <div style={{ width: "100%", height: 260 }}>
        {total > 0 ? (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: theme === "dark" ? "#9ca3af" : "#6b7280",
              gap: "0.5rem",
            }}
          >
            <FaInbox size={32} />
            <p
              style={{
                margin: 0,
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              Nenhum produto para exibir
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDistribution;
