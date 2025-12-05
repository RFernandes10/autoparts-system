import prisma from '../config/database';

interface CriarClienteDTO {
  nome: string;
  cpfCnpj: string;
  telefone: string;
  email?: string;
  endereco?: string;
}

class ClienteService {
  async listarTodos() {
    return prisma.cliente.findMany({
      orderBy: {
        nome: 'asc',
      },
    });
  }

  async buscarPorId(id: number) {
    return prisma.cliente.findUnique({
      where: { id },
      include: {
        vendas: {
          orderBy: {
            dataVenda: 'desc',
          },
          take: 10,
        },
      },
    });
  }

  async criar(data: CriarClienteDTO) {
    const clienteExistente = await prisma.cliente.findUnique({
      where: { cpfCnpj: data.cpfCnpj },
    });

    if (clienteExistente) {
      throw new Error('CPF/CNPJ já cadastrado');
    }

    return prisma.cliente.create({
      data,
    });
  }

  async atualizar(id: number, data: Partial<CriarClienteDTO>) {
    if (data.cpfCnpj) {
      const clienteExistente = await prisma.cliente.findFirst({
        where: {
          cpfCnpj: data.cpfCnpj,
          NOT: { id },
        },
      });

      if (clienteExistente) {
        throw new Error('CPF/CNPJ já cadastrado para outro cliente');
      }
    }

    return prisma.cliente.update({
      where: { id },
      data,
    });
  }

  async deletar(id: number) {
    // Modo teste: deixa o banco cuidar da cascata ( Venda.cliente onDelete: Cascade )
    return prisma.cliente.delete({
      where: { id },
    });
  }

  async buscarPorCpfCnpj(cpfCnpj: string) {
    return prisma.cliente.findUnique({
      where: { cpfCnpj },
    });
  }
}

export default new ClienteService();
