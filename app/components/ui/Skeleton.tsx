import { cn } from '~/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-bg-tertiary',
        className,
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
