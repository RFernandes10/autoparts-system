import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
// import './ProdutoListItem.css'; // Removido

export const ProdutoListItemSkeleton = () => {
    return (
        <div className="flex items-center justify-between p-3 px-4 border border-border rounded-lg transition-all duration-200 ease-in-out mb-2 bg-bg-light dark:bg-bg-dark">
            <div className="flex-1 flex flex-col">
                <Skeleton height={12} width={80} className="mb-1" />
                <Skeleton height={18} width={200} />
            </div>
            <div className="flex items-center gap-6 flex-1 justify-end text-text-dark">
                <Skeleton height={16} width={60} />
                <Skeleton height={16} width={100} />
                <Skeleton height={24} width={90} />
            </div>
            <div className="flex items-center gap-2 ml-6">
                <Skeleton circle height={32} width={32} />
                <Skeleton circle height={32} width={32} />
            </div>
        </div>
    );
};
