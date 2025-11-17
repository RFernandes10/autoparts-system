// Enums
export enum CategoriaProduto {
  AUTOPECA = 'AUTOPECA',
  BATERIA = 'BATERIA',
  PNEU = 'PNEU',
}

export enum TipoProduto {
  NOVO = 'NOVO',
  USADO = 'USADO',
  SEMINOVO = 'SEMINOVO',
  REMOLDADO = 'REMOLDADO',
}

export enum TipoUsuario {
  ADMIN = 'ADMIN',
  VENDEDOR = 'VENDEDOR',
}

export enum EstadoBateria {
  NOVA = 'NOVA',
  USADA = 'USADA',
}

export enum TipoPneu {
  NOVO = 'NOVO',
  USADO = 'USADO',
  REMOLDADO = 'REMOLDADO',
}

// Interfaces
export interface Fornecedor {
  id: number;
  nome: string;
  cnpj: string;
  telefone: string;
  email?: string;
  endereco?: string;
  dataCriacao?: string;
}

export interface CompatibilidadeVeiculo {
  id: number;
  produtoId: number;
  marcaVeiculo: string;
  modeloVeiculo: string;
  anoInicio: number;
  anoFim?: number;
  motor?: string;
  observacoes?: string;
}

export interface EspecificacaoBateria {
  length: number;
  id: number;
  produtoId: number;
  amperagem: string;
  voltagem: string;
  tipoBateria: string;
  marca: string;
  garantiaMeses?: number;
  estado: EstadoBateria;
}

export interface EspecificacaoPneu {
  id: number;
  produtoId: number;
  medida: string;
  marca: string;
  tipoPneu: TipoPneu;
  dot?: string;
  indiceCarga?: string;
  indiceVelocidade?: string;
}

export interface Produto {
  id: number;
  codigoProduto: string;
  nome: string;
  descricao?: string;
  categoria: CategoriaProduto;
  tipoProduto: TipoProduto;
  precoCompra: number;
  precoVenda: number;
  estoqueAtual: number;
  estoqueMinimo: number;
  fornecedorId: number;
  imagemUrl?: string;
  dataCriacao: string;
  dataAtualizacao: string;
  fornecedor?: Fornecedor;
  compatibilidadeVeiculos?: CompatibilidadeVeiculo[];
  especificacoesBateria?: EspecificacaoBateria;
  especificacoesPneu?: EspecificacaoPneu;
}

export interface Cliente {
  id: number;
  nome: string;
  cpfCnpj: string;
  telefone: string;
  email?: string;
  endereco?: string;
  dataCriacao?: string;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  dataCriacao?: string;
}

export interface Servico {
  id: number;
  nomeServico: string;
  descricao?: string;
  preco: number;
  tempoEstimado?: string;
  ativo: boolean;
}

export interface ItemVenda {
  id: number;
  vendaId: number;
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  produto?: Produto;
}

export interface ItemServicoVenda {
  id: number;
  vendaId: number;
  servicoId: number;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  servico?: Servico;
}

export interface Venda {
  id: number;
  clienteId: number;
  usuarioId: number;
  valorTotal: number;
  dataVenda: string;
  formaPagamento: string;
  cliente?: Cliente;
  usuario?: Usuario;
  itensVenda?: ItemVenda[];
  itensServico?: ItemServicoVenda[];
}

export interface MovimentacaoEstoque {
  id: number;
  produtoId: number;
  tipo: 'ENTRADA' | 'SAIDA';
  quantidade: number;
  motivo: string;
  usuarioId: number;
  dataMovimentacao: string;
  produto?: Produto;
  usuario?: Usuario;
}
