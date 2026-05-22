import { forwardRef } from 'react';
import { Badge } from '@/components/ui/core/badge';
import { CornerDownLeft, Command, ExternalLink } from 'lucide-react';

import { cn } from '@/lib/utils';
import { highlightTitle } from './utils';
import {
  SEARCH_TYPE_META_MAP,
  type AugmentedSearchItem,
  type SearchItemType,
  typeAccentClasses,
} from './types';

type SearchResultListProps = {
  items: AugmentedSearchItem[];
  activeIndex: number;
  getHref: (item: AugmentedSearchItem) => string;
  onItemClick: (item: AugmentedSearchItem) => void;
  onActiveIndexChange: (index: number) => void;
  query?: string;
  onTagClick?: (tag: string) => void;
};

export const SearchResultList = forwardRef<HTMLUListElement, SearchResultListProps>(
  (
    { items, activeIndex, getHref, onItemClick, onActiveIndexChange, query = '', onTagClick },
    ref
  ) => {
    const renderTypeIcon = (type: SearchItemType) => {
      const meta = SEARCH_TYPE_META_MAP[type];
      const Icon = meta.Icon;
      return <Icon size={14} />;
    };

    return (
      <ul
        ref={ref}
        className="divide-border divide-y"
        role="listbox"
        aria-activedescendant={`sr-${activeIndex}`}
      >
        {items.slice(0, 50).map((item, index) => (
          <li
            id={`sr-${index}`}
            key={item.id}
            role="option"
            aria-selected={index === activeIndex}
            className={cn(
              'search-result-item-wrapper',
              index === activeIndex && 'search-result-item-wrapper--active'
            )}
          >
            <a
              href={getHref(item)}
              className={cn(
                'flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/5',
                'focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:outline-none'
              )}
              onClick={() => {
                onItemClick(item);
              }}
              onMouseEnter={() => {
                onActiveIndexChange(index);
              }}
            >
              <div className="flex min-w-[7rem] items-center gap-2 pt-0.5">
                <div
                  className={cn(
                    'rounded-md border border-white/10 p-1.5',
                    typeAccentClasses(item.type)
                  )}
                >
                  {renderTypeIcon(item.type)}
                </div>
                <Badge className={cn('capitalize', typeAccentClasses(item.type))}>
                  {item.type}
                </Badge>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-medium">
                    {highlightTitle(item.title, item.__titlePositions)}
                  </h3>
                  {(item.locale === 'th' ||
                    (item.isFallback && item.availableLocales.length > 1)) && (
                    <Badge className="type-micro bg-white/10 text-white/75">
                      {item.locale.toUpperCase()}
                    </Badge>
                  )}
                  {item.date && (
                    <span className="text-muted-foreground text-xs">
                      {String(item.date).slice(0, 10)}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-muted-foreground line-clamp-2 text-xs">{item.description}</p>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5" onClick={e => e.stopPropagation()}>
                    {item.tags.slice(0, 5).map(tag => {
                      const cleanQuery = query.startsWith('#')
                        ? query.slice(1).trim()
                        : query.trim();
                      const isMatched =
                        cleanQuery && tag.toLowerCase().includes(cleanQuery.toLowerCase());
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            onTagClick?.(tag);
                          }}
                          className={cn(
                            'type-micro rounded border px-1.5 py-0.5 transition-all hover:scale-[1.03] active:scale-[0.97]',
                            isMatched
                              ? 'border-accent/40 bg-accent/10 text-accent font-semibold'
                              : 'text-muted-foreground/80 border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/5 hover:text-white'
                          )}
                        >
                          #{tag}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="text-muted-foreground type-caption mt-1 flex items-center gap-2">
                {index === activeIndex && (
                  <>
                    <span className="hidden items-center gap-1 sm:inline-flex">
                      <CornerDownLeft size={12} /> Open
                    </span>
                    <span className="hidden items-center gap-1 lg:inline-flex">
                      <Command size={12} /> + Enter new tab
                    </span>
                  </>
                )}
                <ExternalLink size={14} className="opacity-60" />
              </div>
            </a>
          </li>
        ))}
      </ul>
    );
  }
);

SearchResultList.displayName = 'SearchResultList';
