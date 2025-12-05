import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { produtoService } from '../services/produtoService';
import type { Produto } from '../types';

export function useProdutos() {
  return useQuery({
    queryKey: ['produtos'],
    queryFn: produtoService.listarTodos,
  });
}

export function useProduto(id: number) {
  return useQuery({
    queryKey: ['produtos', id],
    queryFn: () => produtoService.buscarPorId(id),
    enabled: !!id,
  });
}

export function useCriarProduto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (produto: Partial<Produto>) => produtoService.criar(produto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
    },
  });
}

export function useAtualizarProduto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, produto }: { id: number; produto: Partial<Produto> }) =>
      produtoService.atualizar(id, produto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
    },
  });
}

export function useDeletarProduto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => produtoService.deletar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
    },
  });
}

export function useProdutosPorCategoria(categoria: string) {
  return useQuery({
    queryKey: ['produtos', 'categoria', categoria],
    queryFn: () => produtoService.buscarPorCategoria(categoria),
    enabled: !!categoria,
  });
}

export function useEstoqueBaixo() {
  return useQuery({
    queryKey: ['produtos', 'estoque-baixo'],
    queryFn: produtoService.listarEstoqueBaixo,
  });
}
