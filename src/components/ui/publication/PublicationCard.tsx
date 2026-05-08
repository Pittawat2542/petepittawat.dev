import { memo, useEffect, useState, type FC } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/core/badge';
import AuroraCardShell from '@/components/ui/cards/AuroraCardShell';
import CardVisualPanel from '@/components/ui/cards/CardVisualPanel';
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
  const hasActions = Boolean(item.url || dedupedArtifacts.length);

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
    <AuroraCardShell
      accent={accent}
      featured={featured}
      overlayIntensity="subtle"
      className="publication-card cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={onCardClick}
      onKeyDown={onKeyDown}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={detailsId}
      bodyClassName="flex flex-1 flex-col px-5 py-5 md:px-6 md:py-6 lg:px-7 lg:py-7"
      footer={
        <div className="flex flex-col gap-3 text-[11px] text-white/80 md:text-xs">
          {hasActions ? (
            <PublicationActions
              item={item}
              dedupedArtifacts={dedupedArtifacts}
              accent={accent}
              onStopPropagation={e => e.stopPropagation()}
            />
          ) : null}
          <span className="inline-flex items-center justify-between gap-3 text-[10px] tracking-[0.24em] text-[color:var(--card-accent)]/62 uppercase transition-colors duration-200 group-hover:text-[color:var(--card-accent)] md:text-[11px]">
            <span className="leading-relaxed">
              {hasActions ? 'More details' : 'Abstract, notes, and context'}
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border text-[color:var(--card-accent)] shadow-[0_8px_18px_rgba(15,23,42,0.2)] transition-[transform,border-color,background-color] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
        <CardVisualPanel spec={visualSpec} />

        <div className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.28em] text-white/48 uppercase">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{
              background: 'color-mix(in oklab, var(--card-accent) 72%, white)',
              boxShadow: `0 0 0 6px ${tint(12)}`,
            }}
          />
          Publication
        </div>

        <div className="mt-5 flex flex-1 flex-col gap-5 overflow-x-hidden">
          <div className="min-w-0">
            <h3 className="max-w-[18ch] text-[2rem] leading-[1.03] font-semibold tracking-[-0.045em] text-balance text-[color:var(--card-accent)] md:text-[2.15rem]">
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
            <p className="mt-4 max-w-[34ch] text-[0.98rem] leading-[1.7] text-[color:var(--white)]/76 md:text-[1rem]">
              <AuthorList authors={item.authors} />
            </p>
            <PublicationMeta item={item} accent={accent} />
          </div>

          {item.venue ? (
            <div
              className="rounded-[1.2rem] border px-4 py-4"
              style={{
                borderColor: tint(18),
                background: `linear-gradient(180deg, ${tint(8)}, transparent)`,
              }}
            >
              <p className="text-[10px] font-semibold tracking-[0.24em] text-white/42 uppercase">
                Context
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/78">
                Published in <span className="font-medium text-white/88">{item.venue}</span> as a{' '}
                <span className="font-medium text-white/88">{item.type}</span> contribution in{' '}
                <span className="font-medium text-white/88">{item.year}</span>.
              </p>
            </div>
          ) : null}

          <div className="mt-auto flex flex-col gap-3">
            {item.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {item.tags.map(t => (
                  <Badge
                    key={t}
                    className="rounded-full border px-3 py-1 text-[11px] font-medium md:text-xs"
                    variant="outline"
                    style={{
                      borderColor: 'color-mix(in oklab, var(--card-accent) 20%, transparent)',
                      color: 'color-mix(in oklab, var(--card-accent) 74%, white)',
                      background: 'color-mix(in oklab, var(--card-accent) 8%, rgba(15,23,42,0.3))',
                    }}
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            ) : null}
            <div
              className="h-px w-full"
              style={{
                background: `linear-gradient(90deg, ${tint(32)}, transparent 85%)`,
              }}
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
    </AuroraCardShell>
  );
};

export const PublicationCard = memo(PublicationCardComponent);
PublicationCard.displayName = 'PublicationCard';
export default PublicationCard;
