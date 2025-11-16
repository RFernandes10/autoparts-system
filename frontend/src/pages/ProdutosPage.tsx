import { useEffect, useState } from "react";
import { produtoService } from "../services/produtoService";
import type { Produto } from "../types";
import ProdutoForm from "../components/produtos/ProdutoForm";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FaTools } from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";
import "./ProdutosPage.css";
import { FaCarBattery } from "react-icons/fa6";

function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("TODOS");
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

  const produtosFiltrados =
    filtroCategoria === "TODOS"
      ? produtos
      : produtos.filter((p) => p.categoria === filtroCategoria);

  if (loading) return <div className="loading">Carregando produtos...</div>;
  if (error) return <div className="error">Erro: {error}</div>;

  return (
    <div className="produtos-page">
      <div className="page-header">
        <h2>Gerenciamento de Produtos</h2>
        <button className="btn-primary" onClick={handleNovoProduto}>
          + Novo Produto
        </button>
      </div>

      {/* Filtros com ícone de bateria de carro */}
      <div className="filtros">
        <button
          className={
            filtroCategoria === "TODOS" ? "filtro-btn active" : "filtro-btn"
          }
          onClick={() => setFiltroCategoria("TODOS")}
        >
          Todos ({produtos.length})
        </button>
        <button
          className={
            filtroCategoria === "AUTOPECA" ? "filtro-btn active" : "filtro-btn"
          }
          onClick={() => setFiltroCategoria("AUTOPECA")}
        >
          <FaTools style={{ marginRight: "5px", color: "#e67e22" }} />
          Autopeças ({produtos.filter((p) => p.categoria === "AUTOPECA").length}
          )
        </button>
        <button
          className={
            filtroCategoria === "BATERIA" ? "filtro-btn active" : "filtro-btn"
          }
          onClick={() => setFiltroCategoria("BATERIA")}
        >
          <FaCarBattery style={{ marginRight: "5px", color: "#27ae60" }} />
          Baterias ({produtos.filter((p) => p.categoria === "BATERIA").length})
        </button>
        <button
          className={
            filtroCategoria === "PNEU" ? "filtro-btn active" : "filtro-btn"
          }
          onClick={() => setFiltroCategoria("PNEU")}
        >
          <GiCarWheel style={{ marginRight: "5px", color: "#2c3e50" }} />
          Pneus ({produtos.filter((p) => p.categoria === "PNEU").length})
        </button>
      </div>

      {/* Lista de Produtos */}
      <div className="produtos-grid">
        {produtosFiltrados.map((produto) => (
          <div key={produto.id} className="produto-card">
            <div className="produto-header">
              <h3>{produto.nome}</h3>
              <span className={`badge ${produto.tipoProduto.toLowerCase()}`}>
                {produto.tipoProduto}
              </span>
            </div>

            <div className="produto-info">
              <p>
                <strong>Código:</strong> {produto.codigoProduto}
              </p>
              <p>
                <strong>Categoria:</strong> {produto.categoria}
              </p>
              {produto.descricao && (
                <p className="descricao">{produto.descricao}</p>
              )}
            </div>

            <div className="produto-precos">
              <div className="preco-item">
                <span className="preco-label">Compra</span>
                <span className="preco-valor">
                  R$ {Number(produto.precoCompra).toFixed(2)}
                </span>
              </div>
              <div className="preco-item">
                <span className="preco-label">Venda</span>
                <span className="preco-valor destaque">
                  R$ {Number(produto.precoVenda).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="produto-estoque">
              <div className="estoque-info">
                <span>Estoque:</span>
                <span
                  className={
                    produto.estoqueAtual <= produto.estoqueMinimo
                      ? "estoque-baixo"
                      : "estoque-ok"
                  }
                >
                  {produto.estoqueAtual} un.
                </span>
              </div>
              {produto.estoqueAtual <= produto.estoqueMinimo && (
                <div className="alerta-estoque">⚠️ Estoque Baixo!</div>
              )}
            </div>

            {produto.compatibilidadeVeiculos &&
              produto.compatibilidadeVeiculos.length > 0 && (
                <div className="compatibilidade">
                  <strong>Compatível com:</strong>
                  {produto.compatibilidadeVeiculos.map((comp, idx) => (
                    <span key={idx} className="compat-tag">
                      {comp.marcaVeiculo} {comp.modeloVeiculo}
                    </span>
                  ))}
                </div>
              )}

            {produto.especificacoesBateria && (
              <div className="especificacoes">
                <strong>Especificações:</strong>
                <p>
                  {produto.especificacoesBateria.amperagem} -{" "}
                  {produto.especificacoesBateria.voltagem}
                </p>
                <p>Marca: {produto.especificacoesBateria.marca}</p>
              </div>
            )}

            {produto.especificacoesPneu && (
              <div className="especificacoes">
                <strong>Especificações:</strong>
                <p>Medida: {produto.especificacoesPneu.medida}</p>
                <p>Marca: {produto.especificacoesPneu.marca}</p>
              </div>
            )}

            <div className="produto-acoes">
              <button
                className="btn-editar"
                onClick={() => handleEditarProduto(produto)}
              >
                ✏️ Editar
              </button>
              <button
                className="btn-deletar"
                onClick={() => handleDeletarProduto(produto)}
              >
                🗑️ Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

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
