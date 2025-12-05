import { z } from "zod";

// Enums do frontend
export const CategoriaProdutoEnum = z.enum(
  ["AUTOPECA", "BATERIA", "PNEU"] as const,
  { message: "Selecione uma categoria válida." }
);

export const TipoProdutoEnum = z.enum(
  ["NOVO", "USADO", "SEMINOVO", "REMOLDADO"] as const,
  { message: "Selecione um tipo de produto válido." }
);

// Converte "" / null / undefined → undefined, caso contrário → Number(val)
const toNumber = (val: unknown) => {
    if (val === null || val === undefined || val === "") {
      return undefined;
    }
    if (typeof val === "string") {
      val = val.replace(",", ".");
    }
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  };

// Número positivo após conversão
const positiveNumber = z.preprocess(
  toNumber,
  z.number({ error: "Deve ser um número." }).positive({ message: "O valor deve ser maior que zero." })
);

// Número inteiro não negativo após conversão
const integerNumber = z.preprocess(
  toNumber,
  z
    .number({ error: "Deve ser um número." })
    .int({ message: "O valor deve ser um inteiro." })
    .min(0, "O valor não pode ser negativo.")
);

// Inteiro opcional após conversão
const optionalInteger = z.preprocess(
  toNumber,
  z.number().int({ message: "O valor deve ser um inteiro." }).optional()
);

// Validação de URL ou vazio
const imagemUrlSchema = z
  .string()
  .url("URL da imagem inválida.")
  .optional()
  .nullable()
  .transform((val) => (val?.trim() === "" ? undefined : val));

// Schema final
export const produtoFormSchema = z.object({
  codigoProduto: z.string().min(1, "O código do produto é obrigatório."),
  nome: z.string().min(3, "O nome deve ter no mínimo 3 caracteres."),
  descricao: z.string().optional(),
  categoria: CategoriaProdutoEnum,
  tipoProduto: TipoProdutoEnum,

  precoCompra: positiveNumber,
  precoVenda: positiveNumber,

  estoqueAtual: integerNumber,
  estoqueMinimo: integerNumber,

  fornecedorId: optionalInteger,

  imagemUrl: imagemUrlSchema,
});

// Tipo gerado
export type ProdutoFormData = z.infer<typeof produtoFormSchema>;

