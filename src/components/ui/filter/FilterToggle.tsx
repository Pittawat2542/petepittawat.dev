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
        className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-[1rem] border border-white/10 bg-[rgba(15,23,42,0.38)] px-4 text-sm font-medium text-white/82 shadow-[0_18px_32px_-28px_rgba(3,7,18,0.82)] transition-[border-color,color,transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:border-white/18 hover:bg-[rgba(30,41,59,0.55)] hover:text-white hover:shadow-[0_24px_42px_-28px_rgba(3,7,18,0.82)] focus-visible:ring-2 focus-visible:ring-[color:var(--page-accent,var(--accent))]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(5,10,20,0.92)] focus-visible:outline-none sm:w-auto"
        aria-expanded={showFilters}
        aria-label="Toggle filters"
      >
        <Filter size={17} />
        Filters
        {activeFiltersCount > 0 && (
          <span className="inline-flex h-[1.35rem] min-w-[1.35rem] items-center justify-center rounded-full bg-[color:var(--page-accent,var(--accent))] px-1.5 text-[10px] leading-none font-semibold text-slate-950">
            {activeFiltersCount}
          </span>
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
