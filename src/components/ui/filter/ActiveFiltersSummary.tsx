import type { FC } from 'react';
import FilterChip from './FilterChip';
import GlassButton from '@/components/ui/navigation/GlassButton';
import { memo } from 'react';
import { cn } from '@/lib/utils';

interface ActiveFiltersSummaryProps {
  readonly activeDropdownEntries: readonly (readonly [string, string])[];
  readonly activeTags: readonly string[];
  readonly onClearAll: () => void;
  readonly onRemoveDropdownFilter: (key: string) => void;
  readonly onRemoveTag: (tag: string) => void;
  readonly tone?: 'default' | 'editorial' | undefined;
}

const ActiveFiltersSummaryComponent: FC<ActiveFiltersSummaryProps> = ({
  activeDropdownEntries,
  activeTags,
  onClearAll,
  onRemoveDropdownFilter,
  onRemoveTag,
  tone = 'default',
}) => {
  const hasActiveFilters = activeDropdownEntries.length > 0 || activeTags.length > 0;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'text-muted-foreground text-xs',
            tone === 'editorial' && 'editorial-control-label'
          )}
        >
          Active filters
        </span>
        <GlassButton
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className={cn('text-xs', tone === 'editorial' && 'text-white/50 hover:text-white')}
        >
          Clear all
        </GlassButton>
      </div>
      <div className="flex flex-wrap gap-2">
        {activeDropdownEntries.map(([key, value]) => {
          const editorialClassName = tone === 'editorial' ? 'filter-chip--editorial' : undefined;

          return (
            <FilterChip
              key={`${key}-${value}`}
              active
              removable
              onRemove={() => {
                onRemoveDropdownFilter(key);
              }}
              variant="default"
              size="sm"
              {...(editorialClassName ? { className: editorialClassName } : {})}
            >
              {`${key.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}: ${String(
                value
              )
                .replace(/[-_]+/g, ' ')
                .replace(/\b\w/g, c => c.toUpperCase())}`}
            </FilterChip>
          );
        })}
        {activeTags.map(tag => {
          const editorialClassName =
            tone === 'editorial' ? 'filter-chip--editorial-selected-primary' : undefined;

          return (
            <FilterChip
              key={`tag-${tag}`}
              active
              removable
              onRemove={() => {
                onRemoveTag(tag);
              }}
              variant="accent"
              size="sm"
              {...(editorialClassName ? { className: editorialClassName } : {})}
            >
              {tag}
            </FilterChip>
          );
        })}
      </div>
    </div>
  );
};

export const ActiveFiltersSummary = memo(ActiveFiltersSummaryComponent);
ActiveFiltersSummary.displayName = 'ActiveFiltersSummary';
export default ActiveFiltersSummary;
