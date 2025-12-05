/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useVendas, useCriarVenda, useDeletarVenda } from "../hooks/useVendas";
import { useProdutos } from "../hooks/useProdutos";
import { useClientes } from "../hooks/useClientes";
import "./VendasPage.css";

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

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Vendas</h1>
        <button onClick={() => setMostrarForm(true)}>Nova Venda</button>
      </div>

      {mostrarForm && (
        <div className="venda-form-container">
          <h2>Nova Venda</h2>
          <form onSubmit={handleSalvarVenda} className="venda-form">
            <div className="form-row">
              <div className="form-group">
                <label>Cliente *</label>
                <select
                  value={clienteId}
                  onChange={(e) =>
                    setClienteId(e.target.value ? Number(e.target.value) : "")
                  }
                  required
                >
                  <option value="">Selecione um cliente</option>
                  {clientes?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome} (ID: {c.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Forma de Pagamento</label>
                <select
                  value={formaPagamento}
                  onChange={(e) => setFormaPagamento(e.target.value)}
                >
                  <option value="DINHEIRO">Dinheiro</option>
                  <option value="CARTAO">Cartão</option>
                  <option value="PIX">PIX</option>
                </select>
              </div>
            </div>

            <h3>Itens da Venda</h3>
            <button
              type="button"
              onClick={adicionarItem}
              disabled={!produtos || produtos.length === 0}
            >
              Adicionar Item
            </button>

            {itens.map((item, index) => {
              const produtoSelecionado = produtos?.find(
                (p) => p.id === item.produtoId
              );
              return (
                <div key={index} className="venda-item-row">
                  <select
                    value={item.produtoId}
                    onChange={(e) => {
                      const produtoId = Number(e.target.value);
                      const produto = produtos?.find((p) => p.id === produtoId);
                      atualizarItem(index, "produtoId", produtoId);
                      if (produto) {
                        atualizarItem(
                          index,
                          "precoUnitario",
                          produto.precoVenda
                        );
                      }
                    }}
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
                  />

                  <span>
                    Subtotal: R${" "}
                    {(item.quantidade * item.precoUnitario).toFixed(2)}
                  </span>

                  <button type="button" onClick={() => removerItem(index)}>
                    Remover
                  </button>
                </div>
              );
            })}

            <div className="venda-total">
              <strong>Total: R$ {total.toFixed(2)}</strong>
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setMostrarForm(false)}>
                Cancelar
              </button>
              <button
                type="submit"
                disabled={criarVenda.isPending || itens.length === 0}
              >
                {criarVenda.isPending ? "Salvando..." : "Salvar Venda"}
              </button>
            </div>
          </form>
        </div>
      )}

      <h2>Histórico de Vendas</h2>

      {/* Filtros do histórico */}
      <div className="filtros-vendas">
        <div className="form-group">
          <label>Cliente</label>
          <select
            value={filtroClienteId}
            onChange={(e) =>
              setFiltroClienteId(e.target.value ? Number(e.target.value) : "")
            }
          >
            <option value="">Todos</option>
            {clientes?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome} (ID: {c.id})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Data inicial</label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Data final</label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </div>
      </div>

      {carregandoVendas ? (
        <p>Carregando...</p>
      ) : vendasFiltradas.length > 0 ? (
        <table className="vendas-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Usuário</th>
              <th>Data</th>
              <th>Forma Pagamento</th>
              <th>Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vendasFiltradas.map((v: any) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.cliente?.nome || "N/A"}</td>
                <td>{v.usuario?.nome || "N/A"}</td>
                <td>{new Date(v.dataVenda).toLocaleString("pt-BR")}</td>
                <td>{v.formaPagamento}</td>
                <td>R$ {Number(v.valorTotal).toFixed(2)}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleExcluirVenda(v.id)}
                    disabled={deletarVenda.isPending}
                  >
                    {deletarVenda.isPending ? "Excluindo..." : "Excluir"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhuma venda encontrada com os filtros atuais.</p>
      )}
    </div>
  );
}

export default VendasPage;
