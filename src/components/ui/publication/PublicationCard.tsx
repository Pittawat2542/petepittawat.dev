import { memo, useEffect, useState, type FC } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CardDivider, CardInfoPanel, CardKicker, CardTagList } from '@/components/ui/cards';
import CardVisualPanel from '@/components/ui/cards/CardVisualPanel';
import MediaContentCard from '@/components/ui/cards/MediaContentCard';
import type { Publication } from '@/types';
import { AuthorList } from './AuthorList';
import { PublicationActions } from './PublicationActions';
import { PublicationMeta } from './PublicationMeta';
import { PublicationModal } from './PublicationModal';
import { deduplicateArtifacts, typeAccentVar } from './utils';
import { getAccentColorVar } from '@/lib/utils';
import { resolveCardVisualSpec, toPublicationCardVisualInput } from '@/lib/card-visual';

interface PublicationCardProps {
  readonly item: Publication;
  readonly featured?: boolean;
}

const PublicationCardComponent: FC<PublicationCardProps> = ({ item, featured = false }) => {
  const [open, setOpen] = useState(false);
  const detailsId = `pub-details-${encodeURIComponent(item.title).replace(/%/g, '')}`;

  const accent = getAccentColorVar(typeAccentVar(item.type));
  const visualSpec = resolveCardVisualSpec(toPublicationCardVisualInput(item));
  const tint = (intensity: number) =>
    `color-mix(in oklab, var(--card-accent) ${intensity}%, transparent)`;
  const dedupedArtifacts = deduplicateArtifacts(item);
  const hasActions = Boolean(item.url) || dedupedArtifacts.length > 0;

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

  return (
    <MediaContentCard
      accent={accent}
      featured={featured}
      overlayIntensity="subtle"
      className="publication-card cursor-pointer hover:-translate-y-1 hover:border-[color:var(--card-accent)]/30 hover:shadow-[0_38px_78px_-42px_rgba(3,7,18,0.95)] focus-visible:-translate-y-1 focus-visible:border-[color:var(--card-accent)]/38 focus-visible:ring-2 focus-visible:ring-[color:var(--card-accent)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(5,10,20,0.94)] focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0"
      role="button"
      tabIndex={0}
      onClick={onCardClick}
      onKeyDown={onKeyDown}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={detailsId}
      media={
        <CardVisualPanel
          spec={visualSpec}
          className="mb-0 [aspect-ratio:auto] h-full rounded-none border-0 shadow-none"
        />
      }
      footer={
        <div className="type-caption flex flex-col gap-3 text-white/80 md:text-xs">
          {hasActions ? (
            <PublicationActions
              item={item}
              dedupedArtifacts={dedupedArtifacts}
              accent={accent}
              onStopPropagation={e => {
                e.stopPropagation();
              }}
            />
          ) : null}
          <span className="type-micro md:type-caption inline-flex items-center justify-between gap-3 tracking-[0.24em] text-[color:var(--card-accent)]/62 uppercase transition-colors duration-[var(--motion-duration-slow)] ease-[var(--motion-ease-decelerate)] group-hover:text-[color:var(--card-accent)]">
            <span className="leading-relaxed">
              {hasActions ? 'More details' : 'Abstract, notes, and context'}
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border text-[color:var(--card-accent)] shadow-[0_8px_18px_rgba(15,23,42,0.2)] transition-[transform,border-color,background-color] duration-[var(--motion-duration-slow)] ease-[var(--motion-ease-decelerate)] will-change-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{
                  borderColor: tint(40),
                  background: `linear-gradient(180deg, ${tint(14)}, ${tint(8)})`,
                }}
              >
                <ArrowUpRight size={13} aria-hidden="true" />
              </span>
            </span>
          </span>
        </div>
      }
    >
      <div className="flex h-full flex-col">
        <CardKicker label="Publication" />

        <div className="mt-5 flex flex-1 flex-col gap-5 overflow-x-hidden">
          <div className="min-w-0">
            <h3 className="type-featured-card-title md:type-featured-card-title max-w-[18ch] leading-[1.03] font-semibold tracking-[-0.045em] text-balance text-[color:var(--card-accent)]">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[color:var(--card-accent)]"
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
            <p className="mt-4 max-w-[34ch] text-base leading-[1.7] text-[color:var(--white)]/76 md:text-base">
              <AuthorList authors={item.authors} />
            </p>
            <PublicationMeta item={item} accent={accent} />
          </div>

          {item.venue ? (
            <CardInfoPanel>
              <p className="type-micro font-semibold tracking-[0.24em] text-white/42 uppercase">
                Context
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/78">
                Published in <span className="font-medium text-white/88">{item.venue}</span> as a{' '}
                <span className="font-medium text-white/88">{item.type}</span> contribution in{' '}
                <span className="font-medium text-white/88">{item.year}</span>.
              </p>
            </CardInfoPanel>
          ) : null}

          <div className="mt-auto flex flex-col gap-3">
            <CardTagList tags={item.tags} />
            <CardDivider />
          </div>
        </div>
      </div>

      {/* Modal with full details */}
      <PublicationModal
        item={item}
        open={open}
        onOpenChange={setOpen}
        accent={accent}
        detailsId={detailsId}
      />
    </MediaContentCard>
  );
};

export const PublicationCard = memo(PublicationCardComponent);
PublicationCard.displayName = 'PublicationCard';
export default PublicationCard;
