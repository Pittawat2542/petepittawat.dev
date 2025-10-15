import { memo, useEffect, useState, type CSSProperties, type FC } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { BlogCardOverlays } from '@/components/ui/blog/BlogCardOverlays';
import { Badge } from '@/components/ui/core/badge';
import type { Publication } from '@/types';
import { AuthorList } from './AuthorList';
import { PublicationActions } from './PublicationActions';
import { PublicationMeta } from './PublicationMeta';
import { PublicationModal } from './PublicationModal';
import { deduplicateArtifacts, typeAccentVar } from './utils';
import { cn } from '@/lib/utils';

interface PublicationCardProps {
  readonly item: Publication;
  readonly featured?: boolean;
}

const PublicationCardComponent: FC<PublicationCardProps> = ({ item, featured = false }) => {
  const [open, setOpen] = useState(false);
  const detailsId = `pub-details-${encodeURIComponent(item.title).replace(/%/g, '')}`;

  const accent = typeAccentVar(item.type);

  // Authors are now rendered using the extracted utility function

  function onCardClick() {
    setOpen(true);
  }

  // Lock scroll when modal is open and bind Esc to close
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onEsc);
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  function onKeyDown(e: ReactKeyboardEvent<HTMLElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
    }
  }

  // Use extracted utility function for artifact deduplication
  const dedupedArtifacts = deduplicateArtifacts(item);

  const cardStyle = { '--card-accent': accent } as CSSProperties;
  return (
    <article
      className={cn(
        'aurora-card group publication-card flex cursor-pointer flex-col',
        featured && 'aurora-card--featured'
      )}
      role="button"
      tabIndex={0}
      onClick={onCardClick}
      onKeyDown={onKeyDown}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={detailsId}
      style={cardStyle}
    >
      <BlogCardOverlays accent={accent} intensity="subtle" />
      <div className="aurora-card__body flex flex-col gap-4 px-6 py-6 md:px-7 md:py-7">
        <div className="flex min-w-0 flex-col gap-2 overflow-x-hidden sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-base leading-snug font-semibold md:text-lg">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--accent)] hover:underline"
                  onClick={e => {
                    // Prefer expanding details modal on title click
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(true);
                  }}
                >
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </h3>
            <p className="mt-1 text-sm text-[color:var(--white)]/80">
              <AuthorList authors={item.authors} />
            </p>
            <PublicationMeta item={item} accent={accent} />
          </div>
          {/* Removed first-author badge */}
        </div>

        {item.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {item.tags.map(t => (
              <Badge key={t} className="text-xs" variant="outline">
                {t}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      {item.url || dedupedArtifacts.length ? (
        <div className="aurora-card__footer flex items-center gap-3 text-xs text-white/80">
          <PublicationActions
            item={item}
            dedupedArtifacts={dedupedArtifacts}
            accent={accent}
            onStopPropagation={e => e.stopPropagation()}
          />
          <span className="ml-auto inline-flex items-center gap-2 text-[11px] tracking-[0.24em] text-white/50 uppercase transition-opacity duration-200 group-hover:text-white/70">
            More details{` `}
            <span className="aurora-chip aurora-chip--icon inline-flex h-6 w-6 items-center justify-center text-white/80">
              <ArrowUpRight size={13} aria-hidden="true" />
            </span>
          </span>
        </div>
      ) : null}

      {/* Modal with full details */}
      <PublicationModal
        item={item}
        open={open}
        onOpenChange={setOpen}
        accent={accent}
        detailsId={detailsId}
      />
    </article>
  );
};

export const PublicationCard = memo(PublicationCardComponent);
PublicationCard.displayName = 'PublicationCard';
export default PublicationCard;
