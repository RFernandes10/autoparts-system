import type { Produto } from "../../types";
import { FaEdit, FaTrash } from "react-icons/fa";
import { formatarMoeda } from "../../utils/formatters"; // Assuming you have this utility

interface ProdutoListItemProps {
    produto: Produto;
    onEdit: (produto: Produto) => void;
    onDelete: (produto: Produto) => void;
}

export function ProdutoListItem({ produto, onEdit, onDelete }: ProdutoListItemProps) {
    const isStockLow = produto.estoqueAtual <= produto.estoqueMinimo;

    return (
        <div className="produto-list-item">
            <div className="item-main-info">
                <span className="item-codigo">{produto.codigoProduto}</span>
                <span className="item-nome">{produto.nome}</span>
            </div>
            <div className="item-details">
                <span className={`item-estoque ${isStockLow ? 'low' : ''}`}>
                    {produto.estoqueAtual} unid.
                </span>
                <span className="item-preco">
                    {formatarMoeda(Number(produto.precoVenda))}
                </span>
                <span className="item-categoria">{produto.categoria}</span>
            </div>
            <div className="item-actions">
                <button
                    className="btn-action-icon"
                    onClick={() => onEdit(produto)}
                    title="Editar produto"
                >
                    <FaEdit />
                </button>
                <button
                    className="btn-action-icon btn-delete"
                    onClick={() => onDelete(produto)}
                    title="Excluir produto"
                >
                    <FaTrash />
                </button>
            </div>
        </div>
    );
}
