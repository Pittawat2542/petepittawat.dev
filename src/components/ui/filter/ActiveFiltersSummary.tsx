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
            tone === 'editorial' && 'font-semibold tracking-[0.18em] text-white/45 uppercase'
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
          const editorialClassName =
            tone === 'editorial'
              ? 'border-white/10 bg-white/[0.04] text-white/72 hover:border-white/18 hover:bg-white/[0.08]'
              : undefined;

          return (
            <FilterChip
              key={`${key}-${value}`}
              active
              removable
              onRemove={() => onRemoveDropdownFilter(key)}
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
            tone === 'editorial'
              ? 'border-[color:var(--page-accent,var(--accent))]/30 bg-[color:var(--page-accent,var(--accent))] text-slate-950 shadow-[0_18px_30px_-24px_rgba(15,23,42,0.82)]'
              : undefined;

          return (
            <FilterChip
              key={`tag-${tag}`}
              active
              removable
              onRemove={() => onRemoveTag(tag)}
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
