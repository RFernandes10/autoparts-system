import type { Produto } from "../../types";
import {
  FaTools,
  FaCarBattery,
  FaEdit,
  FaTrash,
  FaSearch,
  FaExclamationTriangle,
  FaDollarSign,
} from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";

interface ProdutoCardProps {
    produto: Produto;
    onEdit: (produto: Produto) => void;
    onDelete: (produto: Produto) => void;
}

// Funções helper movidas para dentro ou para um arquivo de utils.
// Por simplicidade, vamos mantê-las aqui por enquanto.
const formatarMoeda = (valor: number) => {
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const getEspecificacoesBateria = (produto: Produto) => {
    if (!produto.especificacoesBateria) return null;
    return Array.isArray(produto.especificacoesBateria) ? produto.especificacoesBateria[0] : produto.especificacoesBateria;
};

const getEspecificacoesPneu = (produto: Produto) => {
    if (!produto.especificacoesPneu) return null;
    return Array.isArray(produto.especificacoesPneu) ? produto.especificacoesPneu[0] : produto.especificacoesPneu;
};


export function ProdutoCard({ produto, onEdit, onDelete }: ProdutoCardProps) {
    const especBateria = getEspecificacoesBateria(produto);
    const especPneu = getEspecificacoesPneu(produto);

    return (
        <div className="produto-card">
            {/* Header do Card */}
            <div className="produto-header">
                <div className="produto-title-group">
                <h3>{produto.nome}</h3>
                <span className="produto-codigo">
                    {produto.codigoProduto}
                </span>
                </div>
                <span
                className={`badge ${produto.tipoProduto.toLowerCase()}`}
                >
                {produto.tipoProduto}
                </span>
            </div>

            {/* Descrição */}
            {produto.descricao && (
                <p className="produto-descricao">{produto.descricao}</p>
            )}

            {/* Preços */}
            <div className="produto-precos">
                <div className="preco-item">
                <span className="preco-label">Custo</span>
                <span className="preco-valor">
                    {formatarMoeda(Number(produto.precoCompra))}
                </span>
                </div>
                <div className="preco-divider"></div>
                <div className="preco-item">
                <span className="preco-label">Venda</span>
                <span className="preco-valor destaque">
                    {formatarMoeda(Number(produto.precoVenda))}
                </span>
                </div>
            </div>

            {/* Estoque */}
            <div className="produto-estoque">
                <div className="estoque-header">
                <span className="estoque-label">Estoque</span>
                {produto.estoqueAtual <= produto.estoqueMinimo && (
                    <span className="badge-alerta">
                    <FaExclamationTriangle size={10} /> Baixo
                    </span>
                )}
                </div>
                <div className="estoque-bar">
                <div
                    className={`estoque-fill ${
                    produto.estoqueAtual <= produto.estoqueMinimo
                        ? "baixo"
                        : "ok"
                    }`}
                    style={{
                    width: `${Math.min(
                        (produto.estoqueAtual / (produto.estoqueMinimo * 2)) *
                        100,
                        100
                    )}%`,
                    }}
                ></div>
                </div>
                <div className="estoque-numbers">
                <span>
                    Atual: <strong>{produto.estoqueAtual}</strong>
                </span>
                <span>
                    Mínimo: <strong>{produto.estoqueMinimo}</strong>
                </span>
                </div>
            </div>

            {/* Compatibilidade */}
            {produto.compatibilidadeVeiculos &&
                produto.compatibilidadeVeiculos.length > 0 && (
                <div className="produto-compatibilidade">
                    <span className="compat-label">Compatível:</span>
                    <div className="compat-tags">
                    {produto.compatibilidadeVeiculos
                        .slice(0, 2)
                        .map((comp, idx) => (
                        <span key={idx} className="compat-tag">
                            {comp.marcaVeiculo} {comp.modeloVeiculo}
                        </span>
                        ))}
                    {produto.compatibilidadeVeiculos.length > 2 && (
                        <span className="compat-tag more">
                        +{produto.compatibilidadeVeiculos.length - 2}
                        </span>
                    )}
                    </div>
                </div>
                )}

            {/* Especificações de Bateria */}
            {especBateria &&
                (especBateria.amperagem || especBateria.voltagem) && (
                <div className="produto-specs">
                    <FaCarBattery size={14} />
                    <span>
                    {especBateria.amperagem && `${especBateria.amperagem}`}
                    {especBateria.amperagem &&
                        especBateria.voltagem &&
                        " • "}
                    {especBateria.voltagem && `${especBateria.voltagem}`}
                    {especBateria.tipoBateria &&
                        ` • ${especBateria.tipoBateria}`}
                    {especBateria.marca && ` • ${especBateria.marca}`}
                    {especBateria.garantiaMeses &&
                        ` • ${especBateria.garantiaMeses} meses garantia`}
                    </span>
                </div>
                )}

            {/* Especificações de Pneu */}
            {especPneu && (especPneu.medida || especPneu.marca) && (
                <div className="produto-specs">
                <GiCarWheel size={14} />
                <span>
                    {especPneu.medida && `${especPneu.medida}`}
                    {especPneu.medida && especPneu.marca && " • "}
                    {especPneu.marca && `${especPneu.marca}`}
                </span>
                </div>
            )}

            {/* Ações */}
            <div className="produto-acoes">
                <button
                className="btn-action btn-editar"
                onClick={() => onEdit(produto)}
                title="Editar produto"
                >
                <FaEdit size={14} /> Editar
                </button>
                <button
                className="btn-action btn-deletar"
                onClick={() => onDelete(produto)}
                title="Excluir produto"
                >
                <FaTrash size={14} /> Excluir
                </button>
            </div>

            {/* Card Footer com valor total */}
            <div className="produto-footer">
                <FaDollarSign size={12} />
                <span>
                Valor em estoque:{" "}
                <strong>
                    {formatarMoeda(
                    Number(produto.precoVenda) * produto.estoqueAtual
                    )}
                </strong>
                </span>
            </div>
        </div>
    );
}
