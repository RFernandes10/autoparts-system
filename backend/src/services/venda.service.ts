import prisma from '../config/database';
import type { CreateVendaDTO } from '../schemas/venda.schema';
import { Prisma } from '@prisma/client';

export class VendaService {
  static async criarVenda(data: CreateVendaDTO) {
    const { clienteId, usuarioId, formaPagamento, itensProdutos, itensServicos } = data;

    if (!itensProdutos.length && !itensServicos?.length) {
      throw Object.assign(new Error('Nenhum item informado na venda.'), {
        statusCode: 400,
      });
    }

    return prisma.$transaction(async (tx) => {
      const valorTotalProdutos = itensProdutos.reduce(
        (acc, item) => acc + item.precoUnitario * item.quantidade,
        0,
      );

      const valorTotalServicos = (itensServicos ?? []).reduce(
        (acc, item) => acc + item.precoUnitario * item.quantidade,
        0,
      );

      const valorTotal = valorTotalProdutos + valorTotalServicos;

      const venda = await tx.venda.create({
        data: {
          clienteId,
          usuarioId,
          formaPagamento,
          valorTotal: new Prisma.Decimal(valorTotal),
          itensVenda: {
            create: itensProdutos.map((item) => ({
              produtoId: item.produtoId,
              quantidade: item.quantidade,
              precoUnitario: new Prisma.Decimal(item.precoUnitario),
              subtotal: new Prisma.Decimal(item.precoUnitario * item.quantidade),
            })),
          },
          itensServico:
            itensServicos && itensServicos.length > 0
              ? {
                  create: itensServicos.map((item) => ({
                    servicoId: item.servicoId,
                    quantidade: item.quantidade,
                    precoUnitario: new Prisma.Decimal(item.precoUnitario),
                    subtotal: new Prisma.Decimal(item.precoUnitario * item.quantidade),
                  })),
                }
              : undefined,
        },
        include: {
          itensVenda: true,
          itensServico: true,
        },
      });

      // Atualiza estoque e registra movimentação para cada produto
      for (const item of itensProdutos) {
        const produto = await tx.produto.findUnique({
          where: { id: item.produtoId },
        });

        if (!produto) {
          throw Object.assign(
            new Error(`Produto ID ${item.produtoId} não encontrado.`),
            { statusCode: 404 },
          );
        }

        if (produto.estoqueAtual < item.quantidade) {
          throw Object.assign(
            new Error(
              `Estoque insuficiente para o produto ${produto.nome}. Disponível: ${produto.estoqueAtual}, solicitado: ${item.quantidade}`,
            ),
            { statusCode: 400 },
          );
        }

        await tx.produto.update({
          where: { id: item.produtoId },
          data: {
            estoqueAtual: produto.estoqueAtual - item.quantidade,
          },
        });

        await tx.movimentacaoEstoque.create({
          data: {
            produtoId: item.produtoId,
            tipo: 'SAIDA',
            quantidade: item.quantidade,
            motivo: `Venda ID ${venda.id}`,
            usuarioId,
          },
        });
      }

      return venda;
    });
  }

  static async listarVendas() {
    return prisma.venda.findMany({
      orderBy: { dataVenda: 'desc' },
      include: {
        cliente: true,
        usuario: true,
        itensVenda: {
          include: { produto: true },
        },
        itensServico: {
          include: { servico: true },
        },
      },
    });
  }

  static async buscarPorId(id: number) {
    const venda = await prisma.venda.findUnique({
      where: { id },
      include: {
        cliente: true,
        usuario: true,
        itensVenda: {
          include: { produto: true },
        },
        itensServico: {
          include: { servico: true },
        },
      },
    });

    if (!venda) {
      throw Object.assign(new Error('Venda não encontrada'), {
        statusCode: 404,
      });
    }

    return venda;
  }

  static async deletarVenda(id: number) {
    // Modo simples: apenas deleta a venda.
    // Itens de venda serão removidos em cascata se a relação tiver onDelete: Cascade.
    await prisma.venda.delete({
      where: { id },
    });
  }
}
