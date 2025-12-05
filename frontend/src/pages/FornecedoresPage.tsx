import { useEffect, useState } from "react";
import { fornecedorService } from "../services/fornecedorService";
import type { Fornecedor } from "../types";
import FornecedorForm from "../components/fornecedores/FornecedorForm";
import {
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaIdCard,
  FaBox,
  FaExternalLinkAlt,
  FaEye,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./FornecedoresPage.css";

function FornecedoresPage() {
  const navigate = useNavigate();
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [fornecedorEditando, setFornecedorEditando] = useState<
    Fornecedor | undefined
  >(undefined);
  const [busca, setBusca] = useState("");
  const [produtosVinculados, setProdutosVinculados] = useState<any>(null);
  const [showProdutosModal, setShowProdutosModal] = useState(false);

  useEffect(() => {
    carregarFornecedores();
  }, []);

  const carregarFornecedores = async () => {
    try {
      setLoading(true);
      const dados = await fornecedorService.listarTodos();
      setFornecedores(dados);
    } catch (err) {
      setError("Erro ao carregar fornecedores");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNovoFornecedor = () => {
    setFornecedorEditando(undefined);
    setShowForm(true);
  };

  const handleEditarFornecedor = (fornecedor: Fornecedor) => {
    setFornecedorEditando(fornecedor);
    setShowForm(true);
  };

  const handleVisualizarProdutos = (fornecedor: Fornecedor) => {
    const produtos = (fornecedor as any).produtos || [];
    setProdutosVinculados({
      fornecedor: fornecedor.nome,
      produtos: produtos,
    });
    setShowProdutosModal(true);
  };

  const handleIrParaProdutos = () => {
    navigate("/produtos");
  };

  const handleSalvarFornecedor = async (fornecedorData: any) => {
    try {
      if (fornecedorEditando) {
        await fornecedorService.atualizar(
          fornecedorEditando.id,
          fornecedorData
        );
        alert("✅ Fornecedor atualizado com sucesso!");
      } else {
        await fornecedorService.criar(fornecedorData);
        alert("✅ Fornecedor cadastrado com sucesso!");
      }
      setShowForm(false);
      setFornecedorEditando(undefined);
      carregarFornecedores();
    } catch (err: any) {
      alert(
        "❌ Erro ao salvar fornecedor: " +
          (err.response?.data?.error || err.message)
      );
      console.error(err);
    }
  };

  const handleDeletarFornecedor = async (fornecedor: Fornecedor) => {
    const totalProdutos = (fornecedor as any).produtos?.length || 0;

    if (totalProdutos > 0) {
      const resposta = window.confirm(
        `⚠️ Atenção!\n\n` +
          `O fornecedor "${fornecedor.nome}" possui ${totalProdutos} produto(s) cadastrado(s).\n\n` +
          `Deseja visualizar os produtos vinculados?\n\n` +
          `Clique em "OK" para ver os produtos ou "Cancelar" para voltar.`
      );

      if (resposta) {
        handleVisualizarProdutos(fornecedor);
      }
      return;
    }

    if (
      window.confirm(
        `Tem certeza que deseja excluir o fornecedor "${fornecedor.nome}"?\n\n` +
          `Esta ação não pode ser desfeita.`
      )
    ) {
      try {
        await fornecedorService.deletar(fornecedor.id);
        alert("✅ Fornecedor excluído com sucesso!");
        carregarFornecedores();
      } catch (err: any) {
        alert(
          "❌ Erro ao excluir fornecedor: " +
            (err.response?.data?.error || err.message)
        );
        console.error(err);
      }
    }
  };

  const handleCancelarForm = () => {
    setShowForm(false);
    setFornecedorEditando(undefined);
  };

  const formatarCnpj = (cnpj: string) => {
    const numbers = cnpj.replace(/\D/g, "");
    if (numbers.length === 14) {
      return numbers.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      );
    }
    return cnpj;
  };

  const formatarTelefone = (telefone: string) => {
    const numbers = telefone.replace(/\D/g, "");

    if (numbers.length === 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return telefone;
  };

  const fornecedoresFiltrados = fornecedores.filter((fornecedor) => {
    const termoBusca = busca.toLowerCase();
    return (
      fornecedor.nome.toLowerCase().includes(termoBusca) ||
      fornecedor.cnpj.includes(busca.replace(/\D/g, "")) ||
      fornecedor.telefone.includes(busca.replace(/\D/g, "")) ||
      fornecedor.email?.toLowerCase().includes(termoBusca)
    );
  });

  if (loading) return <div className="loading">Carregando fornecedores...</div>;
  if (error) return <div className="error">Erro: {error}</div>;

  return (
    <div className="fornecedores-page">
      <div className="page-header">
        <h2>Gerenciamento de Fornecedores</h2>
        <button className="btn-primary" onClick={handleNovoFornecedor}>
          + Novo Fornecedor
        </button>
      </div>

      <div className="busca-container">
        <input
          type="text"
          placeholder="🔍 Buscar por nome, CNPJ, telefone ou e-mail..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="input-busca"
        />
        <span className="resultado-busca">
          {fornecedoresFiltrados.length} fornecedor
          {fornecedoresFiltrados.length !== 1 ? "es" : ""} encontrado
          {fornecedoresFiltrados.length !== 1 ? "s" : ""}
        </span>
      </div>

      {fornecedoresFiltrados.length === 0 ? (
        <div className="empty-state">
          <FaBuilding size={64} color="#bdc3c7" />
          <h3>Nenhum fornecedor encontrado</h3>
          <p>
            {busca
              ? "Nenhum resultado para sua busca. Tente outros termos."
              : "Comece cadastrando seu primeiro fornecedor!"}
          </p>
        </div>
      ) : (
        <div className="fornecedores-grid">
          {fornecedoresFiltrados.map((fornecedor) => {
            const totalProdutos = (fornecedor as any).produtos?.length || 0;
            const temProdutos = totalProdutos > 0;

            return (
              <div key={fornecedor.id} className="fornecedor-card">
                <div className="fornecedor-header">
                  <div className="fornecedor-avatar">
                    <FaBuilding size={24} />
                  </div>
                  <div className="fornecedor-info-header">
                    <h3>{fornecedor.nome}</h3>
                    <span className="fornecedor-id">ID: #{fornecedor.id}</span>
                  </div>
                </div>

                <div className="fornecedor-detalhes">
                  <div className="detalhe-item">
                    <FaIdCard className="detalhe-icon" />
                    <div>
                      <span className="detalhe-label">CNPJ</span>
                      <span className="detalhe-valor">
                        {formatarCnpj(fornecedor.cnpj)}
                      </span>
                    </div>
                  </div>

                  <div className="detalhe-item">
                    <FaPhone className="detalhe-icon" />
                    <div>
                      <span className="detalhe-label">Telefone</span>
                      <span className="detalhe-valor">
                        {formatarTelefone(fornecedor.telefone)}
                      </span>
                    </div>
                  </div>

                  {fornecedor.email && (
                    <div className="detalhe-item">
                      <FaEnvelope className="detalhe-icon" />
                      <div>
                        <span className="detalhe-label">E-mail</span>
                        <span className="detalhe-valor">
                          {fornecedor.email}
                        </span>
                      </div>
                    </div>
                  )}

                  {fornecedor.endereco && (
                    <div className="detalhe-item">
                      <FaMapMarkerAlt className="detalhe-icon" />
                      <div>
                        <span className="detalhe-label">Endereço</span>
                        <span className="detalhe-valor">
                          {fornecedor.endereco}
                        </span>
                      </div>
                    </div>
                  )}

                  {temProdutos && (
                    <div
                      className="detalhe-item produtos-vinculados clickable"
                      onClick={() => handleVisualizarProdutos(fornecedor)}
                      title="Clique para ver os produtos"
                    >
                      <FaBox
                        className="detalhe-icon"
                        style={{ color: "#27ae60" }}
                      />
                      <div>
                        <span className="detalhe-label">
                          Produtos Cadastrados
                        </span>
                        <span className="detalhe-valor produtos-count">
                          {totalProdutos} produto
                          {totalProdutos !== 1 ? "s" : ""}
                          <FaEye
                            style={{ marginLeft: "8px", fontSize: "14px" }}
                          />
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="fornecedor-acoes">
                  <button
                    className="btn-editar"
                    onClick={() => handleEditarFornecedor(fornecedor)}
                    title="Editar fornecedor"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className={`btn-deletar ${temProdutos ? "disabled" : ""}`}
                    onClick={() => handleDeletarFornecedor(fornecedor)}
                    title={
                      temProdutos
                        ? "Ver produtos vinculados"
                        : "Excluir fornecedor"
                    }
                  >
                    {temProdutos ? "🔒 Bloqueado" : "🗑️ Excluir"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Produtos Vinculados */}
      {showProdutosModal && produtosVinculados && (
        <div
          className="modal-overlay"
          onClick={() => setShowProdutosModal(false)}
        >
          <div className="modal-produtos" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📦 Produtos de {produtosVinculados.fornecedor}</h3>
              <button
                className="btn-close"
                onClick={() => setShowProdutosModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              <p className="modal-info">
                ⚠️ Para excluir este fornecedor, primeiro exclua ou transfira os
                produtos abaixo:
              </p>
              <div className="produtos-lista">
                {produtosVinculados.produtos.map((produto: any) => (
                  <div key={produto.id} className="produto-item">
                    <div>
                      <strong>{produto.nome}</strong>
                      <span className="produto-id">ID: #{produto.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-ir-produtos"
                onClick={handleIrParaProdutos}
              >
                <FaExternalLinkAlt style={{ marginRight: "8px" }} />
                Ir para Produtos
              </button>
              <button
                className="btn-fechar"
                onClick={() => setShowProdutosModal(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <FornecedorForm
          fornecedor={fornecedorEditando}
          onSave={handleSalvarFornecedor}
          onCancel={handleCancelarForm}
        />
      )}
    </div>
  );
}

export default FornecedoresPage;
