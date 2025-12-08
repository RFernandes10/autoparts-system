/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useVendas, useCriarVenda, useDeletarVenda } from "../hooks/useVendas";
import { useProdutos } from "../hooks/useProdutos";
import { useClientes } from "../hooks/useClientes";
import { PageHeader } from "../components/common/PageHeader";

type ItemVendaForm = {
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
};

function VendasPage() {
  const { data: vendas, isLoading: carregandoVendas } = useVendas();
  const { data: produtos } = useProdutos();
  const { data: clientes } = useClientes();
  const criarVenda = useCriarVenda();
  const deletarVenda = useDeletarVenda();

  const [itens, setItens] = useState<ItemVendaForm[]>([]);
  const [clienteId, setClienteId] = useState<number | "">("");
  const [usuarioId] = useState<number | "">(1); // por enquanto fixo
  const [formaPagamento, setFormaPagamento] = useState("DINHEIRO");
  const [mostrarForm, setMostrarForm] = useState(false);

  // filtros do histórico
  const [filtroClienteId, setFiltroClienteId] = useState<number | "">("");
  const [dataInicio, setDataInicio] = useState<string>("");
  const [dataFim, setDataFim] = useState<string>("");

  const adicionarItem = () => {
    setItens((prev) => [
      ...prev,
      {
        produtoId: produtos?.[0]?.id ?? 0,
        quantidade: 1,
        precoUnitario: Number(produtos?.[0]?.precoVenda ?? 0),
      },
    ]);
  };

  const atualizarItem = (
    index: number,
    campo: keyof ItemVendaForm,
    valor: any
  ) => {
    setItens((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [campo]: Number(valor) } : item
      )
    );
  };

  const removerItem = (index: number) => {
    setItens((prev) => prev.filter((_, i) => i !== index));
  };

  const total = itens.reduce(
    (acc, item) => acc + item.quantidade * item.precoUnitario,
    0
  );

  const handleSalvarVenda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId || itens.length === 0) {
      alert("Informe o cliente e pelo menos um item.");
      return;
    }

    try {
      await criarVenda.mutateAsync({
        clienteId: Number(clienteId),
        usuarioId: Number(usuarioId),
        formaPagamento,
        itensProdutos: itens.map((item) => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
        })),
      });

      alert("Venda registrada com sucesso!");
      setItens([]);
      setClienteId("");
      setMostrarForm(false);
    } catch (error: any) {
      console.error("Erro ao criar venda:", error);
      alert(error.response?.data?.error || "Erro ao criar venda.");
    }
  };

  const handleExcluirVenda = async (id: number) => {
    if (!confirm(`Deseja realmente excluir a venda ${id}?`)) return;

    try {
      await deletarVenda.mutateAsync(id);
      alert("Venda excluída com sucesso.");
    } catch (error: any) {
      console.error("Erro ao excluir venda:", error);
      alert(error.response?.data?.error || "Erro ao excluir venda.");
    }
  };

  // aplica filtros no histórico
  const vendasFiltradas =
    vendas?.filter((v: any) => {
      const passaCliente =
        !filtroClienteId || v.clienteId === Number(filtroClienteId);

      const data = new Date(v.dataVenda);
      const passaInicio =
        !dataInicio || data >= new Date(dataInicio + "T00:00:00");
      const passaFim = !dataFim || data <= new Date(dataFim + "T23:59:59");

      return passaCliente && passaInicio && passaFim;
    }) ?? [];

  const inputBaseStyle: React.CSSProperties = {
    padding: "0.65rem 0.9rem",
    borderRadius: "0.75rem",
    border: "1px solid #e5e7eb",
    fontSize: "0.875rem",
    color: "#111827",
    backgroundColor: "white",
    outline: "none",
    transition: "all 0.2s",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        height: "100%",
      }}
    >
      <PageHeader
        title="Vendas"
        subtitle="Gerencie e visualize o histórico de vendas."
        buttonText="Nova Venda"
        onButtonClick={() => setMostrarForm(true)}
      />

      {/* Card Nova Venda */}
      {mostrarForm && (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "1rem",
            padding: "1.5rem",
            boxShadow: "0 10px 15px -3px rgba(15,23,42,0.1)",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 1rem 0",
            }}
          >
            Nova Venda
          </h2>

          <form
            onSubmit={handleSalvarVenda}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* Linha cliente + forma pagamento */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                <label
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#4b5563",
                  }}
                >
                  Cliente *
                </label>
                <select
                  value={clienteId}
                  onChange={(e) =>
                    setClienteId(e.target.value ? Number(e.target.value) : "")
                  }
                  required
                  style={inputBaseStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(59,130,246,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option value="">Selecione um cliente</option>
                  {clientes?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome} (ID: {c.id})
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                <label
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#4b5563",
                  }}
                >
                  Forma de Pagamento
                </label>
                <select
                  value={formaPagamento}
                  onChange={(e) => setFormaPagamento(e.target.value)}
                  style={inputBaseStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#22c55e";
                    e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option value="DINHEIRO">Dinheiro</option>
                  <option value="CARTAO">Cartão</option>
                  <option value="PIX">PIX</option>
                </select>
              </div>
            </div>

            {/* Itens da venda */}
            <div style={{ marginTop: "0.5rem" }}>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#111827",
                  margin: "0 0 0.75rem 0",
                }}
              >
                Itens da Venda
              </h3>
              <button
                type="button"
                onClick={adicionarItem}
                disabled={!produtos || produtos.length === 0}
                style={{
                  padding: "0.5rem 0.9rem",
                  borderRadius: "0.75rem",
                  border: "none",
                  background: "linear-gradient(to right, #22c55e, #16a34a)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor:
                    !produtos || produtos.length === 0
                      ? "not-allowed"
                      : "pointer",
                  opacity: !produtos || produtos.length === 0 ? 0.6 : 1,
                  boxShadow: "0 4px 6px -1px rgba(16,185,129,0.4)",
                  transition: "all 0.2s",
                  marginBottom: "0.75rem",
                }}
                onMouseEnter={(e) => {
                  if (!produtos || produtos.length === 0) return;
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 15px -3px rgba(16,185,129,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 6px -1px rgba(16,185,129,0.4)";
                }}
              >
                Adicionar Item
              </button>

              {itens.map((item, index) => {
                const produtoSelecionado = produtos?.find(
                  (p) => p.id === item.produtoId
                );
                return (
                  <div
                    key={index}
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "minmax(160px, 2fr) repeat(3, minmax(80px, 1fr))",
                      gap: "0.5rem",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <select
                      value={item.produtoId}
                      onChange={(e) => {
                        const produtoId = Number(e.target.value);
                        const produto = produtos?.find(
                          (p) => p.id === produtoId
                        );
                        atualizarItem(index, "produtoId", produtoId);
                        if (produto) {
                          atualizarItem(
                            index,
                            "precoUnitario",
                            produto.precoVenda
                          );
                        }
                      }}
                      style={inputBaseStyle}
                    >
                      {produtos?.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nome} (Estoque: {p.estoqueAtual})
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min={1}
                      max={produtoSelecionado?.estoqueAtual || 999}
                      value={item.quantidade}
                      onChange={(e) =>
                        atualizarItem(index, "quantidade", e.target.value)
                      }
                      placeholder="Qtd"
                      style={inputBaseStyle}
                    />

                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      value={item.precoUnitario}
                      onChange={(e) =>
                        atualizarItem(index, "precoUnitario", e.target.value)
                      }
                      placeholder="Preço"
                      style={inputBaseStyle}
                    />

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                        alignItems: "flex-end",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "#4b5563",
                        }}
                      >
                        Subtotal:{" "}
                        <strong>
                          R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
                        </strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => removerItem(index)}
                        style={{
                          padding: "0.35rem 0.75rem",
                          borderRadius: "0.75rem",
                          border: "none",
                          backgroundColor: "#ef4444",
                          color: "white",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#dc2626";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#ef4444";
                        }}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                textAlign: "right",
                fontSize: "0.95rem",
                color: "#111827",
                marginTop: "0.5rem",
              }}
            >
              <strong>Total: R$ {total.toFixed(2)}</strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.75rem",
                marginTop: "0.75rem",
              }}
            >
              <button
                type="button"
                onClick={() => setMostrarForm(false)}
                style={{
                  padding: "0.6rem 1.2rem",
                  borderRadius: "0.75rem",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "white",
                  color: "#4b5563",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={criarVenda.isPending || itens.length === 0}
                style={{
                  padding: "0.6rem 1.2rem",
                  borderRadius: "0.75rem",
                  border: "none",
                  background: "linear-gradient(to right, #22c55e, #16a34a)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  cursor:
                    criarVenda.isPending || itens.length === 0
                      ? "not-allowed"
                      : "pointer",
                  opacity: criarVenda.isPending || itens.length === 0 ? 0.6 : 1,
                  boxShadow: "0 8px 10px -4px rgba(22,163,74,0.5)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (criarVenda.isPending || itens.length === 0) return;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {criarVenda.isPending ? "Salvando..." : "Salvar Venda"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Histórico de Vendas */}
      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "#111827",
          margin: 0,
        }}
      >
        Histórico de Vendas
      </h2>

      {/* Filtros */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          padding: "1rem",
          borderRadius: "1rem",
          backgroundColor: "white",
          boxShadow: "0 1px 3px 0 rgba(0,0,0,0.06)",
          border: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <label
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#4b5563",
            }}
          >
            Cliente
          </label>
          <select
            value={filtroClienteId}
            onChange={(e) =>
              setFiltroClienteId(e.target.value ? Number(e.target.value) : "")
            }
            style={inputBaseStyle}
          >
            <option value="">Todos</option>
            {clientes?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome} (ID: {c.id})
              </option>
            ))}
          </select>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <label
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#4b5563",
            }}
          >
            Data inicial
          </label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            style={inputBaseStyle}
          />
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <label
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#4b5563",
            }}
          >
            Data final
          </label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            style={inputBaseStyle}
          />
        </div>
      </div>

      {/* Tabela / estado vazio */}
      {carregandoVendas ? (
        <p
          style={{
            textAlign: "center",
            padding: "1.25rem",
            fontSize: "0.9rem",
            color: "#6b7280",
          }}
        >
          Carregando...
        </p>
      ) : vendasFiltradas.length > 0 ? (
        <div
          style={{
            marginTop: "0.5rem",
            backgroundColor: "white",
            borderRadius: "1rem",
            boxShadow: "0 1px 3px 0 rgba(0,0,0,0.08)",
            border: "1px solid #e5e7eb",
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.875rem",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f9fafb" }}>
                {[
                  "ID",
                  "Cliente",
                  "Usuário",
                  "Data",
                  "Forma Pagamento",
                  "Total",
                  "Ações",
                ].map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: "0.65rem 0.9rem",
                      borderBottom: "1px solid #e5e7eb",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#374151",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vendasFiltradas.map((v: any, idx: number) => (
                <tr
                  key={v.id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "white" : "#f9fafb",
                    transition: "background-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#eef2ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      idx % 2 === 0 ? "white" : "#f9fafb";
                  }}
                >
                  <td
                    style={{
                      padding: "0.65rem 0.9rem",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {v.id}
                  </td>
                  <td
                    style={{
                      padding: "0.65rem 0.9rem",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {v.cliente?.nome || "N/A"}
                  </td>
                  <td
                    style={{
                      padding: "0.65rem 0.9rem",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {v.usuario?.nome || "N/A"}
                  </td>
                  <td
                    style={{
                      padding: "0.65rem 0.9rem",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {new Date(v.dataVenda).toLocaleString("pt-BR")}
                  </td>
                  <td
                    style={{
                      padding: "0.65rem 0.9rem",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {v.formaPagamento}
                  </td>
                  <td
                    style={{
                      padding: "0.65rem 0.9rem",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    R$ {Number(v.valorTotal).toFixed(2)}
                  </td>
                  <td
                    style={{
                      padding: "0.65rem 0.9rem",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleExcluirVenda(v.id)}
                      disabled={deletarVenda.isPending}
                      style={{
                        padding: "0.4rem 0.8rem",
                        borderRadius: "0.7rem",
                        border: "none",
                        backgroundColor: "#ef4444",
                        color: "white",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: deletarVenda.isPending
                          ? "not-allowed"
                          : "pointer",
                        opacity: deletarVenda.isPending ? 0.6 : 1,
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (deletarVenda.isPending) return;
                        e.currentTarget.style.backgroundColor = "#dc2626";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#ef4444";
                      }}
                    >
                      {deletarVenda.isPending ? "Excluindo..." : "Excluir"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "4rem 2rem",
            borderRadius: "1rem",
            backgroundColor: "white",
            border: "1px dashed #e5e7eb",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "0.95rem",
          }}
        >
          Nenhuma venda encontrada com os filtros atuais.
        </div>
      )}
    </div>
  );
}

export default VendasPage;
