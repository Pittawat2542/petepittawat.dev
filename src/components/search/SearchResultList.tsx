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
};

export const SearchResultList = forwardRef<HTMLUListElement, SearchResultListProps>(
  ({ items, activeIndex, getHref, onItemClick, onActiveIndexChange }, ref) => {
    const renderTypeIcon = (type: SearchItemType) => {
      const meta = SEARCH_TYPE_META_MAP[type];
      const Icon = meta.Icon;
      return <Icon size={14} />;
    };

    return (
      <ul ref={ref} className="divide-y divide-border" role="listbox" aria-activedescendant={`sr-${activeIndex}`}>
        {items.slice(0, 50).map((item, index) => (
          <li
            id={`sr-${index}`}
            key={item.id}
            role="option"
            aria-selected={index === activeIndex}
            className={cn(index === activeIndex && 'bg-white/10')}
          >
            <a
              href={getHref(item)}
              className={cn(
                'flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40'
              )}
              onClick={() => onItemClick(item)}
              onMouseEnter={() => onActiveIndexChange(index)}
            >
              <div className="pt-0.5 flex items-center gap-2 min-w-[7rem]">
                <div className={cn('rounded-md p-1.5 border border-white/10', typeAccentClasses(item.type))}>
                  {renderTypeIcon(item.type)}
                </div>
                <Badge className={cn('capitalize', typeAccentClasses(item.type))}>{item.type}</Badge>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium truncate">{highlightTitle(item.title, item.__titlePositions)}</h3>
                  {item.date && <span className="text-xs text-muted-foreground">{String(item.date).slice(0, 10)}</span>}
                </div>
                {item.description && <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>}
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {item.tags.slice(0, 5).map((tag) => (
                      <span key={tag} className="text-[10px] text-muted-foreground/80">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                {index === activeIndex && (
                  <>
                    <span className="hidden sm:inline-flex items-center gap-1"><CornerDownLeft size={12} /> Open</span>
                    <span className="hidden lg:inline-flex items-center gap-1"><Command size={12} /> + Enter new tab</span>
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
