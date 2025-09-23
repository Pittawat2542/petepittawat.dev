import type { FC } from 'react';
import FilterChip from './FilterChip';
import GlassButton from '@/components/ui/navigation/GlassButton';
import { memo } from 'react';

interface ActiveFiltersSummaryProps {
  readonly activeDropdownEntries: readonly (readonly [string, string])[];
  readonly activeTags: readonly string[];
  readonly onClearAll: () => void;
  readonly onRemoveDropdownFilter: (key: string) => void;
  readonly onRemoveTag: (tag: string) => void;
}

const ActiveFiltersSummaryComponent: FC<ActiveFiltersSummaryProps> = ({
  activeDropdownEntries,
  activeTags,
  onClearAll,
  onRemoveDropdownFilter,
  onRemoveTag,
}) => {
  const hasActiveFilters = activeDropdownEntries.length > 0 || activeTags.length > 0;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">Active filters</span>
        <GlassButton variant="ghost" size="sm" onClick={onClearAll} className="text-xs">
          Clear all
        </GlassButton>
      </div>
      <div className="flex flex-wrap gap-2">
        {activeDropdownEntries.map(([key, value]) => (
          <FilterChip
            key={`${key}-${value}`}
            active
            removable
            onRemove={() => onRemoveDropdownFilter(key)}
            variant="default"
            size="sm"
          >
            {`${key.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}: ${String(value)
              .replace(/[-_]+/g, ' ')
              .replace(/\b\w/g, c => c.toUpperCase())}`}
          </FilterChip>
        ))}
        {activeTags.map(tag => (
          <FilterChip
            key={`tag-${tag}`}
            active
            removable
            onRemove={() => onRemoveTag(tag)}
            variant="accent"
            size="sm"
          >
            {tag}
          </FilterChip>
        ))}
      </div>
    </div>
  );
};

export const ActiveFiltersSummary = memo(ActiveFiltersSummaryComponent);
ActiveFiltersSummary.displayName = 'ActiveFiltersSummary';
export default ActiveFiltersSummary;
