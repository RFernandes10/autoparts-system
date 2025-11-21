import { useEffect, useState } from "react";
import { produtoService } from "../services/produtoService";
import type { Produto } from "../types";
import ProdutoForm from "../components/produtos/ProdutoForm";
import {
  FaTools,
  FaCarBattery,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaExclamationTriangle,
  FaDollarSign,
} from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";
import "./ProdutosPage.css";

function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("TODOS");
  const [busca, setBusca] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | undefined>(
    undefined
  );

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const dados = await produtoService.listarTodos();
      setProdutos(dados);
    } catch (err) {
      setError("Erro ao carregar produtos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNovoProduto = () => {
    setProdutoEditando(undefined);
    setShowForm(true);
  };

  const handleEditarProduto = (produto: Produto) => {
    setProdutoEditando(produto);
    setShowForm(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSalvarProduto = async (produtoData: any) => {
    try {
      if (produtoEditando) {
        await produtoService.atualizar(produtoEditando.id, produtoData);
        alert("Produto atualizado com sucesso!");
      } else {
        await produtoService.criar(produtoData);
        alert("Produto cadastrado com sucesso!");
      }
      setShowForm(false);
      setProdutoEditando(undefined);
      carregarProdutos();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(
        "Erro ao salvar produto: " + (err.response?.data?.error || err.message)
      );
      console.error(err);
    }
  };

  const handleDeletarProduto = async (produto: Produto) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o produto "${produto.nome}"?`
      )
    ) {
      try {
        await produtoService.deletar(produto.id);
        alert("Produto excluído com sucesso!");
        carregarProdutos();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        alert(
          "Erro ao excluir produto: " +
            (err.response?.data?.error || err.message)
        );
        console.error(err);
      }
    }
  };

  const handleCancelarForm = () => {
    setShowForm(false);
    setProdutoEditando(undefined);
  };

  // Filtros combinados: categoria + busca
  const produtosFiltrados = produtos
    .filter(
      (p) => filtroCategoria === "TODOS" || p.categoria === filtroCategoria
    )
    .filter(
      (p) =>
        busca === "" ||
        p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        p.codigoProduto.toLowerCase().includes(busca.toLowerCase())
    );

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Função helper para extrair especificações (array ou objeto)
  const getEspecificacoesBateria = (produto: Produto) => {
    if (!produto.especificacoesBateria) return null;
    return Array.isArray(produto.especificacoesBateria)
      ? produto.especificacoesBateria[0]
      : produto.especificacoesBateria;
  };

  const getEspecificacoesPneu = (produto: Produto) => {
    if (!produto.especificacoesPneu) return null;
    return Array.isArray(produto.especificacoesPneu)
      ? produto.especificacoesPneu[0]
      : produto.especificacoesPneu;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando produtos...</p>
      </div>
    );
  }

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="produtos-page">
      {/* Header com botão de ação */}
      <div className="page-header">
        <div className="header-title">
          <h2>Produtos</h2>
          <span className="header-subtitle">
            {produtos.length} produtos cadastrados
          </span>
        </div>
        <button className="btn-primary" onClick={handleNovoProduto}>
          <FaPlus size={14} /> Novo Produto
        </button>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nome ou código..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filtros">
          <button
            className={
              filtroCategoria === "TODOS" ? "filtro-btn active" : "filtro-btn"
            }
            onClick={() => setFiltroCategoria("TODOS")}
          >
            Todos <span className="filter-count">({produtos.length})</span>
          </button>
          <button
            className={
              filtroCategoria === "AUTOPECA"
                ? "filtro-btn active autopeca"
                : "filtro-btn autopeca"
            }
            onClick={() => setFiltroCategoria("AUTOPECA")}
          >
            <FaTools size={14} />
            Autopeças{" "}
            <span className="filter-count">
              ({produtos.filter((p) => p.categoria === "AUTOPECA").length})
            </span>
          </button>
          <button
            className={
              filtroCategoria === "BATERIA"
                ? "filtro-btn active bateria"
                : "filtro-btn bateria"
            }
            onClick={() => setFiltroCategoria("BATERIA")}
          >
            <FaCarBattery size={14} />
            Baterias{" "}
            <span className="filter-count">
              ({produtos.filter((p) => p.categoria === "BATERIA").length})
            </span>
          </button>
          <button
            className={
              filtroCategoria === "PNEU"
                ? "filtro-btn active pneu"
                : "filtro-btn pneu"
            }
            onClick={() => setFiltroCategoria("PNEU")}
          >
            <GiCarWheel size={16} />
            Pneus{" "}
            <span className="filter-count">
              ({produtos.filter((p) => p.categoria === "PNEU").length})
            </span>
          </button>
        </div>
      </div>

      {/* Grid de Produtos */}
      {produtosFiltrados.length === 0 ? (
        <div className="empty-state">
          <FaSearch size={48} />
          <h3>Nenhum produto encontrado</h3>
          <p>Tente ajustar os filtros ou adicionar um novo produto.</p>
        </div>
      ) : (
        <div className="produtos-grid">
          {produtosFiltrados.map((produto) => {
            const especBateria = getEspecificacoesBateria(produto);
            const especPneu = getEspecificacoesPneu(produto);

            return (
              <div key={produto.id} className="produto-card">
                {/* Header do Card */}
                <div className="produto-header">
                  <div className="produto-title-group">
                    <h3>{produto.nome}</h3>
                    <span className="produto-codigo">
                      {produto.codigoProduto}
                    </span>
                  </div>
                  <span
                    className={`badge ${produto.tipoProduto.toLowerCase()}`}
                  >
                    {produto.tipoProduto}
                  </span>
                </div>

                {/* Descrição */}
                {produto.descricao && (
                  <p className="produto-descricao">{produto.descricao}</p>
                )}

                {/* Preços */}
                <div className="produto-precos">
                  <div className="preco-item">
                    <span className="preco-label">Custo</span>
                    <span className="preco-valor">
                      {formatarMoeda(Number(produto.precoCompra))}
                    </span>
                  </div>
                  <div className="preco-divider"></div>
                  <div className="preco-item">
                    <span className="preco-label">Venda</span>
                    <span className="preco-valor destaque">
                      {formatarMoeda(Number(produto.precoVenda))}
                    </span>
                  </div>
                </div>

                {/* Estoque */}
                <div className="produto-estoque">
                  <div className="estoque-header">
                    <span className="estoque-label">Estoque</span>
                    {produto.estoqueAtual <= produto.estoqueMinimo && (
                      <span className="badge-alerta">
                        <FaExclamationTriangle size={10} /> Baixo
                      </span>
                    )}
                  </div>
                  <div className="estoque-bar">
                    <div
                      className={`estoque-fill ${
                        produto.estoqueAtual <= produto.estoqueMinimo
                          ? "baixo"
                          : "ok"
                      }`}
                      style={{
                        width: `${Math.min(
                          (produto.estoqueAtual / (produto.estoqueMinimo * 2)) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="estoque-numbers">
                    <span>
                      Atual: <strong>{produto.estoqueAtual}</strong>
                    </span>
                    <span>
                      Mínimo: <strong>{produto.estoqueMinimo}</strong>
                    </span>
                  </div>
                </div>

                {/* Compatibilidade */}
                {produto.compatibilidadeVeiculos &&
                  produto.compatibilidadeVeiculos.length > 0 && (
                    <div className="produto-compatibilidade">
                      <span className="compat-label">Compatível:</span>
                      <div className="compat-tags">
                        {produto.compatibilidadeVeiculos
                          .slice(0, 2)
                          .map((comp, idx) => (
                            <span key={idx} className="compat-tag">
                              {comp.marcaVeiculo} {comp.modeloVeiculo}
                            </span>
                          ))}
                        {produto.compatibilidadeVeiculos.length > 2 && (
                          <span className="compat-tag more">
                            +{produto.compatibilidadeVeiculos.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                {/* Especificações de Bateria */}
                {especBateria &&
                  (especBateria.amperagem || especBateria.voltagem) && (
                    <div className="produto-specs">
                      <FaCarBattery size={14} />
                      <span>
                        {especBateria.amperagem && `${especBateria.amperagem}`}
                        {especBateria.amperagem &&
                          especBateria.voltagem &&
                          " • "}
                        {especBateria.voltagem && `${especBateria.voltagem}`}
                        {especBateria.tipoBateria &&
                          ` • ${especBateria.tipoBateria}`}
                        {especBateria.marca && ` • ${especBateria.marca}`}
                        {especBateria.garantiaMeses &&
                          ` • ${especBateria.garantiaMeses} meses garantia`}
                      </span>
                    </div>
                  )}

                {/* Especificações de Pneu */}
                {especPneu && (especPneu.medida || especPneu.marca) && (
                  <div className="produto-specs">
                    <GiCarWheel size={14} />
                    <span>
                      {especPneu.medida && `${especPneu.medida}`}
                      {especPneu.medida && especPneu.marca && " • "}
                      {especPneu.marca && `${especPneu.marca}`}
                    </span>
                  </div>
                )}

                {/* Ações */}
                <div className="produto-acoes">
                  <button
                    className="btn-action btn-editar"
                    onClick={() => handleEditarProduto(produto)}
                    title="Editar produto"
                  >
                    <FaEdit size={14} /> Editar
                  </button>
                  <button
                    className="btn-action btn-deletar"
                    onClick={() => handleDeletarProduto(produto)}
                    title="Excluir produto"
                  >
                    <FaTrash size={14} /> Excluir
                  </button>
                </div>

                {/* Card Footer com valor total */}
                <div className="produto-footer">
                  <FaDollarSign size={12} />
                  <span>
                    Valor em estoque:{" "}
                    <strong>
                      {formatarMoeda(
                        Number(produto.precoVenda) * produto.estoqueAtual
                      )}
                    </strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Formulário */}
      {showForm && (
        <ProdutoForm
          produto={produtoEditando}
          onSave={handleSalvarProduto}
          onCancel={handleCancelarForm}
        />
      )}
    </div>
  );
}

export default ProdutosPage;
