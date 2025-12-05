import { z } from 'zod';

// Esquema base para os campos do fornecedor
const fornecedorBodySchema = z.object({
  nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
  cnpj: z.string().length(14, 'O CNPJ deve ter 14 caracteres.'),
  telefone: z.string().min(10, 'O telefone é inválido.'),
  email: z.string().email('O e-mail é inválido.').optional(),
  endereco: z.string().optional(),
});

// Esquema para criação de fornecedor
export const createFornecedorSchema = z.object({
  body: fornecedorBodySchema,
});

// Esquema para atualização de fornecedor
export const updateFornecedorSchema = z.object({
  body: fornecedorBodySchema.partial(), // Todos os campos são opcionais
  params: z.object({
    id: z.string().regex(/^\d+$/, 'O ID do fornecedor deve ser um número.'),
  }),
});

// Esquema para validação de busca/deleção por ID
export const getFornecedorSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'O ID do fornecedor deve ser um número.'),
  }),
});

// Esquema para validação de busca por CNPJ
export const getFornecedorByCnpjSchema = z.object({
    params: z.object({
        cnpj: z.string().length(14, 'O CNPJ na URL deve ter 14 caracteres.'),
    }),
});
