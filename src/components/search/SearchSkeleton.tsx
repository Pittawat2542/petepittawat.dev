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
    <ul className="divide-border animate-pulse divide-y">
      {Array.from({ length: count }, (_, index) => `skeleton-${index}`).map(skeletonId => (
        <li key={skeletonId} className="px-4 py-3">
          <div className="mb-2 h-4 w-24 rounded bg-white/10" />
          <div className="h-4 w-3/4 rounded bg-white/10" />
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
