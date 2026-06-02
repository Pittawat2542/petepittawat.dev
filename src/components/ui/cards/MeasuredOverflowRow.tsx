import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

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

  const measureNode = (
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
  );

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
        {measureNode}
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
      {measureNode}
    </div>
  );
}

export const MeasuredOverflowRow = memo(
  MeasuredOverflowRowComponent
) as typeof MeasuredOverflowRowComponent;

(
  MeasuredOverflowRow as typeof MeasuredOverflowRowComponent & { displayName?: string }
).displayName = 'MeasuredOverflowRow';
