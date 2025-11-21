import { useEffect, useState } from 'react';
import { produtoService } from '../services/produtoService';
import type { Produto } from '../types';
import { 
  FaBoxes, 
  FaExclamationTriangle, 
  FaDollarSign,
  FaTools, 
  FaCarBattery,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import { GiCarWheel } from 'react-icons/gi';
import './DashboardPage.css';

function DashboardPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarValor, setMostrarValor] = useState(false); // Estado para toggle
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

  const toggleMostrarValor = () => {
    setMostrarValor(!mostrarValor);
  };

  const produtosEstoqueBaixo = produtos
    .filter(p => p.estoqueAtual <= p.estoqueMinimo)
    .sort((a, b) => (a.estoqueAtual / a.estoqueMinimo) - (b.estoqueAtual / b.estoqueMinimo))
    .slice(0, 5);

  const produtosMaisCaros = produtos
    .sort((a, b) => (b.precoVenda * b.estoqueAtual) - (a.precoVenda * a.estoqueAtual))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando informações...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Métricas Principais */}
      <div className="kpi-section">
        <div className="kpi-card primary">
          <div className="kpi-icon-wrapper">
            <FaBoxes className="kpi-icon" />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total de Produtos</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{estatisticas.totalProdutos}</span>
              <span className="kpi-badge success">
                <FaArrowUp size={10} /> Ativo
              </span>
            </div>
            <span className="kpi-subtitle">Itens em estoque</span>
          </div>
        </div>

        <div className="kpi-card warning">
          <div className="kpi-icon-wrapper">
            <FaExclamationTriangle className="kpi-icon" />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Alertas Críticos</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{estatisticas.estoqueBaixo}</span>
              {estatisticas.estoqueBaixo > 0 && (
                <span className="kpi-badge danger">
                  <FaArrowDown size={10} /> Urgente
                </span>
              )}
            </div>
            <span className="kpi-subtitle">Produtos abaixo do mínimo</span>
          </div>
        </div>

        <div className="kpi-card success">
          <div className="kpi-icon-wrapper">
            <FaDollarSign className="kpi-icon" />
          </div>
          <div className="kpi-content">
            <div className="kpi-header-with-toggle">
              <span className="kpi-label">Valor em Estoque</span>
              <button 
                className="toggle-visibility-btn"
                onClick={toggleMostrarValor}
                title={mostrarValor ? "Ocultar valor" : "Mostrar valor"}
                aria-label={mostrarValor ? "Ocultar valor" : "Mostrar valor"}
              >
                {mostrarValor ? <FaEye size={12} /> : <FaEyeSlash size={12} />}
              </button>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-value">
                {mostrarValor ? formatarMoeda(estatisticas.valorTotalEstoque) : '•••••'}
              </span>
            </div>
            <span className="kpi-subtitle">Capital investido</span>
          </div>
        </div>
      </div>

      {/* Layout em Duas Colunas */}
      <div className="dashboard-grid">
        {/* Coluna Esquerda */}
        <div className="dashboard-col">
          <div className="card">
            <div className="card-header">
              <h3>
                <FaChartLine /> Distribuição por Categoria
              </h3>
            </div>
            <div className="categories-list">
              <div className="category-item autopeca">
                <div className="category-info">
                  <FaTools className="category-icon" size={24} />
                  <div>
                    <span className="category-name">Autopeças</span>
                    <span className="category-desc">Peças gerais</span>
                  </div>
                </div>
                <span className="category-count">{estatisticas.categorias.autopecas}</span>
              </div>

              <div className="category-item bateria">
                <div className="category-info">
                  <FaCarBattery className="category-icon" size={24} />
                  <div>
                    <span className="category-name">Baterias</span>
                    <span className="category-desc">Novas e usadas</span>
                  </div>
                </div>
                <span className="category-count">{estatisticas.categorias.baterias}</span>
              </div>

              <div className="category-item pneu">
                <div className="category-info">
                  <GiCarWheel className="category-icon" size={24} />
                  <div>
                    <span className="category-name">Pneus</span>
                    <span className="category-desc">Todos os tipos</span>
                  </div>
                </div>
                <span className="category-count">{estatisticas.categorias.pneus}</span>
              </div>
            </div>
          </div>

          {produtosMaisCaros.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3>
                  <FaDollarSign /> Maior Valor em Estoque
                </h3>
                <span className="card-subtitle">Top 3 produtos</span>
              </div>
              <div className="valuable-products">
                {produtosMaisCaros.map((produto, index) => (
                  <div key={produto.id} className="valuable-item">
                    <div className="valuable-rank">#{index + 1}</div>
                    <div className="valuable-info">
                      <span className="valuable-name">{produto.nome}</span>
                      <span className="valuable-quantity">{produto.estoqueAtual} unidades</span>
                    </div>
                    <span className="valuable-value">
                      {mostrarValor 
                        ? formatarMoeda(produto.precoVenda * produto.estoqueAtual)
                        : '••••••'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Coluna Direita - Alertas */}
        <div className="dashboard-col">
          <div className="card alert-card">
            <div className="card-header">
              <h3>
                <FaExclamationTriangle /> Ação Necessária
              </h3>
              <span className="card-subtitle">
                {produtosEstoqueBaixo.length === 0 
                  ? 'Todos os produtos em níveis adequados' 
                  : `${produtosEstoqueBaixo.length} produto(s) precisam de atenção`}
              </span>
            </div>
            
            {produtosEstoqueBaixo.length > 0 ? (
              <div className="alerts-container">
                {produtosEstoqueBaixo.map(produto => {
                  const percentual = (produto.estoqueAtual / produto.estoqueMinimo) * 100;
                  const nivel = percentual === 0 ? 'critico' : percentual < 50 ? 'urgente' : 'baixo';
                  
                  return (
                    <div key={produto.id} className={`alert-item ${nivel}`}>
                      <div className="alert-header">
                        <span className="alert-name">{produto.nome}</span>
                        <span className={`alert-badge ${nivel}`}>
                          {nivel === 'critico' ? 'CRÍTICO' : nivel === 'urgente' ? 'URGENTE' : 'BAIXO'}
                        </span>
                      </div>
                      <div className="alert-details">
                        <div className="stock-info">
                          <span className="stock-current">
                            Atual: <strong>{produto.estoqueAtual}</strong>
                          </span>
                          <span className="stock-divider">•</span>
                          <span className="stock-min">
                            Mínimo: <strong>{produto.estoqueMinimo}</strong>
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className={`progress-fill ${nivel}`}
                            style={{ width: `${Math.min(percentual, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="alert-action">
                        <button className="btn-reorder">Solicitar Reposição</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-alerts">
                <div className="success-icon">✓</div>
                <p>Parabéns! Todos os produtos estão com estoque adequado.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
