import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const ProdutoCardSkeleton = () => {
  return (
    <div className="produto-card">
      {/* Header do Card */}
      <div className="produto-header">
        <div className="produto-title-group">
          <Skeleton height={24} width="70%" />
          <Skeleton height={14} width="40%" />
        </div>
        <Skeleton height={20} width={60} />
      </div>

      {/* Descrição */}
      <Skeleton count={2} />

      {/* Preços */}
      <div className="produto-precos">
        <div className="preco-item">
          <Skeleton height={14} width="50%" />
          <Skeleton height={20} width="80%" />
        </div>
        <div className="preco-divider"></div>
        <div className="preco-item">
          <Skeleton height={14} width="50%" />
          <Skeleton height={20} width="80%" />
        </div>
      </div>

      {/* Estoque */}
      <div className="produto-estoque">
        <div className="estoque-header">
          <Skeleton height={16} width="30%" />
        </div>
        <Skeleton height={8} />
        <div className="estoque-numbers">
          <Skeleton height={14} width="45%" />
          <Skeleton height={14} width="45%" />
        </div>
      </div>

      {/* Ações */}
      <div className="produto-acoes">
        <Skeleton height={36} width={90} />
        <Skeleton height={36} width={90} />
      </div>

      {/* Card Footer */}
      <div className="produto-footer">
        <Skeleton height={16} width="60%" />
      </div>
    </div>
  );
};
