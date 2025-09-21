import type { FC } from 'react';
import { Filter } from "lucide-react";
import { GlassButton } from "@/components/ui/navigation/GlassButton";
import { memo } from 'react';

interface FilterToggleProps {
  readonly showFilters: boolean;
  readonly onToggle: () => void;
  readonly activeFiltersCount: number;
}

const FilterToggleComponent: FC<FilterToggleProps> = ({ showFilters, onToggle, activeFiltersCount }) => {
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
        <span className="ml-2 inline-flex items-center justify-center rounded-full bg-ring text-white text-[10px] leading-none min-w-[1.1rem] h-[1.1rem] px-1">
          {activeFiltersCount}
        </span>
      )}
    </GlassButton>
  );
};

export const FilterToggle = memo(FilterToggleComponent);
FilterToggle.displayName = 'FilterToggle';
export default FilterToggle;