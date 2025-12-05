import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendaService } from '../services/vendaService';
import type { CreateVendaInput } from '../services/vendaService';

export function useVendas() {
  return useQuery({
    queryKey: ['vendas'],
    queryFn: vendaService.listarTodos,
  });
}

export function useCriarVenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVendaInput) => vendaService.criar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendas'] });
    },
  });
}

export function useDeletarVenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => vendaService.deletar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendas'] });
    },
  });
}
