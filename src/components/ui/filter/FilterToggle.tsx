import type { FC } from 'react';
import { Filter } from 'lucide-react';
import { GlassButton } from '@/components/ui/navigation/GlassButton';
import { memo } from 'react';

interface FilterToggleProps {
  readonly showFilters: boolean;
  readonly onToggle: () => void;
  readonly activeFiltersCount: number;
}

const FilterToggleComponent: FC<FilterToggleProps> = ({
  showFilters,
  onToggle,
  activeFiltersCount,
}) => {
  return (
    <GlassButton
      onClick={onToggle}
      variant="secondary"
      size="md"
      className="shrink-0"
      aria-expanded={showFilters}
      aria-label="Toggle filters"
    >
      <Filter size={18} className="mr-2" />
      Filters
      {activeFiltersCount > 0 && (
        <span className="bg-ring ml-2 inline-flex h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-full px-1 text-[10px] leading-none text-white">
          {activeFiltersCount}
        </span>
      )}
    </GlassButton>
  );
};

export const FilterToggle = memo(FilterToggleComponent);
FilterToggle.displayName = 'FilterToggle';
export default FilterToggle;
