import { z } from 'zod';

// Esquema base para os campos do cliente
const clienteBodySchema = z.object({
  nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
  cpfCnpj: z.string().min(11, 'O CPF/CNPJ é inválido.').max(14, 'O CPF/CNPJ é inválido.'),
  telefone: z.string().min(10, 'O telefone é inválido.'),
  email: z.string().email('O e-mail é inválido.').optional(),
  endereco: z.string().optional(),
});

// Esquema para criação de cliente
export const createClienteSchema = z.object({
  body: clienteBodySchema,
});

// Esquema para atualização de cliente
export const updateClienteSchema = z.object({
  body: clienteBodySchema.partial(), // Todos os campos são opcionais na atualização
  params: z.object({
    id: z.string().regex(/^\d+$/, 'O ID do cliente deve ser um número.'),
  }),
});

// Esquema para validação de busca/deleção por ID
export const getClienteSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'O ID do cliente deve ser um número.'),
  }),
});

// Esquema para validação de busca por CPF/CNPJ
export const getClienteByCpfCnpjSchema = z.object({
  params: z.object({
    cpfCnpj: z.string().min(11, 'O CPF/CNPJ é inválido.').max(14, 'O CPF/CNPJ é inválido.'),
  }),
});
