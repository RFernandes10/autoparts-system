import { z } from 'zod';
import { CategoriaProduto, TipoProduto } from '@prisma/client';

// Helper para converter string para número e validar se é um número positivo
const numberCoercion = z.preprocess((val) => Number(val), z.number().positive('O valor deve ser um número positivo.'));

// Esquema de validação para a criação de um produto
export const createProdutoSchema = z.object({
  body: z.object({
    codigoProduto: z.string().min(1, 'O código do produto é obrigatório.'),
    nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
    descricao: z.string().optional(),
    categoria: z.nativeEnum(CategoriaProduto, {
      message: 'Categoria inválida.',
    }),
    tipoProduto: z.nativeEnum(TipoProduto, {
      message: 'Tipo de produto inválido.',
    }),
    precoCompra: numberCoercion,
    precoVenda: numberCoercion,
    estoqueAtual: z.preprocess((val) => Number(val), z.number().int().min(0, 'O estoque não pode ser negativo.')),
    estoqueMinimo: z.preprocess((val) => Number(val), z.number().int().min(0, 'O estoque mínimo não pode ser negativo.')),
    
    // Campos opcionais (comentados pois você não usa mais)
    // fornecedorId: z.preprocess((val) => (val ? Number(val) : undefined), z.number().int().optional()),
    // imagemUrl: z.string().url('URL da imagem inválida.').optional(),

    // Campos aninhados para outras especificações (opcionais)
    compatibilidade: z.object({
      marcaVeiculo: z.string(),
      modeloVeiculo: z.string(),
      anoInicio: z.number().int(),
      anoFim: z.number().int().optional(),
      motor: z.string().optional(),
    }).optional(),

    especificacoesBateria: z.object({
      amperagem: z.string(),
      voltagem: z.string(),
      tipoBateria: z.string().optional(),
      marca: z.string().optional(),
      garantiaMeses: z.number().int().optional(),
      estado: z.enum(['NOVA', 'USADA']).optional(),
    }).optional(),

    especificacoesPneu: z.object({
      medida: z.string(),
      marca: z.string().optional(),
      tipoPneu: z.enum(['NOVO', 'USADO', 'REMOLDADO']).optional(),
      dot: z.string().optional(),
      indiceCarga: z.string().optional(),
      indiceVelocidade: z.string().optional(),
    }).optional(),
  }),
});

// Esquema de validação para a atualização de um produto
// A maioria dos campos é opcional, pois a atualização pode ser parcial
export const updateProdutoSchema = z.object({
  body: createProdutoSchema.shape.body.partial(), // Pega o schema do body e torna todos os campos opcionais
  params: z.object({
    id: z.string().regex(/^\d+$/, 'O ID do produto deve ser um número.'),
  }),
});

// Esquema para validação de busca por ID (parâmetros da URL)
export const getProdutoSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'O ID do produto deve ser um número.'),
  }),
});

// Esquema para validação de busca por Categoria (parâmetros da URL)
export const getProdutoPorCategoriaSchema = z.object({
  params: z.object({
    categoria: z.nativeEnum(CategoriaProduto, {
      message: 'Categoria de produto inválida na URL.',
    }),
  }),
});
