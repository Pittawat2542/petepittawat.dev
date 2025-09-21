import type { FC } from 'react';
import { memo } from 'react';

interface ResultsInfoProps {
  readonly filteredResults: number | undefined;
  readonly totalResults: number;
  readonly searchValue: string;
  readonly hasActiveFilters: boolean;
}

const ResultsInfoComponent: FC<ResultsInfoProps> = ({ 
  filteredResults, 
  totalResults, 
  searchValue, 
  hasActiveFilters 
}) => {
  return (
    <div className="text-sm text-muted-foreground whitespace-nowrap w-full sm:w-auto">
      {filteredResults !== undefined 
        ? `${filteredResults} of ${totalResults} ${searchValue || hasActiveFilters ? 'matching' : 'total'} results`
        : `${totalResults} results`
      }
    </div>
  );
};

// Memoize the component
export const ResultsInfo = memo(ResultsInfoComponent);
ResultsInfo.displayName = 'ResultsInfo';
export default ResultsInfo;