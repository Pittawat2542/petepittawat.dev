import type { FC } from 'react';
import { FilterChip } from './FilterChip';
import { memo } from 'react';
import { cn } from '@/lib/utils';

interface TagFiltersProps {
  readonly availableTags: readonly string[];
  readonly selectedTags?: ReadonlySet<string>;
  readonly tagCounts?: Readonly<Record<string, number>>;
  readonly onToggleTag: (tag: string) => void;
  readonly tone?: 'default' | 'editorial' | undefined;
}

const TagFiltersComponent: FC<TagFiltersProps> = ({
  availableTags,
  selectedTags,
  tagCounts = {},
  onToggleTag,
  tone = 'default',
}) => {
  if (availableTags.length === 0) {
    return null;
  }

  return (
    <div>
      <h3
        className={cn(
          'text-muted-foreground mb-3 text-sm font-medium',
          tone === 'editorial' &&
            'text-[0.72rem] font-semibold tracking-[0.22em] text-white/45 uppercase'
        )}
      >
        Tags
      </h3>
      <div className="flex flex-wrap gap-2">
        {availableTags.map(tag => {
          const isSelected =
            tag === 'All'
              ? !selectedTags || selectedTags.size === 0
              : Boolean(selectedTags?.has(tag));
          const count = tagCounts[tag];
          const editorialClassName =
            tone === 'editorial'
              ? isSelected
                ? tag === 'All'
                  ? 'border-[color:var(--page-accent,var(--accent))]/30 bg-[color:var(--page-accent,var(--accent))] text-slate-950 shadow-[0_18px_30px_-24px_rgba(15,23,42,0.82)]'
                  : 'border-white/10 bg-white/[0.08] text-white shadow-none'
                : 'border-white/10 bg-white/[0.03] text-white/65 hover:border-white/18 hover:bg-white/[0.07] hover:text-white'
              : undefined;

          return (
            <FilterChip
              key={tag}
              active={isSelected}
              onClick={() => {
                onToggleTag(tag);
              }}
              {...(count !== undefined && { count })}
              variant={tag === 'All' ? 'primary' : 'default'}
              size="md"
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

// Memoized component for performance optimization
// Only re-renders when props actually change
export const TagFilters = memo(TagFiltersComponent, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.availableTags === nextProps.availableTags &&
    prevProps.selectedTags === nextProps.selectedTags &&
    prevProps.tagCounts === nextProps.tagCounts &&
    prevProps.onToggleTag === nextProps.onToggleTag
  );
});
TagFilters.displayName = 'TagFilters';
