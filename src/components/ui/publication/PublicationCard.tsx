import { memo, useEffect, useState, type FC } from 'react';
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
import { cn, createAccentStyle, getAccentColorVar } from '@/lib/utils';

interface PublicationCardProps {
  readonly item: Publication;
  readonly featured?: boolean;
}

const PublicationCardComponent: FC<PublicationCardProps> = ({ item, featured = false }) => {
  const [open, setOpen] = useState(false);
  const detailsId = `pub-details-${encodeURIComponent(item.title).replace(/%/g, '')}`;

  const accent = getAccentColorVar(typeAccentVar(item.type));

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

  const cardStyle = createAccentStyle(accent);
  return (
    <article
      className={cn(
        'aurora-card group publication-card flex cursor-pointer flex-col will-change-transform',
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
      <div className="aurora-card__wrapper" />
      <BlogCardOverlays accent={accent} intensity="subtle" />
      <div className="aurora-card__body flex flex-col gap-3 px-5 py-5 md:gap-4 md:px-6 md:py-6 lg:px-7 lg:py-7">
        <div className="flex min-w-0 flex-col gap-2 overflow-x-hidden sm:flex-row sm:items-start sm:justify-between md:gap-3">
          <div className="min-w-0">
            <h3 className="text-base leading-snug font-semibold md:text-lg">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--card-accent)] hover:underline"
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
            <p className="mt-1 text-[13px] text-[color:var(--white)]/80 md:text-sm">
              <AuthorList authors={item.authors} />
            </p>
            <PublicationMeta item={item} accent={accent} />
          </div>
          {/* Removed first-author badge */}
        </div>

        {item.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {item.tags.map(t => (
              <Badge
                key={t}
                className="text-[11px] md:text-xs"
                variant="outline"
                style={{
                  borderColor: 'color-mix(in oklab, var(--card-accent) 30%, transparent)',
                  color: 'color-mix(in oklab, var(--card-accent) 85%, white)',
                  background: 'color-mix(in oklab, var(--card-accent) 14%, rgba(15,23,42,0.3))',
                }}
              >
                {t}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      {item.url || dedupedArtifacts.length ? (
        <div className="aurora-card__footer flex items-center gap-2 text-[11px] text-white/80 md:gap-3 md:text-xs">
          <PublicationActions
            item={item}
            dedupedArtifacts={dedupedArtifacts}
            accent={accent}
            onStopPropagation={e => e.stopPropagation()}
          />
          <span className="ml-auto inline-flex items-center gap-2 text-[10px] tracking-[0.24em] text-[color:var(--card-accent)]/65 uppercase transition-colors duration-200 group-hover:text-[color:var(--card-accent)] md:text-[11px]">
            More details{` `}
            <span className="aurora-chip aurora-chip--icon inline-flex h-6 w-6 items-center justify-center bg-[color:var(--card-accent)]/15 text-[color:var(--card-accent)] shadow-[0_8px_18px_rgba(15,23,42,0.2)] transition-colors duration-200 group-hover:bg-[color:var(--card-accent)]/25 md:h-7 md:w-7">
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
