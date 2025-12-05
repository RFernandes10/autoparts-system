import api from "./api";
import type { Produto } from "../types";

export const produtoService = {
  listarTodos: async (): Promise<Produto[]> => {
    const response = await api.get("/produtos"); // ← Continua assim
    return response.data;
  },

  buscarPorId: async (id: number): Promise<Produto> => {
    const response = await api.get(`/produtos/${id}`);
    return response.data;
  },

  criar: async (produto: Partial<Produto>): Promise<Produto> => {
    const response = await api.post("/produtos", produto);
    return response.data;
  },

  atualizar: async (
    id: number,
    produto: Partial<Produto>
  ): Promise<Produto> => {
    const response = await api.put(`/produtos/${id}`, produto);
    return response.data;
  },

  deletar: async (id: number): Promise<void> => {
    await api.delete(`/produtos/${id}`);
  },

  listarEstoqueBaixo: async (): Promise<Produto[]> => {
    const response = await api.get("/produtos/estoque/baixo");
    return response.data;
  },

  buscarPorCategoria: async (categoria: string): Promise<Produto[]> => {
    const response = await api.get(`/produtos/categoria/${categoria}`);
    return response.data;
  },
};
