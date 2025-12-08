/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { clienteService } from "../services/clienteService";
import type { Cliente } from "../types";
import ClienteForm from "../components/clientes/ClienteForm";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaIdCard,
  FaSearch,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { PageHeader } from "../components/common/PageHeader";

function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | undefined>(
    undefined
  );
  const [busca, setBusca] = useState("");

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      const dados = await clienteService.listarTodos();
      setClientes(dados);
    } catch (err) {
      setError("Erro ao carregar clientes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNovoCliente = () => {
    setClienteEditando(undefined);
    setShowForm(true);
  };

  const handleEditarCliente = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setShowForm(true);
  };

  const handleSalvarCliente = async (clienteData: any) => {
    try {
      if (clienteEditando) {
        await clienteService.atualizar(clienteEditando.id, clienteData);
        alert("Cliente atualizado com sucesso!");
      } else {
        await clienteService.criar(clienteData);
        alert("Cliente cadastrado com sucesso!");
      }
      setShowForm(false);
      setClienteEditando(undefined);
      carregarClientes();
    } catch (err: any) {
      alert(
        "Erro ao salvar cliente: " + (err.response?.data?.error || err.message)
      );
      console.error(err);
    }
  };

  const handleDeletarCliente = async (cliente: Cliente) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o cliente "${cliente.nome}"?`
      )
    ) {
      try {
        await clienteService.deletar(cliente.id);
        alert("Cliente excluído com sucesso!");
        carregarClientes();
      } catch (err: any) {
        alert(
          "Erro ao excluir cliente: " +
            (err.response?.data?.error || err.message)
        );
        console.error(err);
      }
    }
  };

  const handleCancelarForm = () => {
    setShowForm(false);
    setClienteEditando(undefined);
  };

  const formatarCpfCnpj = (cpfCnpj: string) => {
    const numbers = cpfCnpj.replace(/\D/g, "");

    if (numbers.length === 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (numbers.length === 14) {
      return numbers.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      );
    }
    return cpfCnpj;
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

  const clientesFiltrados = clientes.filter((cliente) => {
    const termoBusca = busca.toLowerCase();
    return (
      cliente.nome.toLowerCase().includes(termoBusca) ||
      cliente.cpfCnpj.includes(busca.replace(/\D/g, "")) ||
      cliente.telefone.includes(busca.replace(/\D/g, "")) ||
      cliente.email?.toLowerCase().includes(termoBusca)
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
        Carregando clientes...
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
        title="Gerenciamento de Clientes"
        subtitle="Visualize e gerencie todos os clientes da sua loja."
        buttonText="+ Novo Cliente"
        onButtonClick={handleNovoCliente}
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
            placeholder="Buscar por nome, CPF/CNPJ, telefone ou e-mail..."
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
              e.target.style.borderColor = "#3b82f6";
              e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
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
          {clientesFiltrados.length} cliente
          {clientesFiltrados.length !== 1 ? "s" : ""} encontrado
          {clientesFiltrados.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Lista de Clientes */}
      {clientesFiltrados.length === 0 ? (
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
              backgroundColor: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaUser size={40} style={{ color: "#9ca3af" }} />
          </div>
          <h3
            style={{
              color: "#111827",
              margin: "0 0 0.75rem 0",
              fontSize: "1.5rem",
              fontWeight: "700",
            }}
          >
            Nenhum cliente encontrado
          </h3>
          <p style={{ color: "#6b7280", fontSize: "1rem", margin: 0 }}>
            {busca
              ? "Tente ajustar os termos da busca"
              : "Comece cadastrando seu primeiro cliente!"}
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
          {clientesFiltrados.map((cliente) => (
            <div
              key={cliente.id}
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
                e.currentTarget.style.borderColor = "#3b82f6";
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
                  background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
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
                  borderBottom: "2px solid #f3f4f6",
                }}
              >
                <div
                  style={{
                    width: "3.5rem",
                    height: "3.5rem",
                    borderRadius: "0.75rem",
                    background:
                      "linear-gradient(to bottom right, #3b82f6, #8b5cf6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
                  }}
                >
                  <FaUser style={{ color: "white", fontSize: "1.5rem" }} />
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
                    {cliente.nome}
                  </h3>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      color: "#6b7280",
                      backgroundColor: "#f3f4f6",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.375rem",
                      display: "inline-block",
                      marginTop: "0.375rem",
                    }}
                  >
                    ID: #{cliente.id}
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
                      CPF/CNPJ
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
                      {formatarCpfCnpj(cliente.cpfCnpj)}
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
                      {formatarTelefone(cliente.telefone)}
                    </span>
                  </div>
                </div>

                {cliente.email && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                    }}
                  >
                    <FaEnvelope
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
                        {cliente.email}
                      </span>
                    </div>
                  </div>
                )}

                {cliente.endereco && (
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
                        {cliente.endereco}
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
                  borderTop: "2px solid #f3f4f6",
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
                    backgroundColor: "#3b82f6",
                    color: "white",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onClick={() => handleEditarCliente(cliente)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#2563eb";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px -1px rgba(59, 130, 246, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#3b82f6";
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
                    backgroundColor: "#ef4444",
                    color: "white",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onClick={() => handleDeletarCliente(cliente)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#dc2626";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px -1px rgba(239, 68, 68, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#ef4444";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <FaTrash size={14} /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulário Modal */}
      {showForm && (
        <ClienteForm
          cliente={clienteEditando}
          onSave={handleSalvarCliente}
          onCancel={handleCancelarForm}
        />
      )}
    </div>
  );
}

export default ClientesPage;
