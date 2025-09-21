// Import extracted components and utilities
import { deduplicateArtifacts, typeAccentVar } from './utils';
import { memo, useEffect, useState } from 'react';

import { ArrowUpRight } from 'lucide-react';
import { AuthorList } from './AuthorList';
import { Badge } from '@/components/ui/core/badge';
import { Card } from '@/components/ui/core/card';
import type { FC } from 'react';
import type { Publication } from '@/types';
import { PublicationActions } from './PublicationActions';
import { PublicationMeta } from './PublicationMeta';
import { PublicationModal } from './PublicationModal';

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

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
    }
  }

  // Use extracted utility function for artifact deduplication
  const dedupedArtifacts = deduplicateArtifacts(item);

  return (
    <Card
      className={[`glass-entry group cursor-pointer publication-card rounded-3xl p-0 flex flex-col`, featured ? 'card-featured' : '']
        .filter(Boolean)
        .join(' ')}
      role="button"
      tabIndex={0}
      onClick={onCardClick}
      onKeyDown={onKeyDown}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={detailsId}
    >
      <div className="glass-entry__glow" />
        <div className="glass-entry__content flex flex-col gap-4 p-6 md:p-7">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 min-w-0 overflow-x-hidden">
          <div className="min-w-0">
            <h3 className="text-base md:text-lg font-semibold leading-snug">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--accent)] hover:underline"
                  onClick={(e) => {
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
            <p className="mt-1 text-sm text-[color:var(--white)]/80"><AuthorList authors={item.authors} /></p>
            <PublicationMeta item={item} accent={accent} />
          </div>
          {/* Removed first-author badge */}
        </div>
        
        {item.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <Badge key={t} className="text-xs" variant="outline">
                {t}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      {(item.url || dedupedArtifacts.length) ? (
        <div className="glass-entry__footer flex items-center gap-3 px-6 py-3.5 md:px-7 md:py-4 text-xs text-white/78">
          <PublicationActions 
            item={item} 
            dedupedArtifacts={dedupedArtifacts} 
            accent={accent} 
            onStopPropagation={(e) => e.stopPropagation()}
          />
          <span className="inline-flex items-center gap-2 ml-auto text-[11px] uppercase tracking-[0.24em] text-white/50 transition-opacity duration-200 group-hover:text-white/70">
            More details{` `}
            <span className="arrow-hint inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.08] text-white/70">
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
    </Card>
  );
};

export const PublicationCard = memo(PublicationCardComponent);
PublicationCard.displayName = 'PublicationCard';
export default PublicationCard;
