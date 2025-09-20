interface SearchSkeletonProps {
  count?: number;
}

export function SearchSkeleton({ count = 6 }: Readonly<SearchSkeletonProps>) {
  return (
    <ul className="divide-y divide-border animate-pulse">
      {Array.from({ length: count }, (_, index) => `skeleton-${index}`).map((skeletonId) => (
        <li key={skeletonId} className="px-4 py-3">
          <div className="h-4 w-24 bg-white/10 rounded mb-2" />
          <div className="h-4 w-3/4 bg-white/10 rounded" />
        </li>
      ))}
    </ul>
  );
}