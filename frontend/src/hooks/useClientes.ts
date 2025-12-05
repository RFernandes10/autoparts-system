import { useQuery } from '@tanstack/react-query';
import { clienteService } from '../services/clienteService';
import type { Cliente } from '../types';

export function useClientes() {
  return useQuery<Cliente[]>({
    queryKey: ['clientes'],
    queryFn: clienteService.listarTodos,
  });
}
