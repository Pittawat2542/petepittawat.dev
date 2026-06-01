import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type FC,
  type ReactNode,
} from 'react';
import { Badge } from '@/components/ui/core/badge';
import { cn } from '@/lib/utils';

function tint(intensity: number) {
  return `color-mix(in oklab, var(--card-accent) ${intensity}%, transparent)`;
}

interface CardKickerProps {
  readonly label: string;
  readonly className?: string | undefined;
}

const CardKickerComponent: FC<CardKickerProps> = ({ label, className }) => (
  <div
    className={cn(
      'type-micro inline-flex items-center gap-2 font-semibold tracking-[0.28em] text-white/48 uppercase',
      className
    )}
  >
    <span
      className="inline-block h-2 w-2 rounded-full"
      style={{
        background: 'color-mix(in oklab, var(--card-accent) 72%, white)',
        boxShadow: `0 0 0 6px ${tint(12)}`,
      }}
    />
    {label}
  </div>
);

interface CardInfoPanelProps {
  readonly children: ReactNode;
  readonly className?: string | undefined;
  readonly style?: CSSProperties | undefined;
}

const CardInfoPanelComponent: FC<CardInfoPanelProps> = ({ children, className, style }) => (
  <div
    className={cn('rounded-[1.2rem] border px-4 py-4', className)}
    style={{
      borderColor: tint(18),
      background: `linear-gradient(180deg, ${tint(8)}, transparent)`,
      ...style,
    }}
  >
    {children}
  </div>
);

interface CardDividerProps {
  readonly className?: string | undefined;
}

const CardDividerComponent: FC<CardDividerProps> = ({ className }) => (
  <div
    className={cn('h-px w-full', className)}
    style={{
      background: `linear-gradient(90deg, ${tint(32)}, transparent 85%)`,
    }}
  />
);

interface CardMetaRowProps {
  readonly children: ReactNode;
  readonly className?: string | undefined;
  readonly viewportSafe?: boolean | undefined;
}

const CardMetaRowComponent: FC<CardMetaRowProps> = ({ children, className, viewportSafe }) => (
  <div
    className={cn(
      '-my-1 flex max-w-full min-w-0 flex-wrap items-center gap-2 overflow-visible py-1',
      viewportSafe && 'max-w-[calc(100vw-5rem)]',
      className
    )}
  >
    {children}
  </div>
);

interface CardMetaChipProps {
  readonly children: ReactNode;
  readonly icon?: ElementType | undefined;
  readonly className?: string | undefined;
  readonly title?: string | undefined;
}

const CardMetaChipComponent: FC<CardMetaChipProps> = ({
  children,
  icon: Icon,
  className,
  title,
}) => (
  <span
    className={cn(
      'type-caption inline-flex max-w-full shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 font-medium text-[color:var(--card-accent)]/76 uppercase md:text-xs',
      className
    )}
    style={{
      borderColor: tint(28),
      background: `linear-gradient(180deg, ${tint(10)}, ${tint(5)})`,
      boxShadow: `inset 0 1px 0 ${tint(10)}`,
    }}
    title={title}
  >
    {Icon ? <Icon size={12} aria-hidden="true" className="icon-bounce shrink-0" /> : null}
    <span className="min-w-0 truncate leading-tight">{children}</span>
  </span>
);

interface MeasuredOverflowRowProps<TItem> {
  readonly items: readonly TItem[];
  readonly maxVisible?: number | undefined;
  readonly minVisible?: number | undefined;
  readonly overflowPlacement?: 'inline' | 'pinned' | undefined;
  readonly className?: string | undefined;
  readonly itemClassName?: string | undefined;
  readonly overflowClassName?: string | undefined;
  readonly viewportSafe?: boolean | undefined;
  readonly getKey: (item: TItem, index: number) => string;
  readonly renderItem: (item: TItem, index: number) => ReactNode;
  readonly renderOverflow: (hiddenCount: number) => ReactNode;
}

function getGapWidth(element: HTMLElement) {
  const style = window.getComputedStyle(element);
  return Number.parseFloat(style.columnGap || style.gap || '0') || 0;
}

function getMeasureWidth(element: Element | undefined) {
  return element?.getBoundingClientRect().width ?? 0;
}

function MeasuredOverflowRowComponent<TItem>({
  items,
  maxVisible,
  minVisible = 1,
  overflowPlacement = 'inline',
  className,
  itemClassName,
  overflowClassName,
  viewportSafe,
  getKey,
  renderItem,
  renderOverflow,
}: MeasuredOverflowRowProps<TItem>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const maxCount = Math.min(items.length, maxVisible ?? items.length);
  const floorCount = Math.min(maxCount, Math.max(0, Math.min(minVisible, items.length)));
  const [visibleCount, setVisibleCount] = useState(floorCount);
  const isPinned = overflowPlacement === 'pinned';

  const updateVisibleCount = useCallback(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure || items.length === 0) {
      setVisibleCount(0);
      return;
    }

    const availableWidth = container.clientWidth;
    const gap = isPinned ? getGapWidth(measure) : getGapWidth(container);
    const measuredItems = Array.from(measure.querySelectorAll('[data-card-overflow-measure-item]'));
    const measuredMore = measure.querySelector('[data-card-overflow-measure-more]');

    let nextVisible = floorCount;

    for (let candidate = maxCount; candidate >= floorCount; candidate -= 1) {
      const hiddenCount = items.length - candidate;
      const itemWidth = measuredItems
        .slice(0, candidate)
        .reduce((sum, element) => sum + getMeasureWidth(element), 0);
      const overflowWidth = hiddenCount > 0 ? getMeasureWidth(measuredMore ?? undefined) : 0;
      const visibleParts = candidate + (hiddenCount > 0 ? 1 : 0);
      const inlineGap = Math.max(0, visibleParts - 1) * gap;
      const pinnedItemGap = Math.max(0, candidate - 1) * gap;
      const pinnedAvailableWidth =
        hiddenCount > 0 ? Math.max(0, availableWidth - overflowWidth - gap) : availableWidth;
      const fits = isPinned
        ? itemWidth + pinnedItemGap <= pinnedAvailableWidth
        : itemWidth + overflowWidth + inlineGap <= availableWidth;

      if (fits || candidate === floorCount) {
        nextVisible = candidate;
        break;
      }
    }

    setVisibleCount(nextVisible);
  }, [floorCount, isPinned, items.length, maxCount]);

  const enforceRenderedFit = useCallback(() => {
    const container = containerRef.current;
    if (!container || visibleCount <= floorCount) return;

    const overflowTarget = isPinned
      ? container.querySelector<HTMLElement>('[data-card-overflow-track]')
      : container;

    if (!overflowTarget) return;

    const isOverflowing = overflowTarget.scrollWidth > overflowTarget.clientWidth + 1;
    if (isOverflowing) {
      setVisibleCount(currentCount => Math.max(floorCount, currentCount - 1));
    }
  }, [floorCount, isPinned, visibleCount]);

  useLayoutEffect(() => {
    setVisibleCount(floorCount);
  }, [floorCount, items]);

  useLayoutEffect(() => {
    updateVisibleCount();
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return undefined;

    const observer = new ResizeObserver(() => {
      updateVisibleCount();
    });
    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, [updateVisibleCount]);

  useLayoutEffect(() => {
    enforceRenderedFit();
  }, [enforceRenderedFit]);

  useEffect(() => {
    if (typeof document === 'undefined' || !document.fonts) return undefined;

    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) {
        updateVisibleCount();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [updateVisibleCount]);

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
  const hiddenCount = Math.max(0, items.length - visibleItems.length);
  const itemWrapperClassName = isPinned
    ? 'inline-flex min-w-0 max-w-full shrink overflow-hidden'
    : 'inline-flex min-w-0 shrink-0';
  const overflowWrapperClassName = isPinned
    ? 'inline-flex min-w-0 shrink-0 justify-self-end'
    : 'inline-flex min-w-0 shrink-0';

  if (!items.length) return null;

  const renderedItems = visibleItems.map((item, index) => (
    <span
      key={getKey(item, index)}
      data-card-overflow-item
      className={cn(itemWrapperClassName, itemClassName)}
    >
      {renderItem(item, index)}
    </span>
  ));

  const renderedOverflow =
    hiddenCount > 0 ? (
      <span data-card-overflow-more className={cn(overflowWrapperClassName, overflowClassName)}>
        {renderOverflow(hiddenCount)}
      </span>
    ) : null;

  if (isPinned) {
    const pinnedGridClassName =
      hiddenCount > 0 ? 'grid-cols-[minmax(0,1fr)_auto] gap-2' : 'grid-cols-[minmax(0,1fr)] gap-0';

    return (
      <div
        ref={containerRef}
        className={cn(
          'relative grid w-full max-w-full min-w-0 items-center overflow-hidden',
          pinnedGridClassName,
          viewportSafe && 'max-w-[calc(100vw-5rem)]',
          className
        )}
      >
        <div
          data-card-overflow-track
          className="flex max-w-full min-w-0 flex-nowrap items-center gap-2 overflow-hidden"
        >
          {renderedItems}
        </div>
        {renderedOverflow}

        <div
          ref={measureRef}
          aria-hidden="true"
          className="pointer-events-none invisible fixed top-0 -left-[10000px] -z-10 flex max-w-none flex-nowrap items-center gap-2 overflow-visible"
        >
          {items.slice(0, maxCount).map((item, index) => (
            <span
              key={`measure-${getKey(item, index)}`}
              data-card-overflow-measure-item
              className={cn('inline-flex min-w-0 shrink-0', itemClassName)}
            >
              {renderItem(item, index)}
            </span>
          ))}
          {items.length > floorCount ? (
            <span
              data-card-overflow-measure-more
              className={cn('inline-flex min-w-0 shrink-0', overflowClassName)}
            >
              {renderOverflow(Math.max(1, items.length - floorCount))}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex w-full max-w-full min-w-0 flex-nowrap items-center gap-2 overflow-hidden',
        viewportSafe && 'max-w-[calc(100vw-5rem)]',
        className
      )}
    >
      {renderedItems}
      {renderedOverflow}

      <div
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none invisible fixed top-0 -left-[10000px] -z-10 flex max-w-none flex-nowrap items-center gap-2 overflow-visible"
      >
        {items.slice(0, maxCount).map((item, index) => (
          <span
            key={`measure-${getKey(item, index)}`}
            data-card-overflow-measure-item
            className={cn('inline-flex min-w-0 shrink-0', itemClassName)}
          >
            {renderItem(item, index)}
          </span>
        ))}
        {items.length > floorCount ? (
          <span
            data-card-overflow-measure-more
            className={cn('inline-flex min-w-0 shrink-0', overflowClassName)}
          >
            {renderOverflow(Math.max(1, items.length - floorCount))}
          </span>
        ) : null}
      </div>
    </div>
  );
}

interface CardTagListProps {
  readonly tags?: readonly string[] | undefined;
  readonly tone?: 'accent' | 'muted' | undefined;
  readonly maxVisible?: number;
  readonly minVisible?: number;
  readonly onOverflowClick?: () => void;
  readonly overflowLabel?: string;
  readonly viewportSafe?: boolean;
  readonly className?: string | undefined;
}

const CardTagListComponent: FC<CardTagListProps> = ({
  tags,
  tone = 'accent',
  maxVisible,
  minVisible = 1,
  onOverflowClick,
  overflowLabel = 'Show all tags',
  viewportSafe,
  className,
}) => {
  if (!tags?.length) return null;

  const mutedStyle =
    tone === 'muted'
      ? {
          borderColor: tint(20),
          background: tint(6),
        }
      : {
          borderColor: 'color-mix(in oklab, var(--card-accent) 20%, transparent)',
          color: 'color-mix(in oklab, var(--card-accent) 74%, white)',
          background: 'color-mix(in oklab, var(--card-accent) 8%, rgba(15,23,42,0.3))',
        };
  const renderTag = (tag: string) => (
    <Badge
      className={cn(
        'type-caption max-w-[min(18rem,100%)] min-w-0 overflow-hidden rounded-full border px-3 py-1 font-medium md:text-xs',
        tone === 'muted' && 'text-white/70'
      )}
      variant="outline"
      style={mutedStyle}
    >
      <span className="block max-w-full min-w-0 truncate">{tag}</span>
    </Badge>
  );
  const renderOverflow = (hiddenCount: number) =>
    onOverflowClick ? (
      <button
        type="button"
        className={cn(
          'type-caption rounded-full border px-3.5 py-1 font-semibold whitespace-nowrap text-[color:var(--card-accent)] transition-[border-color,background-color,color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:text-white focus-visible:ring-2 focus-visible:ring-[color:var(--card-accent)]/55 focus-visible:outline-none md:text-xs'
        )}
        style={{
          borderColor: tint(58),
          background: `linear-gradient(180deg, ${tint(24)}, ${tint(12)})`,
          boxShadow: `inset 0 1px 0 ${tint(20)}, 0 10px 24px -18px var(--card-accent)`,
        }}
        onClick={event => {
          event.stopPropagation();
          onOverflowClick();
        }}
        aria-label={`${overflowLabel}: ${hiddenCount} more`}
      >
        +{hiddenCount} more
      </button>
    ) : null;

  if (typeof maxVisible === 'number' && onOverflowClick) {
    return (
      <MeasuredOverflowRow
        items={tags}
        maxVisible={maxVisible}
        minVisible={minVisible}
        overflowPlacement="pinned"
        getKey={tag => tag}
        renderItem={renderTag}
        renderOverflow={renderOverflow}
        viewportSafe={viewportSafe}
        className={cn('-my-1 flex-nowrap py-1', className)}
      />
    );
  }

  return (
    <div
      className={cn('flex flex-wrap gap-2', viewportSafe && 'max-w-[calc(100vw-5rem)]', className)}
    >
      {tags.map(tag => (
        <span key={tag}>{renderTag(tag)}</span>
      ))}
    </div>
  );
};

const MeasuredOverflowRow = memo(
  MeasuredOverflowRowComponent
) as typeof MeasuredOverflowRowComponent;
export const CardMetaRow = memo(CardMetaRowComponent);
export const CardMetaChip = memo(CardMetaChipComponent);
export const CardKicker = memo(CardKickerComponent);
export const CardInfoPanel = memo(CardInfoPanelComponent);
export const CardDivider = memo(CardDividerComponent);
export const CardTagList = memo(CardTagListComponent);
export { MeasuredOverflowRow };

CardMetaRow.displayName = 'CardMetaRow';
CardMetaChip.displayName = 'CardMetaChip';
CardKicker.displayName = 'CardKicker';
CardInfoPanel.displayName = 'CardInfoPanel';
CardDivider.displayName = 'CardDivider';
CardTagList.displayName = 'CardTagList';
