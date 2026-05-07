import type { FC } from 'react';
import { memo } from 'react';
import { cn } from '@/lib/utils';

interface ResultsInfoProps {
  readonly filteredResults: number | undefined;
  readonly totalResults: number;
  readonly searchValue: string;
  readonly hasActiveFilters: boolean;
  readonly tone?: 'default' | 'editorial' | undefined;
}

const ResultsInfoComponent: FC<ResultsInfoProps> = ({
  filteredResults,
  totalResults,
  searchValue,
  hasActiveFilters,
  tone = 'default',
}) => {
  return (
    <div
      className={cn(
        'text-muted-foreground w-full text-sm leading-5 sm:w-auto',
        tone === 'editorial' && 'text-white/52'
      )}
    >
      {filteredResults !== undefined
        ? `${filteredResults} of ${totalResults} ${searchValue || hasActiveFilters ? 'matching' : 'total'} results`
        : `${totalResults} results`}
    </div>
  );
};

// Memoize the component
export const ResultsInfo = memo(ResultsInfoComponent);
ResultsInfo.displayName = 'ResultsInfo';
export default ResultsInfo;
