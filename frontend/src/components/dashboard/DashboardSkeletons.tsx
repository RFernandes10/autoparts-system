import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonCard = ({ children }) => (
  <div className="card dark:bg-slate-900 p-4">{children}</div>
);

export const MetricsSkeleton = () => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    <SkeletonCard><Skeleton height={60} /></SkeletonCard>
    <SkeletonCard><Skeleton height={60} /></SkeletonCard>
    <SkeletonCard><Skeleton height={60} /></SkeletonCard>
    <SkeletonCard><Skeleton height={60} /></SkeletonCard>
  </div>
);

export const ChartSkeleton = () => (
  <SkeletonCard>
    <Skeleton height={24} width="70%" className="mb-4" />
    <div className="flex items-center justify-center">
      <Skeleton circle height={150} width={150} />
    </div>
  </SkeletonCard>
);

export const ProductListSkeleton = ({ count = 3 }) => (
  <SkeletonCard>
    <Skeleton height={24} width="60%" className="mb-4" />
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton height={40} width={40} />
          <div className='flex-1'>
            <Skeleton height={16} width="80%" />
            <Skeleton height={12} width="50%" />
          </div>
        </div>
      ))}
    </div>
  </SkeletonCard>
);