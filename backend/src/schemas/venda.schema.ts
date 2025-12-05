import { z } from 'zod';

export const createItemVendaSchema = z.object({
  produtoId: z.number().int().positive(),
  quantidade: z.number().int().positive(),
  precoUnitario: z.number().positive(),
});

export const createItemServicoSchema = z.object({
  servicoId: z.number().int().positive(),
  quantidade: z.number().int().positive(),
  precoUnitario: z.number().positive(),
});

export const createVendaSchema = z.object({
  body: z.object({
    clienteId: z.number().int().positive(),
    usuarioId: z.number().int().positive(),
    formaPagamento: z.string().min(1, 'Forma de pagamento é obrigatória'),
    itensProdutos: z.array(createItemVendaSchema).min(1, 'Pelo menos um produto é obrigatório'),
    itensServicos: z.array(createItemServicoSchema).optional().default([]),
  }),
});

export type CreateVendaDTO = z.infer<typeof createVendaSchema>['body'];
