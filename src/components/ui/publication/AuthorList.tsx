import type { CSSProperties, FC } from 'react';
import { memo } from 'react';
import { MeasuredOverflowRow } from '@/components/ui/cards/CardAtoms';
import { cn } from '@/lib/utils';
import { renderAuthorsBold } from './utils';

interface AuthorListProps {
  readonly authors: string;
}

interface AuthorChipListProps extends AuthorListProps {
  readonly maxVisible?: number;
  readonly minVisible?: number;
  readonly onOverflowClick?: () => void;
  readonly overflowLabel?: string;
  readonly className?: string | undefined;
  readonly viewportSafe?: boolean;
}

interface AuthorChipCloudProps extends AuthorListProps {
  readonly className?: string | undefined;
}

const AuthorListComponent: FC<AuthorListProps> = ({ authors }) => {
  const authorData = renderAuthorsBold(authors);

  return (
    <>
      {authorData.map((author, idx) => (
        <span key={`${author.name}-${idx}`}>
          {author.isOwner ? <strong>{author.name}</strong> : author.name}
          {!author.isLast ? ', ' : ''}
        </span>
      ))}
    </>
  );
};

// Memoize the component
export const AuthorList = memo(AuthorListComponent, (prevProps, nextProps) => {
  return prevProps.authors === nextProps.authors;
});

function getAuthorChipStyle(author: ReturnType<typeof renderAuthorsBold>[number]) {
  return {
    borderColor: author.isOwner
      ? 'color-mix(in oklab, var(--card-accent) 42%, transparent)'
      : 'color-mix(in oklab, var(--white) 12%, transparent)',
    background: author.isOwner
      ? 'linear-gradient(180deg, color-mix(in oklab, var(--card-accent) 13%, transparent), color-mix(in oklab, var(--card-accent) 6%, transparent))'
      : 'color-mix(in oklab, var(--white) 5%, transparent)',
    boxShadow: author.isOwner
      ? 'inset 0 1px 0 color-mix(in oklab, var(--card-accent) 13%, transparent)'
      : undefined,
  } as CSSProperties;
}

function renderAuthorChip(author: ReturnType<typeof renderAuthorsBold>[number]) {
  return (
    <span
      data-publication-author-chip
      className={cn(
        'type-caption inline-flex max-w-[min(24rem,100%)] min-w-0 items-center overflow-hidden rounded-full border px-3 py-1.5 font-medium md:text-xs',
        author.isOwner ? 'text-[color:var(--card-accent)]' : 'text-white/72'
      )}
      style={getAuthorChipStyle(author)}
      title={author.name}
    >
      <span className="block max-w-full min-w-0 truncate">{author.name}</span>
    </span>
  );
}

const AuthorChipListComponent: FC<AuthorChipListProps> = ({
  authors,
  maxVisible,
  minVisible = 1,
  onOverflowClick,
  overflowLabel = 'Show all authors',
  className,
  viewportSafe,
}) => {
  const authorData = renderAuthorsBold(authors);
  const renderAuthor = (author: ReturnType<typeof renderAuthorsBold>[number]) =>
    renderAuthorChip(author);
  const renderOverflow = (hiddenCount: number) =>
    onOverflowClick ? (
      <button
        type="button"
        className="type-caption rounded-full border px-3.5 py-1.5 font-semibold whitespace-nowrap text-[color:var(--card-accent)] transition-[border-color,background-color,color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:text-white focus-visible:ring-2 focus-visible:ring-[color:var(--card-accent)]/55 focus-visible:outline-none md:text-xs"
        style={{
          borderColor: 'color-mix(in oklab, var(--card-accent) 58%, transparent)',
          background:
            'linear-gradient(180deg, color-mix(in oklab, var(--card-accent) 24%, transparent), color-mix(in oklab, var(--card-accent) 12%, transparent))',
          boxShadow:
            'inset 0 1px 0 color-mix(in oklab, var(--card-accent) 20%, transparent), 0 10px 24px -18px var(--card-accent)',
        }}
        onClick={onOverflowClick}
        aria-label={`${overflowLabel}: ${hiddenCount} more`}
      >
        +{hiddenCount} more
      </button>
    ) : null;

  if (!authorData.length) return null;

  return (
    <MeasuredOverflowRow
      items={authorData}
      maxVisible={maxVisible}
      minVisible={minVisible}
      overflowPlacement="pinned"
      getKey={(author, index) => `${author.name}-${index}`}
      renderItem={renderAuthor}
      renderOverflow={renderOverflow}
      viewportSafe={viewportSafe}
      className={cn('-my-1 flex-nowrap py-1', className)}
    />
  );
};

const AuthorChipCloudComponent: FC<AuthorChipCloudProps> = ({ authors, className }) => {
  const authorData = renderAuthorsBold(authors);

  if (!authorData.length) return null;

  return (
    <div className={cn('flex min-w-0 flex-wrap gap-2', className)} aria-label="Authors">
      {authorData.map((author, index) => (
        <span key={`${author.name}-${index}`} className="inline-flex max-w-full min-w-0">
          {renderAuthorChip(author)}
        </span>
      ))}
    </div>
  );
};

export const AuthorChipList = memo(AuthorChipListComponent, (prevProps, nextProps) => {
  return (
    prevProps.authors === nextProps.authors &&
    prevProps.maxVisible === nextProps.maxVisible &&
    prevProps.minVisible === nextProps.minVisible &&
    prevProps.onOverflowClick === nextProps.onOverflowClick &&
    prevProps.overflowLabel === nextProps.overflowLabel &&
    prevProps.className === nextProps.className &&
    prevProps.viewportSafe === nextProps.viewportSafe
  );
});

export const AuthorChipCloud = memo(AuthorChipCloudComponent, (prevProps, nextProps) => {
  return prevProps.authors === nextProps.authors && prevProps.className === nextProps.className;
});

AuthorList.displayName = 'AuthorList';
AuthorChipList.displayName = 'AuthorChipList';
AuthorChipCloud.displayName = 'AuthorChipCloud';
export default AuthorList;
