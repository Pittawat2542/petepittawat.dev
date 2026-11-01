import { memo, type FC } from 'react';
import { ArrowUpRight, CalendarDays, FileText } from 'lucide-react';
import { CardInfoPanel, CardMetaChip, CardMetaRow, CardTagList } from '@/components/ui/cards';
import CardVisualPanel from '@/components/ui/cards/CardVisualPanel';
import MediaContentCard from '@/components/ui/cards/MediaContentCard';
import '@/styles/components/publication-card.css';
import type { Publication } from '@/types';
import { AuthorChipList } from './AuthorList';
import { PublicationActions } from './PublicationActions';
import { PublicationDetailsTemplate } from './PublicationDetailsTemplate';
import { deduplicateArtifacts, toTitleCase, typeAccentVar } from './utils';
import { getAccentColorVar } from '@/lib/utils';
import { resolveCardVisualSpec, toPublicationCardVisualInput } from '@/lib/card-visual';

interface PublicationCardProps {
  readonly item: Publication;
  readonly featured?: boolean;
}

const PublicationCardComponent: FC<PublicationCardProps> = ({ item, featured = false }) => {
  const cardViewportRowClassName = featured ? 'max-w-[calc(100vw-5rem)]' : undefined;

  const accent = getAccentColorVar(typeAccentVar(item.type));
  const visualSpec = resolveCardVisualSpec(toPublicationCardVisualInput(item));
  const tint = (intensity: number) =>
    `color-mix(in oklab, var(--card-accent) ${intensity}%, transparent)`;
  const dedupedArtifacts = deduplicateArtifacts(item);
  const hasActions = Boolean(item.url) || dedupedArtifacts.length > 0;

  return (
    <MediaContentCard
      accent={accent}
      featured={featured}
      overlayIntensity="subtle"
      className="publication-card cursor-pointer hover:border-[color:var(--card-accent)]/30 focus-visible:border-[color:var(--card-accent)]/38 focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(5,10,20,0.94)] focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0"
      role="button"
      tabIndex={0}
      data-details-trigger
      aria-haspopup="dialog"
      aria-expanded={false}
      media={
        <CardVisualPanel
          spec={visualSpec}
          priority={featured}
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
              detailsTrigger
            />
          ) : (
            <button
              type="button"
              className="group/details inline-flex min-h-13 w-full min-w-0 items-center justify-between gap-3 rounded-[var(--radius-control)] border px-4 py-3 text-left text-sm font-semibold text-[color:var(--card-accent)] transition-[transform,border-color,background-color,color,box-shadow] duration-200 hover:text-white focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-primary)] focus-visible:outline-none"
              style={{
                borderColor: tint(32),
                background: 'var(--color-surface)',
              }}
              data-details-trigger
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
                  data-details-trigger
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-inherit transition-colors hover:text-[color:var(--card-accent)]"
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
              detailsTrigger
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
              maxVisible={3}
              featuredMaxVisible={4}
              featured={featured}
              viewportSafe={featured}
              className={cardViewportRowClassName}
              detailsTrigger
              overflowLabel={`Show all tags for ${item.title}`}
            />
          </div>
        </div>
      </div>

      {/* Modal with full details */}
      <PublicationDetailsTemplate item={item} accent={accent} />
    </MediaContentCard>
  );
};

export const PublicationCard = memo(PublicationCardComponent);
PublicationCard.displayName = 'PublicationCard';
export default PublicationCard;
