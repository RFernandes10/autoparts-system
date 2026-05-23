import { FaBoxes, FaExclamationTriangle, FaDollarSign, FaEye, FaEyeSlash } from "react-icons/fa";
import KpiCard from "./KpiCard";

const formatarMoeda = (valor: number) => {
  return valor.toLocaleString("pt-BR", {
    style: "currency", currency: "BRL",
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

export const DashboardMetrics = ({
  estatisticas,
  mostrarValor,
  toggleMostrarValor,
}: DashboardMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        value={mostrarValor ? formatarMoeda(estatisticas.valorTotalEstoque) : "•••••"}
        subtitle="Capital investido"
        color="green"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Valor em estoque
          </span>
          <button
            onClick={toggleMostrarValor}
            className="p-1.5 rounded-full text-muted-foreground hover:text-success hover:bg-success/10 transition-all"
            title={mostrarValor ? "Ocultar valor" : "Mostrar valor"}
            aria-label={mostrarValor ? "Ocultar valor" : "Mostrar valor"}
          >
            {mostrarValor ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
          </button>
        </div>
      </KpiCard>
    </div>
  );
};
