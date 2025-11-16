/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { produtoService } from '../services/produtoService';
import type { Produto } from '../types';
import { FaTools, FaCarBattery } from 'react-icons/fa';
import { GiCarWheel } from 'react-icons/gi';
import './DashboardPage.css';

function DashboardPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
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
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularEstatisticas = (produtos: Produto[]) => {
    const stats = {
      totalProdutos: produtos.length,
      estoqueBaixo: produtos.filter(p => p.estoqueAtual <= p.estoqueMinimo).length,
      valorTotalEstoque: produtos.reduce((total, p) => total + (p.precoVenda * p.estoqueAtual), 0),
      categorias: {
        autopecas: produtos.filter(p => p.categoria === 'AUTOPECA').length,
        baterias: produtos.filter(p => p.categoria === 'BATERIA').length,
        pneus: produtos.filter(p => p.categoria === 'PNEU').length,
      },
    };
    setEstatisticas(stats);
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const produtosEstoqueBaixo = produtos.filter(p => p.estoqueAtual <= p.estoqueMinimo);

  if (loading) return <div className="loading">Carregando dados...</div>;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <h3>Total de Produtos</h3>
            <p className="stat-value">{estatisticas.totalProdutos}</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <h3>Estoque Baixo</h3>
            <p className="stat-value">{estatisticas.estoqueBaixo}</p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <h3>Valor Total Estoque</h3>
            <p className="stat-value">{formatarMoeda(estatisticas.valorTotalEstoque)}</p>
          </div>
        </div>
      </div>

      <div className="categories-section">
        <h3>Produtos por Categoria</h3>
        <div className="categories-grid">
          <div className="category-card autopeca">
            <FaTools className="category-icon" size={32} color="#e67e22" />
            <span className="category-name">Autopeças</span>
            <span className="category-count">{estatisticas.categorias.autopecas}</span>
          </div>
          <div className="category-card bateria">
            <FaCarBattery className="category-icon" size={32} color="#27ae60" />
            <span className="category-name">Baterias</span>
            <span className="category-count">{estatisticas.categorias.baterias}</span>
          </div>
          <div className="category-card pneu">
            <GiCarWheel className="category-icon" size={32} color="#2c3e50" />
            <span className="category-name">Pneus</span>
            <span className="category-count">{estatisticas.categorias.pneus}</span>
          </div>
        </div>
      </div>

      {produtosEstoqueBaixo.length > 0 && (
        <div className="alerts-section">
          <h3>Alertas de Estoque Baixo</h3>
          <div className="alerts-list">
            {produtosEstoqueBaixo.map(produto => (
              <div key={produto.id} className="alert-item">
                <span className="alert-produto">{produto.nome}</span>
                <span className="alert-estoque">
                  Estoque: {produto.estoqueAtual} / Mínimo: {produto.estoqueMinimo}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
