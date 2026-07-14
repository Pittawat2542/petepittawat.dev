import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { resolveVisibleItemCount } from './cardOverflow';

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
  const isPinned = overflowPlacement === 'pinned';
  const visibleCount = resolveVisibleItemCount(items.length, maxVisible, minVisible);
  const visibleItems = items.slice(0, visibleCount);
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
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative flex w-full max-w-full min-w-0 flex-nowrap items-center gap-2 overflow-hidden',
        viewportSafe && 'max-w-[calc(100vw-5rem)]',
        className
      )}
    >
      {renderedItems}
      {renderedOverflow}
    </div>
  );
}

export const MeasuredOverflowRow = memo(
  MeasuredOverflowRowComponent
) as typeof MeasuredOverflowRowComponent;

(
  MeasuredOverflowRow as typeof MeasuredOverflowRowComponent & { displayName?: string }
).displayName = 'MeasuredOverflowRow';
