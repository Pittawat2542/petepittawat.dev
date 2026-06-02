import {
  memo,
  useMemo,
  useState,
  useRef,
  useEffect,
  type FC,
  type MouseEvent,
  type KeyboardEvent,
} from 'react';
import { ChevronDown, Search, Tags, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/core/dropdown-menu';
import { RESET_TAG } from '@/components/explorers/EditorialExplorer';

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
  const [isOpen, setIsOpen] = useState(false);
  const [tagQuery, setTagQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isEditorial = tone === 'editorial';
  const selectedTagList = useMemo(
    () => (selectedTags ? Array.from(selectedTags).sort((a, b) => a.localeCompare(b)) : []),
    [selectedTags]
  );
  const selectableTags = useMemo(
    () => availableTags.filter(tag => tag !== RESET_TAG && tag !== 'All'),
    [availableTags]
  );

  const filteredTags = useMemo(() => {
    const query = tagQuery.trim().toLowerCase();
    const matches = query
      ? selectableTags.filter(tag => tag.toLowerCase().includes(query))
      : selectableTags;

    return [...matches].sort((a, b) => {
      const aSelected = selectedTags?.has(a) ? 0 : 1;
      const bSelected = selectedTags?.has(b) ? 0 : 1;
      return aSelected - bSelected || a.localeCompare(b);
    });
  }, [selectableTags, selectedTags, tagQuery]);

  const clearTags = () => {
    onToggleTag(RESET_TAG);
  };

  const handleContainerClick = (event: MouseEvent) => {
    if ((event.target as HTMLElement).closest('.editorial-tag-combobox__chip-remove')) {
      return;
    }
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleChevronClick = (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setIsOpen(prev => !prev);
    if (!isOpen) {
      inputRef.current?.focus();
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // Let navigation and helper keys bubble to Radix UI
    if (
      event.key === 'ArrowDown' ||
      event.key === 'ArrowUp' ||
      event.key === 'Escape' ||
      event.key === 'Tab'
    ) {
      return;
    }

    // Stop propagation of other keys so Radix UI doesn't hijack them
    event.stopPropagation();

    // Pressing Backspace on empty input removes the last active tag
    if (event.key === 'Backspace' && tagQuery === '' && selectedTagList.length > 0) {
      const lastTag = selectedTagList[selectedTagList.length - 1];
      if (lastTag) {
        onToggleTag(lastTag);
      }
    }

    // Pressing Enter selects the first matching tag option and clears search
    if (event.key === 'Enter') {
      event.preventDefault();
      if (filteredTags.length > 0) {
        const firstTag = filteredTags[0];
        if (firstTag) {
          onToggleTag(firstTag);
          setTagQuery('');
        }
      }
    }
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isOpen) {
      timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isOpen, selectedTags]);

  if (availableTags.length === 0) {
    return null;
  }

  return (
    <div className={cn(isEditorial && 'editorial-filter-group editorial-filter-group--tags')}>
      <div className="editorial-filter-group__heading">
        <span
          className={cn(
            'text-muted-foreground text-sm font-medium',
            isEditorial && 'editorial-control-label'
          )}
        >
          Tags
        </span>
        {selectedTagList.length > 0 ? (
          <button type="button" className="editorial-filter-clear" onClick={clearTags}>
            Clear tags
          </button>
        ) : null}
      </div>

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <div
            ref={containerRef}
            className={cn(
              'editorial-tag-combobox',
              !isEditorial && 'border-muted/30 bg-muted/20 text-muted-foreground',
              isOpen && 'editorial-tag-combobox--focused'
            )}
            onClick={handleContainerClick}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                if (event.target === containerRef.current) {
                  setIsOpen(true);
                  inputRef.current?.focus();
                  event.preventDefault();
                }
              }
            }}
            tabIndex={0}
            role="button"
            aria-expanded={isOpen}
            aria-haspopup="menu"
            aria-label="Filter by tags"
          >
            <span className="editorial-tag-combobox__icon" aria-hidden="true">
              {tagQuery ? <Search size={15} /> : <Tags size={15} />}
            </span>

            <div className="editorial-tag-combobox__tags-container">
              {selectedTagList.map(tag => (
                <span key={tag} className="editorial-tag-combobox__chip">
                  {tag}
                  <button
                    type="button"
                    className="editorial-tag-combobox__chip-remove"
                    onClick={event => {
                      event.stopPropagation();
                      onToggleTag(tag);
                    }}
                    onPointerDown={event => {
                      event.stopPropagation();
                    }}
                    onMouseDown={event => {
                      event.stopPropagation();
                    }}
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X size={11} aria-hidden="true" />
                  </button>
                </span>
              ))}
              <span
                className={cn(
                  'editorial-tag-combobox__input',
                  selectedTagList.length > 0 && 'has-chips'
                )}
                aria-hidden="true"
              >
                {selectedTagList.length > 0 ? '' : tagQuery || 'Search tags'}
              </span>
            </div>

            <button
              type="button"
              className="editorial-tag-combobox__chevron-btn"
              onClick={handleChevronClick}
              onPointerDown={event => {
                event.stopPropagation();
              }}
              onMouseDown={event => {
                event.stopPropagation();
              }}
              aria-label={isOpen ? 'Close tag menu' : 'Open tag menu'}
              tabIndex={-1}
            >
              <ChevronDown
                className={cn('editorial-tag-combobox__chevron', isOpen && 'rotate-180')}
                size={16}
                aria-hidden="true"
              />
            </button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="editorial-tag-menu" align="start" sideOffset={8}>
          <DropdownMenuLabel className="editorial-tag-menu__label">
            Filter by tags
          </DropdownMenuLabel>
          <div className="editorial-tag-menu__search">
            <Search size={15} aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={tagQuery}
              onChange={event => {
                setTagQuery(event.target.value);
              }}
              onKeyDown={handleInputKeyDown}
              onPointerDown={event => {
                event.stopPropagation();
              }}
              onMouseDown={event => {
                event.stopPropagation();
              }}
              onClick={event => {
                event.stopPropagation();
              }}
              placeholder="Search tags"
              aria-label="Search tags"
            />
            {tagQuery ? (
              <button
                type="button"
                className="editorial-tag-menu__clear-query"
                onClick={event => {
                  event.stopPropagation();
                  setTagQuery('');
                  inputRef.current?.focus();
                }}
                aria-label="Clear tag search"
              >
                <X size={12} aria-hidden="true" />
              </button>
            ) : null}
          </div>
          <DropdownMenuSeparator className="editorial-tag-menu__separator" />
          <div className="editorial-tag-menu__items" aria-label="Tag options">
            {filteredTags.length > 0 ? (
              filteredTags.map(tag => {
                const checked = Boolean(selectedTags?.has(tag));
                const count = tagCounts[tag];

                return (
                  <DropdownMenuCheckboxItem
                    key={tag}
                    checked={checked}
                    onCheckedChange={() => {
                      onToggleTag(tag);
                    }}
                    onSelect={event => {
                      event.preventDefault();
                    }}
                    className="editorial-tag-menu__item"
                  >
                    <span className="editorial-tag-menu__item-label">{tag}</span>
                    {count !== undefined ? (
                      <span className="editorial-tag-menu__item-count">{count}</span>
                    ) : null}
                  </DropdownMenuCheckboxItem>
                );
              })
            ) : (
              <div className="editorial-tag-menu__empty">No matching tags</div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
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
