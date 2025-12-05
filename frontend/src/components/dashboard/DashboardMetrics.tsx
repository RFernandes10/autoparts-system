import {
  FaBoxes,
  FaExclamationTriangle,
  FaDollarSign,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { KpiCard } from "./KpiCard";

const formatarMoeda = (valor: number) => {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const DashboardMetrics = ({ estatisticas, mostrarValor, toggleMostrarValor }: { estatisticas: { totalProdutos: number, estoqueBaixo: number, valorTotalEstoque: number }, mostrarValor: boolean, toggleMostrarValor: () => void }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        badgeText={estatisticas.estoqueBaixo > 0 ? "Urgente" : undefined}
        badgeColor="bg-red-100 text-red-800 animate-pulse dark:bg-red-500/20 dark:text-red-300"
        subtitle="Produtos abaixo do mínimo"
        color="yellow"
      />
      <KpiCard
        icon={FaDollarSign}
        title="Valor em Estoque"
        value={
          mostrarValor
            ? formatarMoeda(estatisticas.valorTotalEstoque)
            : "•••••"
        }
        subtitle="Capital investido"
        color="green"
      >
        <div className="flex w-full items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Valor em Estoque
          </span>
          <button
            onClick={toggleMostrarValor}
            title={mostrarValor ? "Ocultar valor" : "Mostrar valor"}
            aria-label={mostrarValor ? "Ocultar valor" : "Mostrar valor"}
            className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-500"
          >
            {mostrarValor ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
          </button>
        </div>
      </KpiCard>
    </div>
  )
};
