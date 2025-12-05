import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './ProdutoListItem.css';

export const ProdutoListItemSkeleton = () => {
    return (
        <div className="produto-list-item">
            <div className="item-main-info">
                <Skeleton height={12} width={80} />
                <Skeleton height={18} width={200} />
            </div>
            <div className="item-details">
                <Skeleton height={16} width={60} />
                <Skeleton height={16} width={100} />
                <Skeleton height={24} width={90} />
            </div>
            <div className="item-actions">
                <Skeleton circle height={32} width={32} />
                <Skeleton circle height={32} width={32} />
            </div>
        </div>
    );
};
