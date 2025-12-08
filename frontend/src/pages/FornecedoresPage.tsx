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
  FaTimes,
  FaSearch,
  FaEdit,
  FaTrash,
  FaLock,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";

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

  if (loading)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2.5rem",
          fontSize: "1.125rem",
          color: "#6b7280",
        }}
      >
        Carregando fornecedores...
      </div>
    );

  if (error)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2.5rem",
          fontSize: "1.125rem",
          color: "#ef4444",
        }}
      >
        Erro: {error}
      </div>
    );

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      <PageHeader
        title="Gerenciamento de Fornecedores"
        subtitle="Visualize e gerencie todos os fornecedores da sua loja."
        buttonText="+ Novo Fornecedor"
        onButtonClick={handleNovoFornecedor}
      />

      {/* Barra de Busca */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ position: "relative" }}>
          <FaSearch
            style={{
              position: "absolute",
              top: "50%",
              left: "1rem",
              transform: "translateY(-50%)",
              color: "#9ca3af",
              fontSize: "1rem",
            }}
          />
          <input
            type="text"
            placeholder="Buscar por nome, CNPJ, telefone ou e-mail..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{
              width: "100%",
              padding: "0.875rem 1rem 0.875rem 3rem",
              border: "2px solid #e5e7eb",
              borderRadius: "0.75rem",
              fontSize: "0.9375rem",
              fontWeight: "500",
              backgroundColor: "white",
              color: "#111827",
              outline: "none",
              transition: "all 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#f59e0b";
              e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e5e7eb";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
        <span
          style={{ fontSize: "0.875rem", fontWeight: "500", color: "#6b7280" }}
        >
          {fornecedoresFiltrados.length} fornecedor
          {fornecedoresFiltrados.length !== 1 ? "es" : ""} encontrado
          {fornecedoresFiltrados.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Lista de Fornecedores */}
      {fornecedoresFiltrados.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "5rem 2rem",
            backgroundColor: "white",
            borderRadius: "1rem",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              width: "5rem",
              height: "5rem",
              margin: "0 auto 1.5rem",
              borderRadius: "50%",
              backgroundColor: "#fef3c7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaBuilding size={40} style={{ color: "#f59e0b" }} />
          </div>
          <h3
            style={{
              color: "#111827",
              margin: "0 0 0.75rem 0",
              fontSize: "1.5rem",
              fontWeight: "700",
            }}
          >
            Nenhum fornecedor encontrado
          </h3>
          <p style={{ color: "#6b7280", fontSize: "1rem", margin: 0 }}>
            {busca
              ? "Tente ajustar os termos da busca"
              : "Comece cadastrando seu primeiro fornecedor!"}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {fornecedoresFiltrados.map((fornecedor) => {
            const totalProdutos = (fornecedor as any).produtos?.length || 0;
            const temProdutos = totalProdutos > 0;

            return (
              <div
                key={fornecedor.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e5e7eb",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
                  e.currentTarget.style.borderColor = "#f59e0b";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              >
                {/* Barra colorida superior */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: "linear-gradient(to right, #f59e0b, #d97706)",
                  }}
                />

                {/* Header do Card */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1.25rem",
                    paddingBottom: "1rem",
                    borderBottom: "2px solid #fef3c7",
                  }}
                >
                  <div
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      borderRadius: "0.75rem",
                      background:
                        "linear-gradient(to bottom right, #f59e0b, #d97706)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxShadow: "0 4px 6px -1px rgba(245, 158, 11, 0.3)",
                    }}
                  >
                    <FaBuilding
                      style={{ color: "white", fontSize: "1.5rem" }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1.125rem",
                        fontWeight: "700",
                        color: "#111827",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fornecedor.nome}
                    </h3>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        color: "#92400e",
                        backgroundColor: "#fef3c7",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.375rem",
                        display: "inline-block",
                        marginTop: "0.375rem",
                      }}
                    >
                      ID: #{fornecedor.id}
                    </span>
                  </div>
                </div>

                {/* Informações */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                    }}
                  >
                    <FaIdCard
                      style={{
                        color: "#f59e0b",
                        fontSize: "1rem",
                        marginTop: "0.125rem",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          color: "#6b7280",
                          marginBottom: "0.25rem",
                        }}
                      >
                        CNPJ
                      </span>
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "#111827",
                          fontFamily: "monospace",
                        }}
                      >
                        {formatarCnpj(fornecedor.cnpj)}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                    }}
                  >
                    <FaPhone
                      style={{
                        color: "#10b981",
                        fontSize: "1rem",
                        marginTop: "0.125rem",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          color: "#6b7280",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Telefone
                      </span>
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "#111827",
                        }}
                      >
                        {formatarTelefone(fornecedor.telefone)}
                      </span>
                    </div>
                  </div>

                  {fornecedor.email && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.75rem",
                      }}
                    >
                      <FaEnvelope
                        style={{
                          color: "#3b82f6",
                          fontSize: "1rem",
                          marginTop: "0.125rem",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span
                          style={{
                            display: "block",
                            fontSize: "0.75rem",
                            fontWeight: "500",
                            color: "#6b7280",
                            marginBottom: "0.25rem",
                          }}
                        >
                          E-mail
                        </span>
                        <span
                          style={{
                            display: "block",
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            color: "#111827",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {fornecedor.email}
                        </span>
                      </div>
                    </div>
                  )}

                  {fornecedor.endereco && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.75rem",
                      }}
                    >
                      <FaMapMarkerAlt
                        style={{
                          color: "#ef4444",
                          fontSize: "1rem",
                          marginTop: "0.125rem",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span
                          style={{
                            display: "block",
                            fontSize: "0.75rem",
                            fontWeight: "500",
                            color: "#6b7280",
                            marginBottom: "0.25rem",
                          }}
                        >
                          Endereço
                        </span>
                        <span
                          style={{
                            display: "block",
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            color: "#111827",
                            lineHeight: "1.4",
                          }}
                        >
                          {fornecedor.endereco}
                        </span>
                      </div>
                    </div>
                  )}

                  {temProdutos && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        backgroundColor: "#ecfdf5",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        borderLeft: "3px solid #10b981",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onClick={() => handleVisualizarProdutos(fornecedor)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#d1fae5";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#ecfdf5";
                      }}
                    >
                      <FaBox
                        style={{
                          color: "#10b981",
                          fontSize: "1rem",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <span
                          style={{
                            display: "block",
                            fontSize: "0.75rem",
                            fontWeight: "500",
                            color: "#065f46",
                            marginBottom: "0.125rem",
                          }}
                        >
                          Produtos Cadastrados
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontSize: "0.875rem",
                            fontWeight: "700",
                            color: "#10b981",
                          }}
                        >
                          {totalProdutos} produto
                          {totalProdutos !== 1 ? "s" : ""}
                          <FaEye size={14} />
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botões de Ação */}
                <div
                  style={{
                    display: "flex",
                    gap: "0.625rem",
                    paddingTop: "1rem",
                    borderTop: "2px solid #fef3c7",
                  }}
                >
                  <button
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      padding: "0.625rem 1rem",
                      borderRadius: "0.625rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      border: "none",
                      backgroundColor: "#f59e0b",
                      color: "white",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onClick={() => handleEditarFornecedor(fornecedor)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#d97706";
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 6px -1px rgba(245, 158, 11, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#f59e0b";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <FaEdit size={14} /> Editar
                  </button>
                  <button
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      padding: "0.625rem 1rem",
                      borderRadius: "0.625rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      border: "none",
                      backgroundColor: temProdutos ? "#9ca3af" : "#ef4444",
                      color: "white",
                      cursor: temProdutos ? "not-allowed" : "pointer",
                      transition: "all 0.2s",
                      opacity: temProdutos ? 0.6 : 1,
                    }}
                    onClick={() => handleDeletarFornecedor(fornecedor)}
                    onMouseEnter={(e) => {
                      if (!temProdutos) {
                        e.currentTarget.style.backgroundColor = "#dc2626";
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 6px -1px rgba(239, 68, 68, 0.3)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!temProdutos) {
                        e.currentTarget.style.backgroundColor = "#ef4444";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  >
                    {temProdutos ? (
                      <>
                        <FaLock size={14} /> Bloqueado
                      </>
                    ) : (
                      <>
                        <FaTrash size={14} /> Excluir
                      </>
                    )}
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
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
          onClick={() => setShowProdutosModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "1rem",
              width: "100%",
              maxWidth: "36rem",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1.5rem",
                borderBottom: "1px solid #e5e7eb",
                background: "linear-gradient(to right, #fef3c7, #fde68a)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  margin: 0,
                  color: "#111827",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FaBox style={{ color: "#f59e0b" }} /> Produtos de{" "}
                {produtosVinculados.fornecedor}
              </h3>
              <button
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "0.75rem",
                  border: "none",
                  backgroundColor: "white",
                  color: "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  transition: "all 0.2s",
                }}
                onClick={() => setShowProdutosModal(false)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#fee2e2";
                  e.currentTarget.style.color = "#dc2626";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = "#6b7280";
                }}
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Conteúdo Modal */}
            <div style={{ overflowY: "auto", padding: "1.5rem", flex: 1 }}>
              <div
                style={{
                  padding: "1rem",
                  fontSize: "0.875rem",
                  color: "#92400e",
                  backgroundColor: "#fef3c7",
                  borderLeft: "4px solid #f59e0b",
                  borderRadius: "0.5rem",
                  marginBottom: "1.25rem",
                  lineHeight: "1.5",
                }}
              >
                ⚠️ Para excluir este fornecedor, primeiro exclua ou transfira os
                produtos abaixo:
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {produtosVinculados.produtos.map((produto: any) => (
                  <div
                    key={produto.id}
                    style={{
                      padding: "1rem",
                      backgroundColor: "#f9fafb",
                      borderRadius: "0.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.875rem",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <div>
                      <strong style={{ fontWeight: "600", color: "#111827" }}>
                        {produto.nome}
                      </strong>
                      <span
                        style={{
                          marginLeft: "0.5rem",
                          fontSize: "0.75rem",
                          color: "#6b7280",
                        }}
                      >
                        ID: #{produto.id}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Modal */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.75rem",
                padding: "1.5rem",
                borderTop: "1px solid #e5e7eb",
                backgroundColor: "#fffbeb",
              }}
            >
              <button
                style={{
                  padding: "0.75rem 1.25rem",
                  borderRadius: "0.625rem",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  border: "none",
                  backgroundColor: "#f59e0b",
                  color: "white",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
                onClick={handleIrParaProdutos}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#d97706";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f59e0b";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <FaExternalLinkAlt size={14} />
                Ir para Produtos
              </button>
              <button
                style={{
                  padding: "0.75rem 1.25rem",
                  borderRadius: "0.625rem",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  border: "2px solid #e5e7eb",
                  backgroundColor: "white",
                  color: "#374151",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onClick={() => setShowProdutosModal(false)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                  e.currentTarget.style.borderColor = "#d1d5db";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulário Modal */}
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
