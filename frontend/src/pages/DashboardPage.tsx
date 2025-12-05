import { useEffect, useState } from "react";
import { produtoService } from "../services/produtoService";
import type { Produto } from "../types";
import { DashboardMetrics } from "../components/dashboard/DashboardMetrics";
import { CategoryDistribution } from "../components/dashboard/CategoryDistribution";
import { TopProducts } from "../components/dashboard/TopProducts";
import { LowStockAlerts } from "../components/dashboard/LowStockAlerts";

function DashboardPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarValor, setMostrarValor] = useState(false);
  const [estatisticas, setEstatisticas] = useState({
    totalProdutos: 0,
    estoqueBaixo: 0,
    valorTotalEstoque: 0,
    categorias: {
      autopecas: 0,
      baterias: 0,
      pneus: 0,
    },
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const dados = await produtoService.listarTodos();
      setProdutos(dados);
      calcularEstatisticas(dados);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const calcularEstatisticas = (lista: Produto[]) => {
    const totalProdutos = lista.length;
    const estoqueBaixo = lista.filter(
      (p) => p.estoqueAtual <= p.estoqueMinimo
    ).length;
    const valorTotalEstoque = lista.reduce(
      (total, p) => total + Number(p.precoVenda) * p.estoqueAtual,
      0
    );

    const autopecas = lista.filter((p) => p.categoria === "AUTOPECA").length;
    const baterias = lista.filter((p) => p.categoria === "BATERIA").length;
    const pneus = lista.filter((p) => p.categoria === "PNEU").length;

    setEstatisticas({
      totalProdutos,
      estoqueBaixo,
      valorTotalEstoque,
      categorias: { autopecas, baterias, pneus },
    });
  };

  const toggleMostrarValor = () => {
    setMostrarValor((prev) => !prev);
  };

  const produtosEstoqueBaixo = [...produtos]
    .filter((p) => p.estoqueAtual <= p.estoqueMinimo)
    .map(p => {
      const percentual = (p.estoqueAtual / p.estoqueMinimo) * 100;
      const nivel =
        percentual === 0
          ? "critico"
          : percentual < 50
            ? "urgente"
            : "baixo";
      return { ...p, percentual, nivel };
    })
    .sort(
      (a, b) => a.percentual - b.percentual
    )
    .slice(0, 5);

  const produtosMaisCaros = [...produtos]
    .sort(
      (a, b) =>
        Number(b.precoVenda) * b.estoqueAtual -
        Number(a.precoVenda) * a.estoqueAtual
    )
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500"></div>
        <p className="text-sm font-medium text-slate-500">
          Carregando informações...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto">
      <DashboardMetrics estatisticas={estatisticas} mostrarValor={mostrarValor} toggleMostrarValor={toggleMostrarValor} />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <CategoryDistribution categorias={estatisticas.categorias} />
          <TopProducts produtosMaisCaros={produtosMaisCaros} mostrarValor={mostrarValor} />
        </div>

        <div className="flex flex-col gap-6">
          <LowStockAlerts produtosEstoqueBaixo={produtosEstoqueBaixo} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;