import prisma from "../config/database";
import { CategoriaProduto, Prisma, TipoProduto } from "@prisma/client";

// DTO para criação e atualização de produtos, alinhado com os schemas Zod
// Usamos os tipos gerados pelo Prisma para garantir a consistência
interface ProdutoDTO {
  codigoProduto: string;
  nome: string;
  descricao?: string;
  categoria: CategoriaProduto;
  tipoProduto: TipoProduto;
  precoCompra: number;
  precoVenda: number;
  estoqueAtual: number;
  estoqueMinimo: number;
  fornecedorId?: number;
  imagemUrl?: string;
  compatibilidadeVeiculos?: Prisma.CompatibilidadeVeiculoCreateWithoutProdutoInput[];
  especificacoesBateria?: Prisma.EspecificacaoBateriaCreateWithoutProdutoInput;
  especificacoesPneu?: Prisma.EspecificacaoPneuCreateWithoutProdutoInput;
}

class ProdutoService {
  async listarTodos() {
    return await prisma.produto.findMany({
      include: {
        fornecedor: true,
        compatibilidadeVeiculos: true,
        especificacoesBateria: true,
        especificacoesPneu: true,
      },
    });
  }

  async buscarPorId(id: number) {
    const produto = await prisma.produto.findUnique({
      where: { id },
      include: {
        fornecedor: true,
        compatibilidadeVeiculos: true,
        especificacoesBateria: true,
        especificacoesPneu: true,
      },
    });
    if (!produto) {
      throw new Error("Produto não encontrado.");
    }
    return produto;
  }

  async criar(data: ProdutoDTO) {
    const {
      fornecedorId,
      compatibilidadeVeiculos,
      especificacoesBateria,
      especificacoesPneu,
      ...produtoData
    } = data;

    const createInput: Prisma.ProdutoCreateInput = {
      ...produtoData,
      ...(fornecedorId && { fornecedor: { connect: { id: fornecedorId } } }),
      ...(compatibilidadeVeiculos && { compatibilidadeVeiculos: { create: compatibilidadeVeiculos } }),
      ...(especificacoesBateria && { especificacoesBateria: { create: especificacoesBateria } }),
      ...(especificacoesPneu && { especificacoesPneu: { create: especificacoesPneu } }),
    };

    return await prisma.produto.create({
      data: createInput,
      include: {
        fornecedor: true,
        compatibilidadeVeiculos: true,
        especificacoesBateria: true,
        especificacoesPneu: true,
      },
    });
  }

  async atualizar(id: number, data: Partial<ProdutoDTO>) {
    const {
      fornecedorId,
      compatibilidadeVeiculos,
      especificacoesBateria,
      especificacoesPneu,
      ...produtoData
    } = data;

    const updateInput: Prisma.ProdutoUpdateInput = {
      ...produtoData,
      ...(fornecedorId && { fornecedor: { connect: { id: fornecedorId } } }),
      ...(especificacoesBateria && {
        especificacoesBateria: {
          upsert: {
            where: { produtoId: id },
            create: especificacoesBateria,
            update: especificacoesBateria,
          },
        },
      }),
      ...(especificacoesPneu && {
        especificacoesPneu: {
          upsert: {
            where: { produtoId: id },
            create: especificacoesPneu,
            update: especificacoesPneu,
          },
        },
      }),
      ...(compatibilidadeVeiculos && {
        compatibilidadeVeiculos: {
          deleteMany: {},
          create: compatibilidadeVeiculos,
        },
      }),
    };

    return await prisma.produto.update({
      where: { id },
      data: updateInput,
      include: {
        fornecedor: true,
        compatibilidadeVeiculos: true,
        especificacoesBateria: true,
        especificacoesPneu: true,
      },
    });
  }

  async deletar(id: number) {
    try {
      return await prisma.produto.delete({ where: { id } });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new Error("Produto não encontrado para exclusão.");
      }
      if (error.code === 'P2003') {
        throw new Error("Não é possível excluir este produto, pois ele está associado a outros registros (por exemplo, uma venda).");
      }
      throw error;
    }
  }

  async listarEstoqueBaixo() {
    return await prisma.produto.findMany({
      where: {
        estoqueAtual: {
          lte: prisma.produto.fields.estoqueMinimo,
        },
      },
      include: {
        fornecedor: true,
      },
    });
  }

  async buscarPorCategoria(categoria: string) {
    return await prisma.produto.findMany({
      where: { categoria: categoria as CategoriaProduto },
      include: {
        fornecedor: true,
        compatibilidadeVeiculos: true,
        especificacoesBateria: true,
        especificacoesPneu: true,
      },
    });
  }
}

export default new ProdutoService();