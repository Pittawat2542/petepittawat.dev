import type { FC } from 'react';
import { memo } from 'react';

interface SearchSkeletonProps {
  readonly count?: number;
}

const SearchSkeletonComponent: FC<SearchSkeletonProps> = ({ count = 6 }) => {
  if (count <= 0) {
    return null;
  }

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
};

// Memoized component for performance optimization
export const SearchSkeleton = memo(SearchSkeletonComponent);
SearchSkeleton.displayName = 'SearchSkeleton';

// Named export for consistency (already exists)
// Default export for backward compatibility
export default SearchSkeleton;