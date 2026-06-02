import type { FC } from 'react';
import { Filter } from 'lucide-react';
import { GlassButton } from '@/components/ui/navigation/GlassButton';
import { memo } from 'react';
import { cn } from '@/lib/utils';

interface FilterToggleProps {
  readonly showFilters: boolean;
  readonly onToggle: () => void;
  readonly activeFiltersCount: number;
  readonly tone?: 'default' | 'editorial' | undefined;
}

const FilterToggleComponent: FC<FilterToggleProps> = ({
  showFilters,
  onToggle,
  activeFiltersCount,
  tone = 'default',
}) => {
  if (tone === 'editorial') {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="editorial-filter-toggle"
        aria-expanded={showFilters}
        aria-label="Toggle filters"
      >
        <Filter size={17} />
        Filters
        {activeFiltersCount > 0 && (
          <span className="editorial-filter-toggle__badge">{activeFiltersCount}</span>
        )}
      </button>
    );
  }

  return (
    <GlassButton
      onClick={onToggle}
      variant="secondary"
      size="md"
      className={cn('shrink-0')}
      aria-expanded={showFilters}
      aria-label="Toggle filters"
    >
      <Filter size={18} className="mr-2" />
      Filters
      {activeFiltersCount > 0 && (
        <span className="bg-ring type-micro ml-2 inline-flex h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-full px-1 leading-none text-white">
          {activeFiltersCount}
        </span>
      )}
    </GlassButton>
  );
};

export const FilterToggle = memo(FilterToggleComponent);
FilterToggle.displayName = 'FilterToggle';
export default FilterToggle;
