import api from './api';
import type { Cliente } from '../types';

export const clienteService = {
  listarTodos: async (): Promise<Cliente[]> => {
    const response = await api.get('/clientes');
    return response.data;
  },

  buscarPorId: async (id: number): Promise<Cliente> => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  criar: async (cliente: Omit<Cliente, 'id' | 'dataCriacao'>): Promise<Cliente> => {
    const response = await api.post('/clientes', cliente);
    return response.data;
  },

  atualizar: async (id: number, cliente: Partial<Cliente>): Promise<Cliente> => {
    const response = await api.put(`/clientes/${id}`, cliente);
    return response.data;
  },

  deletar: async (id: number): Promise<void> => {
    await api.delete(`/clientes/${id}`);
  },

  buscarPorCpfCnpj: async (cpfCnpj: string): Promise<Cliente> => {
    const response = await api.get(`/clientes/cpf-cnpj/${cpfCnpj}`);
    return response.data;
  },
};
