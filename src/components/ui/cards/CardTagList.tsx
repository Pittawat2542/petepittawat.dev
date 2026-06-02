import { memo, type FC } from 'react';
import { Badge } from '@/components/ui/core/badge';
import { cn } from '@/lib/utils';
import { getCardAccentTint } from './cardTone';
import { MeasuredOverflowRow } from './MeasuredOverflowRow';

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
          borderColor: getCardAccentTint(20),
          background: getCardAccentTint(6),
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
          borderColor: getCardAccentTint(58),
          background: `linear-gradient(180deg, ${getCardAccentTint(24)}, ${getCardAccentTint(12)})`,
          boxShadow: `inset 0 1px 0 ${getCardAccentTint(20)}, 0 10px 24px -18px var(--card-accent)`,
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

export const CardTagList = memo(CardTagListComponent);

CardTagList.displayName = 'CardTagList';
