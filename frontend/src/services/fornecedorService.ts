import api from './api';
import type { Fornecedor } from '../types';

export const fornecedorService = {
  listarTodos: async (): Promise<Fornecedor[]> => {
    const response = await api.get('/fornecedores');
    return response.data;
  },

  buscarPorId: async (id: number): Promise<Fornecedor> => {
    const response = await api.get(`/fornecedores/${id}`);
    return response.data;
  },

  criar: async (fornecedor: Omit<Fornecedor, 'id' | 'dataCriacao'>): Promise<Fornecedor> => {
    const response = await api.post('/fornecedores', fornecedor);
    return response.data;
  },

  atualizar: async (id: number, fornecedor: Partial<Fornecedor>): Promise<Fornecedor> => {
    const response = await api.put(`/fornecedores/${id}`, fornecedor);
    return response.data;
  },

  deletar: async (id: number): Promise<void> => {
    await api.delete(`/fornecedores/${id}`);
  },

  buscarPorCnpj: async (cnpj: string): Promise<Fornecedor> => {
    const response = await api.get(`/fornecedores/cnpj/${cnpj}`);
    return response.data;
  },
};
