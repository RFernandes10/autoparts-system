import prisma from '../config/database';

interface CriarFornecedorDTO {
  nome: string;
  cnpj: string;
  telefone: string;
  email?: string;
  endereco?: string;
}

class FornecedorService {
  async listarTodos() {
    return await prisma.fornecedor.findMany({
      orderBy: {
        nome: 'asc',
      },
      include: {
        produtos: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });
  }

  async buscarPorId(id: number) {
    return await prisma.fornecedor.findUnique({
      where: { id },
      include: {
        produtos: true,
      },
    });
  }

  async criar(data: CriarFornecedorDTO) {
    // Verificar se CNPJ já existe
    const fornecedorExistente = await prisma.fornecedor.findUnique({
      where: { cnpj: data.cnpj },
    });

    if (fornecedorExistente) {
      throw new Error('CNPJ já cadastrado');
    }

    return await prisma.fornecedor.create({
      data,
    });
  }

  async atualizar(id: number, data: Partial<CriarFornecedorDTO>) {
    // Se estiver atualizando CNPJ, verificar se já existe
    if (data.cnpj) {
      const fornecedorExistente = await prisma.fornecedor.findFirst({
        where: {
          cnpj: data.cnpj,
          NOT: {
            id: id,
          },
        },
      });

      if (fornecedorExistente) {
        throw new Error('CNPJ já cadastrado para outro fornecedor');
      }
    }

    return await prisma.fornecedor.update({
      where: { id },
      data,
    });
  }

  async deletar(id: number) {
    // Verificar se o fornecedor tem produtos
    const fornecedor = await prisma.fornecedor.findUnique({
      where: { id },
      include: {
        produtos: true,
      },
    });

    if (fornecedor && fornecedor.produtos.length > 0) {
      throw new Error('Não é possível excluir fornecedor com produtos cadastrados');
    }

    return await prisma.fornecedor.delete({
      where: { id },
    });
  }

  async buscarPorCnpj(cnpj: string) {
    return await prisma.fornecedor.findUnique({
      where: { cnpj },
    });
  }
}

export default new FornecedorService();
