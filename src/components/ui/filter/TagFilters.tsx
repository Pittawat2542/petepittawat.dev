import type { FC } from 'react';
import { FilterChip } from './FilterChip';
import { memo } from 'react';

interface TagFiltersProps {
  readonly availableTags: readonly string[];
  readonly selectedTags?: ReadonlySet<string>;
  readonly tagCounts?: Readonly<Record<string, number>>;
  readonly onToggleTag: (tag: string) => void;
}

const TagFiltersComponent: FC<TagFiltersProps> = ({
  availableTags,
  selectedTags,
  tagCounts = {},
  onToggleTag,
}) => {
  if (availableTags.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-muted-foreground mb-3 text-sm font-medium">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {availableTags.map(tag => {
          const isSelected =
            tag === 'All'
              ? !selectedTags || selectedTags.size === 0
              : Boolean(selectedTags?.has(tag));
          const count = tagCounts[tag];

          return (
            <FilterChip
              key={tag}
              active={isSelected}
              onClick={() => onToggleTag(tag)}
              {...(count !== undefined && { count })}
              variant={tag === 'All' ? 'primary' : 'default'}
              size="md"
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
