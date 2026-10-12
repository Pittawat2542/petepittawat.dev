import { ChevronDown, Filter, Search, Calendar } from 'lucide-react';
import SearchInput from '@/components/ui/interaction/SearchInput';
import BlogLanguageSwitcher from '@/components/ui/blog/BlogLanguageSwitcher';
import { listingOptions, listingTagCounts, selectListing, readListingState } from '@/lib/listing';
import type { ListingItem } from '@/lib/listing';

export default function ListingToolbar({
  items,
  blog = false,
  fields,
  initialTags = [],
  placeholder,
}: {
  items: ListingItem[];
  blog?: boolean;
  fields: string[];
  initialTags?: readonly string[];
  placeholder: string;
}) {
  const options = listingOptions(items, fields);
  const counts = listingTagCounts(items);
  const initialCount = selectListing(
    items,
    readListingState(new URL('https://local.invalid'), initialTags)
  ).length;
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    ...(!blog
      ? [
          { value: 'title-az', label: 'Title A→Z' },
          { value: 'title-za', label: 'Title Z→A' },
        ]
      : []),
  ];
  const select = (key: string, label: string, values: { value: string; label: string }[]) => (
    <div className="static-select" data-select={key} key={key}>
      <button
        type="button"
        className="selector--editorial shape-squircle-sm relative w-full rounded-[1.15rem] px-4 py-2 text-left text-sm sm:min-w-[12rem]"
        data-menu-trigger={`listing-menu-${key}`}
        aria-haspopup="listbox"
        aria-expanded="false"
        aria-controls={`listing-menu-${key}`}
        aria-label={label}
      >
        <span className="selector__current--editorial relative flex items-center gap-2 pr-5">
          {key !== 'sort' && (
            <span className="selector__icon--editorial inline-flex shrink-0 rounded-full p-1">
              <Calendar size={15} />
            </span>
          )}
          <span data-select-label className="selector__label--editorial truncate font-medium">
            {values[0]?.label}
          </span>
        </span>
        <ChevronDown
          size={16}
          className="selector__chevron--editorial absolute top-1/2 right-3 -translate-y-1/2"
        />
      </button>
      <div
        id={`listing-menu-${key}`}
        popover="auto"
        role="listbox"
        aria-label={label}
        className="static-listing-menu selector__content--editorial"
        data-menu
        data-filter-key={key}
      >
        {values.map((option, i) => (
          <button
            type="button"
            key={option.value}
            role="option"
            aria-selected={i === 0}
            data-value={option.value}
            className="static-listing-option"
            tabIndex={-1}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
  return (
    <div className="editorial-filter-panel flex flex-col gap-3" data-listing-toolbar>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1" data-listing-query>
            <SearchInput
              value=""
              onChange={() => {}}
              placeholder={placeholder}
              tone="editorial"
              staticControls
            />
          </div>
          <button
            type="button"
            className="editorial-filter-toggle"
            aria-expanded="false"
            aria-controls="listing-filters"
            aria-label="Toggle filters"
            data-toggle-filters
          >
            <Filter size={17} />
            Filters
            <span
              className="editorial-filter-toggle__badge"
              data-active-count
              hidden={!initialTags.length}
            >
              {initialTags.length}
            </span>
          </button>
        </div>
        <div className="static-toolbar-tools grid items-center gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="static-toolbar-sort flex w-full flex-col items-start gap-1 sm:w-auto sm:flex-row sm:items-center">
            <span className="editorial-control-label">Sort</span>
            {select('sort', 'Sort results', sortOptions)}
          </div>
          {blog && (
            <BlogLanguageSwitcher
              ariaLabel="Select blog language"
              variant="toolbar"
              tone="editorial"
              onSelect={() => {}}
              options={[
                {
                  locale: 'en',
                  label: 'English',
                  shortLabel: 'EN',
                  available: true,
                  isActive: true,
                },
                {
                  locale: 'th',
                  label: 'ภาษาไทย',
                  shortLabel: 'TH',
                  available: true,
                  isActive: false,
                },
              ]}
            />
          )}
          <div
            className="editorial-results-info"
            role="status"
            aria-live="polite"
            data-results-count
          >
            {initialCount} of {items.length} {initialTags.length ? 'matching' : 'total'} results
          </div>
        </div>
      </div>
      <div data-active-filters hidden={!initialTags.length} className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="editorial-control-label">Active filters</span>
          <button type="button" data-clear-all className="text-xs text-white/60">
            Clear all
          </button>
        </div>
        <div data-active-chips className="flex flex-wrap gap-2">
          {initialTags.map(tag => (
            <button
              key={tag}
              type="button"
              data-remove-key="tag"
              data-remove-value={tag}
              className="static-active-chip"
              aria-label={`Remove tag ${tag}`}
            >
              {tag} ×
            </button>
          ))}
        </div>
      </div>
      <div
        id="listing-filters"
        data-filter-panel
        hidden
        className="editorial-filter-panel__body editorial-filter-panel__filters space-y-4"
      >
        <div className="editorial-filter-groups">
          {Object.entries(options).map(([key, values], index) => (
            <div className="editorial-filter-group" key={key}>
              <div className="editorial-filter-group__heading">
                <span className="editorial-control-label">
                  {key[0]?.toUpperCase()}
                  {key.slice(1)}
                </span>
                {index === 0 && (
                  <button type="button" data-clear-all className="editorial-filter-clear">
                    Clear all
                  </button>
                )}
              </div>
              {select(key, `Filter by ${key}`, [
                { value: 'all', label: `All ${key === 'series' ? 'series' : `${key}s`}` },
                ...values.map(value => ({
                  value,
                  label: value === 'standalone' ? 'Standalone' : value,
                })),
              ])}
            </div>
          ))}
        </div>
        <div className="editorial-filter-group editorial-filter-group--tags">
          <div className="editorial-filter-group__heading">
            <span className="editorial-control-label">Tags</span>
            <button type="button" data-clear-tags className="text-xs text-white/60">
              Clear tags
            </button>
          </div>
          <button
            type="button"
            className="editorial-tag-combobox w-full text-left"
            data-menu-trigger="listing-tag-menu"
            aria-haspopup="menu"
            aria-expanded="false"
            aria-controls="listing-tag-menu"
          >
            <Search size={15} />
            <span data-tag-label className="editorial-tag-combobox__input">
              Search tags
            </span>
            <ChevronDown size={16} />
          </button>
          <div
            id="listing-tag-menu"
            popover="auto"
            className="static-listing-menu editorial-tag-menu"
            data-menu
          >
            <div className="editorial-tag-menu__label">Filter by tags</div>
            <div className="editorial-tag-menu__search">
              <Search size={15} />
              <input
                type="search"
                placeholder="Search tags"
                aria-label="Search tags"
                data-tag-query
              />
            </div>
            <div
              className="editorial-tag-menu__items"
              role="menu"
              aria-label="Tag options"
              data-tag-options
            >
              {Object.keys(counts)
                .sort((a, b) => a.localeCompare(b))
                .map(tag => (
                  <button
                    type="button"
                    role="menuitemcheckbox"
                    aria-checked={initialTags.includes(tag)}
                    className="editorial-tag-menu__item static-listing-option"
                    data-tag={tag}
                    key={tag}
                    tabIndex={-1}
                  >
                    <span className="editorial-tag-menu__item-label">{tag}</span>
                    <span className="editorial-tag-menu__item-count">{counts[tag]}</span>
                  </button>
                ))}
            </div>
            <p className="editorial-tag-menu__empty" data-no-tags hidden>
              No matching tags
            </p>
          </div>
        </div>
      </div>
      <p role="status" data-locale-status hidden />
    </div>
  );
}
