import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Limpar dados existentes (CUIDADO: isso apaga tudo!)
  await prisma.movimentacaoEstoque.deleteMany();
  await prisma.itemServicoVenda.deleteMany();
  await prisma.itemVenda.deleteMany();
  await prisma.venda.deleteMany();
  await prisma.compatibilidadeVeiculo.deleteMany();
  await prisma.especificacaoPneu.deleteMany();
  await prisma.especificacaoBateria.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.servico.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.fornecedor.deleteMany();
  await prisma.usuario.deleteMany();

  console.log('Dados antigos removidos ✓');

  // 1. Criar Usuários
  const usuario1 = await prisma.usuario.create({
    data: {
      nome: 'Admin Sistema',
      email: 'admin@autoparts.com',
      senha: 'senha123', // Em produção, use hash
      tipo: 'ADMIN',
    },
  });

  const usuario2 = await prisma.usuario.create({
    data: {
      nome: 'João Vendedor',
      email: 'joao@autoparts.com',
      senha: 'senha123',
      tipo: 'VENDEDOR',
    },
  });

  console.log('Usuários criados ✓');

  // 2. Criar Fornecedores
  const fornecedor1 = await prisma.fornecedor.create({
    data: {
      nome: 'AutoPeças Brasil Ltda',
      cnpj: '12345678000199',
      telefone: '11987654321',
      email: 'contato@autopecasbrasil.com.br',
      endereco: 'Rua das Peças, 123 - São Paulo, SP',
    },
  });

  const fornecedor2 = await prisma.fornecedor.create({
    data: {
      nome: 'Distribuidora Nacional',
      cnpj: '98765432000188',
      telefone: '11912345678',
      email: 'vendas@distribuicaonacional.com.br',
      endereco: 'Av. Paulista, 1000 - São Paulo, SP',
    },
  });

  console.log('Fornecedores criados ✓');

  // 3. Criar Clientes
  const cliente1 = await prisma.cliente.create({
    data: {
      nome: 'Maria Silva',
      cpfCnpj: '12345678901',
      telefone: '11999887766',
      email: 'maria.silva@email.com',
      endereco: 'Rua A, 100 - São Paulo, SP',
    },
  });

  const cliente2 = await prisma.cliente.create({
    data: {
      nome: 'Oficina do José Ltda',
      cpfCnpj: '11222333000144',
      telefone: '11988776655',
      email: 'oficina@jose.com.br',
      endereco: 'Rua B, 200 - São Paulo, SP',
    },
  });

  console.log('Clientes criados ✓');

  // 4. Criar Produtos com Especificações

  // Produto 1: Autopeça
  const produto1 = await prisma.produto.create({
    data: {
      codigoProduto: 'AP001',
      nome: 'Filtro de Óleo',
      descricao: 'Filtro de óleo automotivo de alta qualidade',
      categoria: 'AUTOPECA',
      tipoProduto: 'NOVO',
      precoCompra: 15.00,
      precoVenda: 25.00,
      estoqueAtual: 50,
      estoqueMinimo: 10,
      fornecedorId: fornecedor1.id,
      compatibilidadeVeiculos: {
        create: {
          marcaVeiculo: 'Volkswagen',
          modeloVeiculo: 'Gol',
          anoInicio: 2010,
          anoFim: 2023,
          motor: '1.0',
        },
      },
    },
  });

  // Produto 4: Outra Autopeça
  const produto4 = await prisma.produto.create({
    data: {
      codigoProduto: 'AP002',
      nome: 'Pastilha de Freio Dianteira',
      descricao: 'Pastilha de freio para diversos modelos',
      categoria: 'AUTOPECA',
      tipoProduto: 'NOVO',
      precoCompra: 80.00,
      precoVenda: 150.00,
      estoqueAtual: 30,
      estoqueMinimo: 5,
      fornecedorId: fornecedor2.id,
      compatibilidadeVeiculos: {
        create: {
          marcaVeiculo: 'Fiat',
          modeloVeiculo: 'Palio',
          anoInicio: 2005,
          anoFim: 2015,
          motor: '1.4',
        },
      },
    },
  });

  // Produto 5: Mais uma Autopeça
  const produto5 = await prisma.produto.create({
    data: {
      codigoProduto: 'AP003',
      nome: 'Vela de Ignição',
      descricao: 'Vela de ignição NGK Original',
      categoria: 'AUTOPECA',
      tipoProduto: 'NOVO',
      precoCompra: 10.00,
      precoVenda: 18.00,
      estoqueAtual: 100,
      estoqueMinimo: 20,
      fornecedorId: fornecedor1.id,
    },
  });

  // Produto 8: Autopeça Adicional
  const produto8 = await prisma.produto.create({
    data: {
      codigoProduto: 'AP004',
      nome: 'Amortecedor Traseiro',
      descricao: 'Amortecedor para suspensão traseira',
      categoria: 'AUTOPECA',
      tipoProduto: 'NOVO',
      precoCompra: 120.00,
      precoVenda: 220.00,
      estoqueAtual: 25,
      estoqueMinimo: 8,
      fornecedorId: fornecedor2.id,
    },
  });

  // Produto 2: Bateria
  const produto2 = await prisma.produto.create({
    data: {
      codigoProduto: 'BAT001',
      nome: 'Bateria 60Ah Moura',
      descricao: 'Bateria automotiva 60Ah 12V',
      categoria: 'BATERIA',
      tipoProduto: 'NOVO',
      precoCompra: 250.00,
      precoVenda: 380.00,
      estoqueAtual: 15,
      estoqueMinimo: 5,
      fornecedorId: fornecedor1.id,
      especificacoesBateria: {
        create: {
          amperagem: '60Ah',
          voltagem: '12V',
          tipoBateria: 'Chumbo-ácido',
          marca: 'Moura',
          garantiaMeses: 18,
          estado: 'NOVA',
        },
      },
    },
  });

  // Produto 6: Outra Bateria
  const produto6 = await prisma.produto.create({
    data: {
      codigoProduto: 'BAT002',
      nome: 'Bateria 40Ah Heliar',
      descricao: 'Bateria automotiva 40Ah 12V',
      categoria: 'BATERIA',
      tipoProduto: 'NOVO',
      precoCompra: 180.00,
      precoVenda: 290.00,
      estoqueAtual: 20,
      estoqueMinimo: 7,
      fornecedorId: fornecedor2.id,
      especificacoesBateria: {
        create: {
          amperagem: '40Ah',
          voltagem: '12V',
          tipoBateria: 'Chumbo-ácido',
          marca: 'Heliar',
          garantiaMeses: 12,
          estado: 'NOVA',
        },
      },
    },
  });

  // Produto 9: Bateria Adicional
  const produto9 = await prisma.produto.create({
    data: {
      codigoProduto: 'BAT003',
      nome: 'Bateria 70Ah Bosch',
      descricao: 'Bateria automotiva 70Ah 12V',
      categoria: 'BATERIA',
      tipoProduto: 'NOVO',
      precoCompra: 300.00,
      precoVenda: 450.00,
      estoqueAtual: 10,
      estoqueMinimo: 3,
      fornecedorId: fornecedor1.id,
      especificacoesBateria: {
        create: {
          amperagem: '70Ah',
          voltagem: '12V',
          tipoBateria: 'Chumbo-ácido',
          marca: 'Bosch',
          garantiaMeses: 24,
          estado: 'NOVA',
        },
      },
    },
  });

  // Produto 3: Pneu
  const produto3 = await prisma.produto.create({
    data: {
      codigoProduto: 'PN001',
      nome: 'Pneu Pirelli 175/70R13',
      descricao: 'Pneu aro 13 Pirelli P400 EVO',
      categoria: 'PNEU',
      tipoProduto: 'NOVO',
      precoCompra: 180.00,
      precoVenda: 280.00,
      estoqueAtual: 20,
      estoqueMinimo: 8,
      fornecedorId: fornecedor2.id,
      especificacoesPneu: {
        create: {
          medida: '175/70R13',
          marca: 'Pirelli',
          tipoPneu: 'NOVO',
          dot: '2023',
          indiceCarga: '82',
          indiceVelocidade: 'T',
        },
      },
    },
  });

  // Produto 7: Outro Pneu
  const produto7 = await prisma.produto.create({
    data: {
      codigoProduto: 'PN002',
      nome: 'Pneu Michelin 205/55R16',
      descricao: 'Pneu aro 16 Michelin Energy XM2+',
      categoria: 'PNEU',
      tipoProduto: 'NOVO',
      precoCompra: 300.00,
      precoVenda: 450.00,
      estoqueAtual: 10,
      estoqueMinimo: 4,
      fornecedorId: fornecedor1.id,
      especificacoesPneu: {
        create: {
          medida: '205/55R16',
          marca: 'Michelin',
          tipoPneu: 'NOVO',
          dot: '2024',
          indiceCarga: '91',
          indiceVelocidade: 'V',
        },
      },
    },
  });

  // Produto 10: Pneu Adicional
  const produto10 = await prisma.produto.create({
    data: {
      codigoProduto: 'PN003',
      nome: 'Pneu Goodyear Aro 15',
      descricao: 'Pneu para carros de passeio',
      categoria: 'PNEU',
      tipoProduto: 'NOVO',
      precoCompra: 200.00,
      precoVenda: 320.00,
      estoqueAtual: 12,
      estoqueMinimo: 5,
      fornecedorId: fornecedor2.id,
      especificacoesPneu: {
        create: {
          medida: '195/65R15',
          marca: 'Goodyear',
          tipoPneu: 'NOVO',
          dot: '2023',
          indiceCarga: '91',
          indiceVelocidade: 'H',
        },
      },
    },
  });

  console.log('Produtos criados ✓');

  // 5. Criar Serviços
  const servico1 = await prisma.servico.create({
    data: {
      nomeServico: 'Troca de Óleo',
      descricao: 'Troca de óleo do motor com filtro',
      preco: 80.00,
      tempoEstimado: '30 minutos',
      ativo: true,
    },
  });

  const servico2 = await prisma.servico.create({
    data: {
      nomeServico: 'Balanceamento',
      descricao: 'Balanceamento das 4 rodas',
      preco: 60.00,
      tempoEstimado: '45 minutos',
      ativo: true,
    },
  });

  console.log('Serviços criados ✓');

  // 6. Criar Vendas
  const venda1 = await prisma.venda.create({
    data: {
      clienteId: cliente1.id,
      usuarioId: usuario2.id,
      valorTotal: 105.00,
      formaPagamento: 'Dinheiro',
      itensVenda: {
        create: {
          produtoId: produto1.id,
          quantidade: 1,
          precoUnitario: 25.00,
          subtotal: 25.00,
        },
      },
      itensServico: {
        create: {
          servicoId: servico1.id,
          quantidade: 1,
          precoUnitario: 80.00,
          subtotal: 80.00,
        },
      },
    },
  });

  console.log('Vendas criadas ✓');

  // 7. Criar Movimentações de Estoque
  await prisma.movimentacaoEstoque.create({
    data: {
      produtoId: produto1.id,
      tipo: 'ENTRADA',
      quantidade: 50,
      motivo: 'Estoque inicial',
      usuarioId: usuario1.id,
    },
  });

  await prisma.movimentacaoEstoque.create({
    data: {
      produtoId: produto1.id,
      tipo: 'SAIDA',
      quantidade: 1,
      motivo: 'Venda #1',
      usuarioId: usuario2.id,
    },
  });

  console.log('Movimentações de estoque criadas ✓');

  console.log('Seed concluído com sucesso! ✅');
}

main()
  .catch((e) => {
    console.error('Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
