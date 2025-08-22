import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import SearchInput from './SearchInput';
import FilterChip from './FilterChip';
import GlassButton from './GlassButton';
import Selector from './Selector';
import { Calendar, Building2, Tags, User, Award, Code2, Database, Video, FileText, Presentation, Globe, ArrowUpAZ, ArrowDownAZ } from 'lucide-react';

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

  const activeDropdownEntries = Object.entries(filters).filter(([, v]) => v !== 'all' && v !== '');
  const activeTags = selectedTags ? Array.from(selectedTags) : [];

  const activeCount = activeDropdownEntries.length + activeTags.length;

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
                <span className="ml-2 inline-flex items-center justify-center rounded-full bg-ring text-white text-[10px] leading-none min-w-[1.1rem] h-[1.1rem] px-1">
                  {activeCount}
                </span>
              )}
            </GlassButton>
          )}
        </div>

        {/* Sort and results info */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {hasSort && sortValue !== undefined && onSortChange && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Sort:</span>
              <Selector
                value={sortValue}
                onChange={onSortChange}
                className="w-full sm:w-auto"
                options={sortOptions.map(o => {
                  const v = o.value;
                  let icon: React.ReactNode | undefined;
                  if (v.includes('newest') || v.includes('oldest')) icon = <Calendar size={14} />;
                  else if (v.includes('title-az')) icon = <ArrowUpAZ size={14} />;
                  else if (v.includes('title-za')) icon = <ArrowDownAZ size={14} />;
                  else if (v.includes('venue-')) icon = <Building2 size={14} />;
                  else if (v.includes('type')) icon = <FileText size={14} />;
                  return { value: o.value, label: o.label, icon };
                })}
              />
            </div>
          )}
          
          {(totalResults !== undefined || filteredResults !== undefined) && (
            <div className="text-sm text-muted-foreground whitespace-nowrap w-full sm:w-auto">
              {filteredResults !== undefined 
                ? `${filteredResults} ${filteredResults === 1 ? 'result' : 'results'}` 
                : `${totalResults} total`
              }
            </div>
          )}
        </div>
      </div>

      {/* Compact active filters summary row (when collapsed) */}
      {compact && !showFilters && hasActiveFilters && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Active filters</span>
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs"
            >
              Clear all
            </GlassButton>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeDropdownEntries.map(([key, value]) => (
              <FilterChip
                key={`${key}-${value}`}
                active
                removable
                onRemove={() => onFiltersChange?.((f) => { const n = { ...f }; delete n[key]; return n; })}
                variant="default"
                size="sm"
              >
                {`${key.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}: ${String(value).replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}`}
              </FilterChip>
            ))}
            {activeTags.map((tag) => (
              <FilterChip
                key={`tag-${tag}`}
                active
                removable
                onRemove={() => onTagsChange?.((prev) => { const next = new Set(prev); next.delete(tag); return next; })}
                variant="accent"
                size="sm"
              >
                {tag}
              </FilterChip>
            ))}
          </div>
        </div>
      )}

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
                  const toTitle = (s: string) => s.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
                  const iconFor = (k: string, v: string) => {
                    switch (k) {
                      case 'year':
                        return <Calendar size={14} />;
                      case 'venue':
                        return <Building2 size={14} />;
                      case 'tag':
                        return <Tags size={14} />;
                      case 'authorship':
                        return v === 'first-author' ? <Award size={14} /> : <User size={14} />;
                      case 'resource':
                        if (/code/.test(v)) return <Code2 size={14} />;
                        if (/data/.test(v)) return <Database size={14} />;
                        if (/video/.test(v)) return <Video size={14} />;
                        if (/slides?/.test(v)) return <Presentation size={14} />;
                        if (/paper|preprint|journal/.test(v)) return <FileText size={14} />;
                        return <Globe size={14} />;
                      case 'type':
                        return <FileText size={14} />;
                      case 'mode':
                        return <Globe size={14} />;
                      case 'audience':
                        return <User size={14} />;
                      case 'role':
                        return <User size={14} />;
                      case 'link':
                        if (/github|code/.test(v)) return <Code2 size={14} />;
                        if (/paper|journal|preprint/.test(v)) return <FileText size={14} />;
                        return <Globe size={14} />;
                      default:
                        return undefined;
                    }
                  };
                  const optObjects = [
                    { value: 'all', label: `All ${toTitle(key)}s`, icon: iconFor(key, 'all') },
                    ...options.map((o) => ({ value: o, label: toTitle(String(o)), icon: iconFor(key, String(o)) })),
                  ];
                  return (
                    <div key={key} className="min-w-[180px]">
                      <label className="sr-only">Filter by {key}</label>
                      <Selector
                        label={`Filter by ${toTitle(key)}`}
                        value={selectedValue}
                        options={optObjects}
                        onChange={(val) => onFiltersChange?.((f) => ({ ...f, [key]: val }))}
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
