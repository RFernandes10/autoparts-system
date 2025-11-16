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
    return await prisma.cliente.findMany({
      orderBy: {
        nome: 'asc',
      },
    });
  }

  async buscarPorId(id: number) {
    return await prisma.cliente.findUnique({
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
    // Verificar se CPF/CNPJ já existe
    const clienteExistente = await prisma.cliente.findUnique({
      where: { cpfCnpj: data.cpfCnpj },
    });

    if (clienteExistente) {
      throw new Error('CPF/CNPJ já cadastrado');
    }

    return await prisma.cliente.create({
      data,
    });
  }

  async atualizar(id: number, data: Partial<CriarClienteDTO>) {
    // Se estiver atualizando CPF/CNPJ, verificar se já existe
    if (data.cpfCnpj) {
      const clienteExistente = await prisma.cliente.findFirst({
        where: {
          cpfCnpj: data.cpfCnpj,
          NOT: {
            id: id,
          },
        },
      });

      if (clienteExistente) {
        throw new Error('CPF/CNPJ já cadastrado para outro cliente');
      }
    }

    return await prisma.cliente.update({
      where: { id },
      data,
    });
  }

  async deletar(id: number) {
    // Verificar se o cliente tem vendas
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: {
        vendas: true,
      },
    });

    if (cliente && cliente.vendas.length > 0) {
      throw new Error('Não é possível excluir cliente com vendas registradas');
    }

    return await prisma.cliente.delete({
      where: { id },
    });
  }

  async buscarPorCpfCnpj(cpfCnpj: string) {
    return await prisma.cliente.findUnique({
      where: { cpfCnpj },
    });
  }
}

export default new ClienteService();
