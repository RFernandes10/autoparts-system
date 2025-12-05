import api from './api';

export type ItemVendaInput = {
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
};

export type ItemServicoVendaInput = {
  servicoId: number;
  quantidade: number;
  precoUnitario: number;
};

export type CreateVendaInput = {
  clienteId: number;
  usuarioId: number;
  formaPagamento: string;
  itensProdutos: ItemVendaInput[];
  itensServicos?: ItemServicoVendaInput[];
};

export const vendaService = {
  listarTodos: async () => {
    const response = await api.get('/vendas');
    return response.data;
  },

  buscarPorId: async (id: number) => {
    const response = await api.get(`/vendas/${id}`);
    return response.data;
  },

  criar: async (data: CreateVendaInput) => {
    const response = await api.post('/vendas', data);
    return response.data;
  },

  deletar: async (id: number) => {
    await api.delete(`/vendas/${id}`);
  },
};
