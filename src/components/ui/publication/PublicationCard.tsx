import { memo, useEffect, useState, type FC } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { ArrowUpRight, CalendarDays, FileText } from 'lucide-react';
import { CardInfoPanel, CardMetaChip, CardMetaRow, CardTagList } from '@/components/ui/cards';
import CardVisualPanel from '@/components/ui/cards/CardVisualPanel';
import MediaContentCard from '@/components/ui/cards/MediaContentCard';
import '@/styles/components/publication-card.css';
import type { Publication } from '@/types';
import { AuthorChipList } from './AuthorList';
import { PublicationActions } from './PublicationActions';
import { PublicationModal } from './PublicationModal';
import { deduplicateArtifacts, toTitleCase, typeAccentVar } from './utils';
import { getAccentColorVar } from '@/lib/utils';
import { resolveCardVisualSpec, toPublicationCardVisualInput } from '@/lib/card-visual';

interface PublicationCardProps {
  readonly item: Publication;
  readonly featured?: boolean;
}

const PublicationCardComponent: FC<PublicationCardProps> = ({ item, featured = false }) => {
  const [open, setOpen] = useState(false);
  const detailsId = `pub-details-${encodeURIComponent(item.title).replace(/%/g, '')}`;
  const cardViewportRowClassName = featured ? 'max-w-[calc(100vw-5rem)]' : undefined;

  const accent = getAccentColorVar(typeAccentVar(item.type));
  const visualSpec = resolveCardVisualSpec(toPublicationCardVisualInput(item));
  const tint = (intensity: number) =>
    `color-mix(in oklab, var(--card-accent) ${intensity}%, transparent)`;
  const dedupedArtifacts = deduplicateArtifacts(item);
  const hasActions = Boolean(item.url) || dedupedArtifacts.length > 0;

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
              maxVisible={2}
              viewportSafe={featured}
              onOverflowClick={() => {
                setOpen(true);
              }}
              onStopPropagation={e => {
                e.stopPropagation();
              }}
            />
          ) : (
            <button
              type="button"
              className="group/details inline-flex min-h-13 w-full min-w-0 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold text-[color:var(--card-accent)] transition-[transform,border-color,background-color,color,box-shadow] duration-200 hover:-translate-y-0.5 hover:text-white focus-visible:ring-2 focus-visible:ring-[color:var(--card-accent)]/45 focus-visible:outline-none"
              style={{
                borderColor: tint(32),
                background: `linear-gradient(180deg, ${tint(12)}, ${tint(5)})`,
                boxShadow: `inset 0 1px 0 ${tint(12)}`,
              }}
              onClick={event => {
                event.stopPropagation();
                setOpen(true);
              }}
              aria-label={`Open details for ${item.title}`}
            >
              <span className="min-w-0 truncate">View details</span>
              <span
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[color:var(--card-accent)] transition-[transform,border-color,background-color,color] duration-200 group-hover/details:translate-x-0.5 group-hover/details:-translate-y-0.5 group-hover/details:text-white"
                style={{
                  borderColor: tint(34),
                  background: tint(10),
                }}
              >
                <ArrowUpRight size={13} aria-hidden="true" />
              </span>
            </button>
          )}
        </div>
      }
    >
      <div className="flex h-full flex-col">
        <CardMetaRow viewportSafe={featured} className={cardViewportRowClassName}>
          <CardMetaChip icon={FileText}>Publication</CardMetaChip>
          {item.type ? (
            <CardMetaChip title={item.type}>{toTitleCase(item.type)}</CardMetaChip>
          ) : null}
          <CardMetaChip icon={CalendarDays}>{item.year}</CardMetaChip>
        </CardMetaRow>

        <div className="mt-4 flex flex-1 flex-col gap-4">
          <div className={`min-w-0 space-y-3 ${cardViewportRowClassName ?? ''}`.trim()}>
            <h3 className="type-featured-card-title md:type-featured-card-title max-w-full leading-[1.03] font-semibold tracking-[-0.045em] text-balance text-white">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-inherit transition-colors hover:text-[color:var(--card-accent)]"
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
            <AuthorChipList
              authors={item.authors}
              maxVisible={3}
              viewportSafe={featured}
              className={cardViewportRowClassName}
              onOverflowClick={() => {
                setOpen(true);
              }}
              overflowLabel={`Show all authors for ${item.title}`}
            />
          </div>

          {item.venue ? (
            <CardInfoPanel className={cardViewportRowClassName}>
              <p className="type-micro font-semibold tracking-[0.24em] text-white/42 uppercase">
                Venue
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/78" title={item.venue}>
                Published in <span className="font-medium text-white/88">{item.venue}</span>.
              </p>
            </CardInfoPanel>
          ) : null}

          <div className="flex flex-col gap-3">
            <CardTagList
              tags={item.tags}
              maxVisible={featured ? 4 : 3}
              viewportSafe={featured}
              className={cardViewportRowClassName}
              onOverflowClick={() => {
                setOpen(true);
              }}
              overflowLabel={`Show all tags for ${item.title}`}
            />
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
