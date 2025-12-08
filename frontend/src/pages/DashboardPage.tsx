import { useEffect, useState } from "react";
import { produtoService } from "../services/produtoService";
import type { Produto } from "../types";
import { DashboardMetrics } from "../components/dashboard/DashboardMetrics";
import { CategoryDistribution } from "../components/dashboard/CategoryDistribution";
import { TopProducts } from "../components/dashboard/TopProducts";
import { LowStockAlerts } from "../components/dashboard/LowStockAlerts";
import {
  MetricsSkeleton,
  ChartSkeleton,
  ProductListSkeleton,
} from "../components/dashboard/DashboardSkeletons";

type Estatisticas = {
  totalProdutos: number;
  estoqueBaixo: number;
  valorTotalEstoque: number;
  categorias: {
    autopecas: number;
    baterias: number;
    pneus: number;
  };
};

function DashboardPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarValor, setMostrarValor] = useState(false);
  const [estatisticas, setEstatisticas] = useState<Estatisticas>({
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
    .map((p) => {
      const percentual =
        p.estoqueMinimo > 0 ? (p.estoqueAtual / p.estoqueMinimo) * 100 : 0;
      const nivel =
        percentual === 0 ? "critico" : percentual < 50 ? "urgente" : "baixo";
      return { ...p, percentual, nivel };
    })
    .sort((a, b) => a.percentual - b.percentual)
    .slice(0, 5);

  const produtosMaisCaros = [...produtos]
    .sort((a, b) => Number(b.precoVenda) - Number(a.precoVenda))
    .slice(0, 5);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          height: "100%",
        }}
      >
        <MetricsSkeleton />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <ProductListSkeleton count={3} />
          <ChartSkeleton />
          <ProductListSkeleton count={5} />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <DashboardMetrics
        estatisticas={estatisticas}
        mostrarValor={mostrarValor}
        toggleMostrarValor={toggleMostrarValor}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          alignItems: "flex-start",
          gap: "1.5rem",
        }}
      >
        <TopProducts
          produtosMaisCaros={produtosMaisCaros}
          mostrarValor={mostrarValor}
        />
        <CategoryDistribution categorias={estatisticas.categorias} />
        <LowStockAlerts produtosEstoqueBaixo={produtosEstoqueBaixo} />
      </div>
    </div>
  );
}

export default DashboardPage;
