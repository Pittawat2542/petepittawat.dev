import React, { useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import SearchInput from './SearchInput';
import FilterChip from './FilterChip';
import GlassButton from './GlassButton';

type FilterPanelProps = {
  // Search
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  
  // Dropdown filters
  filters?: Record<string, string>;
  onFiltersChange?: (updater: (prev: Record<string, string>) => Record<string, string>) => void;
  filterOptions?: Record<string, string[]>;
  
  // Tag filters
  availableTags?: string[];
  selectedTags?: Set<string>;
  onTagsChange?: (updater: (prev: Set<string>) => Set<string>) => void;
  tagCounts?: Record<string, number>;
  
  // Sort
  sortOptions?: Array<{ value: string; label: string }>;
  sortValue?: string;
  onSortChange?: (value: string) => void;
  
  // Results info
  totalResults?: number;
  filteredResults?: number;
  
  // Layout
  className?: string;
  compact?: boolean;
};

export default function FilterPanel({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = {},
  onFiltersChange,
  filterOptions = {},
  availableTags = [],
  selectedTags,
  onTagsChange,
  tagCounts = {},
  sortOptions = [],
  sortValue,
  onSortChange,
  totalResults,
  filteredResults,
  className = '',
  compact = false
}: FilterPanelProps) {
  const [showFilters, setShowFilters] = useState(!compact);
  
  const hasDropdownFilters = Object.keys(filterOptions).length > 0;
  const hasTags = availableTags.length > 0;
  const hasSort = sortOptions.length > 0;
  const hasActiveFilters = Object.values(filters).some(v => v !== 'all' && v !== '') || 
                          (selectedTags && selectedTags.size > 0);

  const clearAllFilters = () => {
    if (onFiltersChange) {
      onFiltersChange(() => ({}));
    }
    if (onTagsChange) {
      onTagsChange(() => new Set());
    }
    onSearchChange('');
  };

  const toggleTag = (tag: string) => {
    if (!onTagsChange || !selectedTags) return;
    
    if (tag === 'All') {
      onTagsChange(() => new Set());
      return;
    }
    
    onTagsChange((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main search and controls row */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex-1 flex items-center gap-3">
          <SearchInput
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            className="flex-1"
          />
          
          {compact && (hasDropdownFilters || hasTags) && (
            <GlassButton
              variant="secondary"
              size="md"
              onClick={() => setShowFilters(!showFilters)}
              className="shrink-0"
              aria-expanded={showFilters}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal size={16} />
              Filters
              {hasActiveFilters && (
                <span className="bg-ring text-white rounded-full w-2 h-2 text-xs" />
              )}
            </GlassButton>
          )}
        </div>

        {/* Sort and results info */}
        <div className="flex items-center gap-4">
          {hasSort && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Sort:</span>
              <div className="relative">
                <select
                  value={sortValue}
                  onChange={(e) => onSortChange?.(e.target.value)}
                  className="glass-surface rounded-lg px-3 py-2 text-sm bg-transparent border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 appearance-none pr-8 min-w-[100px]"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown 
                  size={14} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-70 pointer-events-none" 
                />
              </div>
            </div>
          )}
          
          {(totalResults !== undefined || filteredResults !== undefined) && (
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {filteredResults !== undefined 
                ? `${filteredResults} ${filteredResults === 1 ? 'result' : 'results'}` 
                : `${totalResults} total`
              }
            </div>
          )}
        </div>
      </div>

      {/* Expandable filters section */}
      {(showFilters && (hasDropdownFilters || hasTags || hasActiveFilters)) && (
        <div className="glass-card rounded-2xl p-4 space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-300">
          
          {/* Dropdown filters */}
          {hasDropdownFilters && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">Filters</h3>
                {hasActiveFilters && (
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-xs"
                  >
                    Clear all
                  </GlassButton>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {Object.entries(filterOptions).map(([key, options]) => {
                  const selectedValue = filters[key] || 'all';
                  return (
                    <div key={key} className="relative min-w-[120px]">
                      <label className="sr-only">Filter by {key}</label>
                      <select
                        value={selectedValue}
                        onChange={(e) => onFiltersChange?.((f) => ({ ...f, [key]: e.target.value }))}
                        className="glass-surface rounded-lg px-3 py-2 text-sm bg-transparent border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 appearance-none pr-8 w-full"
                        title={`Filter by ${key}`}
                      >
                        <option value="all">All {key}s</option>
                        {options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <ChevronDown 
                        size={14} 
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-70 pointer-events-none" 
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tag filters */}
          {hasTags && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isSelected = tag === 'All' 
                    ? !selectedTags || selectedTags.size === 0 
                    : selectedTags?.has(tag);
                  const count = tagCounts[tag];
                  
                  return (
                    <FilterChip
                      key={tag}
                      active={isSelected}
                      onClick={() => toggleTag(tag)}
                      count={count}
                      variant={tag === 'All' ? 'primary' : 'default'}
                      size="md"
                    >
                      {tag}
                    </FilterChip>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
