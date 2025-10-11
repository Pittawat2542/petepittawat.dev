import type { FC } from 'react';
import { memo } from 'react';

import { DropdownFilters } from './DropdownFilters';
import { TagFilters } from './TagFilters';

interface FilterPanelBodyProps {
  readonly showFilters: boolean;
  readonly hasDropdownFilters: boolean;
  readonly hasTags: boolean;
  readonly hasActiveFilters: boolean;
  readonly filterOptions: Record<string, readonly string[]>;
  readonly filters: Record<string, string>;
  readonly onFiltersChange?:
    | ((updater: (prev: Record<string, string>) => Record<string, string>) => void)
    | undefined;
  readonly onClearAll: () => void;
  readonly availableTags: readonly string[];
  readonly selectedTags: Set<string> | null;
  readonly tagCounts: Record<string, number>;
  readonly onToggleTag: (tag: string) => void;
}

const FilterPanelBodyComponent: FC<FilterPanelBodyProps> = ({
  showFilters,
  hasDropdownFilters,
  hasTags,
  hasActiveFilters,
  filterOptions,
  filters,
  onFiltersChange,
  onClearAll,
  availableTags,
  selectedTags,
  tagCounts,
  onToggleTag,
}) => {
  if (!showFilters || (!hasDropdownFilters && !hasTags && !hasActiveFilters)) {
    return null;
  }

  return (
    <div className="glass-card animate-in fade-in-0 slide-in-from-top-2 space-y-4 rounded-2xl p-4 duration-[var(--motion-duration-normal)] ease-[var(--motion-ease-decelerate)]">
      {hasDropdownFilters && onFiltersChange && (
        <DropdownFilters
          filterOptions={filterOptions}
          filters={filters}
          onFiltersChange={onFiltersChange}
          hasActiveFilters={hasActiveFilters}
          onClearAll={onClearAll}
        />
      )}

      {hasTags && selectedTags && (
        <TagFilters
          availableTags={availableTags}
          selectedTags={selectedTags}
          tagCounts={tagCounts}
          onToggleTag={onToggleTag}
        />
      )}
    </div>
  );
};

export const FilterPanelBody = memo(FilterPanelBodyComponent);
FilterPanelBody.displayName = 'FilterPanelBody';
