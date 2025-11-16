import prisma from "../config/database";
import { CategoriaProduto, TipoProduto } from "@prisma/client";

interface CriarProdutoDTO {
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
  compatibilidade?: {
    marcaVeiculo: string;
    modeloVeiculo: string;
    anoInicio: number;
    anoFim?: number;
    motor?: string;
  };
  especificacoesBateria?: {
    amperagem: string;
    voltagem: string;
    tipoBateria: string;
    marca: string;
    garantiaMeses?: number;
    estado: "NOVA" | "USADA";
  };
  especificacoesPneu?: {
    medida: string;
    marca: string;
    tipoPneu: "NOVO" | "USADO" | "REMOLDADO";
    dot?: string;
    indiceCarga?: string;
    indiceVelocidade?: string;
  };
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
    return await prisma.produto.findUnique({
      where: { id },
      include: {
        fornecedor: true,
        compatibilidadeVeiculos: true,
        especificacoesBateria: true,
        especificacoesPneu: true,
      },
    });
  }

  async criar(data: CriarProdutoDTO) {
    try {
      const {
        compatibilidade,
        especificacoesBateria,
        especificacoesPneu,
        ...produtoData
      } = data;

      // Validações básicas
      if (!produtoData.codigoProduto) {
        throw new Error("Código do produto é obrigatório");
      }
      if (!produtoData.nome) {
        throw new Error("Nome do produto é obrigatório");
      }

      // Se fornecedor foi informado, verificar se existe
      if (produtoData.fornecedorId) {
        const fornecedor = await prisma.fornecedor.findUnique({
          where: { id: produtoData.fornecedorId },
        });

        if (!fornecedor) {
          throw new Error("Fornecedor não encontrado");
        }
      }

      // Remover fornecedorId do payload direto e usar connect para relação, para casar com ProdutoCreateInput
      const { fornecedorId, ...produtoDataSemFornecedor } = produtoData as any;

      const createData: any = {
        ...produtoDataSemFornecedor,
        // Conectar fornecedor se informado
        ...(fornecedorId && {
          fornecedor: {
            connect: { id: fornecedorId },
          },
        }),
        // Criar compatibilidade se fornecida
        ...(compatibilidade && {
          compatibilidadeVeiculos: {
            create: compatibilidade,
          },
        }),
        // Criar especificações de bateria se fornecida
        ...(especificacoesBateria && {
          especificacoesBateria: {
            create: especificacoesBateria,
          },
        }),
        // Criar especificações de pneu se fornecida
        ...(especificacoesPneu && {
          especificacoesPneu: {
            create: especificacoesPneu,
          },
        }),
      };

      return await prisma.produto.create({
        data: createData,
        include: {
          fornecedor: true,
          compatibilidadeVeiculos: true,
          especificacoesBateria: true,
          especificacoesPneu: true,
        },
      });
    } catch (error: any) {
      console.error("Erro ao criar produto:", error);
      throw error;
    }
  }

  async atualizar(id: number, data: Partial<CriarProdutoDTO>) {
    const {
      compatibilidade,
      especificacoesBateria,
      especificacoesPneu,
      ...produtoData
    } = data;

    // Primeiro, atualizar o produto básico
    const produto = await prisma.produto.update({
      where: { id },
      data: produtoData,
    });

    // Atualizar ou criar compatibilidade
    if (compatibilidade) {
      await prisma.compatibilidadeVeiculo.deleteMany({
        where: { produtoId: id },
      });
      await prisma.compatibilidadeVeiculo.create({
        data: {
          produtoId: id,
          ...compatibilidade,
        },
      });
    }

    // Atualizar ou criar especificações de bateria
    if (especificacoesBateria) {
      await prisma.especificacaoBateria.deleteMany({
        where: { produtoId: id },
      });
      await prisma.especificacaoBateria.create({
        data: {
          produtoId: id,
          ...especificacoesBateria,
        },
      });
    }

    // Atualizar ou criar especificações de pneu
    if (especificacoesPneu) {
      await prisma.especificacaoPneu.deleteMany({
        where: { produtoId: id },
      });
      await prisma.especificacaoPneu.create({
        data: {
          produtoId: id,
          ...especificacoesPneu,
        },
      });
    }

    return await this.buscarPorId(id);
  }

  async deletar(id: number) {
    try {
      // Verificar se o produto existe
      const produto = await prisma.produto.findUnique({
        where: { id },
      });

      if (!produto) {
        throw new Error("Produto não encontrado");
      }

      // Excluir compatibilidades
      await prisma.compatibilidadeVeiculo.deleteMany({
        where: { produtoId: id },
      });

      // Excluir especificações de bateria
      await prisma.especificacaoBateria.deleteMany({
        where: { produtoId: id },
      });

      // Excluir especificações de pneu
      await prisma.especificacaoPneu.deleteMany({
        where: { produtoId: id },
      });

      // Finalmente, excluir o produto
      return await prisma.produto.delete({
        where: { id },
      });
    } catch (error: any) {
      console.error("Erro ao deletar produto:", error.message || error);
      
      const errorMessage = error.message || JSON.stringify(error);
      
      if (errorMessage.includes('itens_venda') || errorMessage.includes('23001')) {
        throw new Error("Não é possível excluir produto que já foi vendido");
      }
      
      if (errorMessage.includes('movimentacoes_estoque')) {
        throw new Error("Não é possível excluir produto com movimentações de estoque");
      }
      
      if (errorMessage.includes('foreign key') || errorMessage.includes('RESTRICT')) {
        throw new Error("Não é possível excluir produto que possui vínculos no sistema");
      }
      
      throw new Error("Erro ao excluir produto. Verifique se ele possui vendas ou movimentações vinculadas");
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
      where: {
        categoria: categoria as CategoriaProduto,
      },
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
