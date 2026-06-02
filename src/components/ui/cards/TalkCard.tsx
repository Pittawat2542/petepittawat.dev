import {
  ArrowUpRight,
  Calendar,
  Code2,
  ExternalLink,
  FileText,
  MapPin,
  Users,
  Video,
} from 'lucide-react';
import { memo, useState, type FC, type ReactNode } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';
import '@/styles/components/talk-card.css';
import { cn, getAccentColorVar } from '@/lib/utils';
import { formatDate } from '@/lib';
import type { Talk, TalkResource } from '@/types';
import { resolveCardVisualSpec, toTalkCardVisualInput } from '@/lib/card-visual';
import CardVisualPanel from './CardVisualPanel';
import {
  CardInfoPanel,
  CardMetaChip,
  CardMetaRow,
  CardTagList,
  MeasuredOverflowRow,
} from './CardAtoms';
import CardDetailsDialog from './CardDetailsDialog';
import MediaContentCard from './MediaContentCard';

interface TalkCardProps {
  readonly item: Talk;
  readonly featured?: boolean;
}

function getTalkResourceKind(label: string) {
  if (/^slides?$/i.test(label) || /deck|ppt|pdf/i.test(label)) {
    return 'slides';
  }
  if (/video|talk|youtube|presentation/i.test(label)) {
    return 'video';
  }
  if (/code|repo|github/i.test(label)) {
    return 'code';
  }
  return 'link';
}

interface TalkResourceButtonProps {
  readonly resource: TalkResource;
  readonly tint: (intensity: number) => string;
  readonly onClick?: ((event: ReactMouseEvent<HTMLAnchorElement>) => void) | undefined;
}

const TalkResourceButton: FC<TalkResourceButtonProps> = ({ resource, tint, onClick }) => {
  const isExternal = /^https?:\/\//i.test(resource.href);
  const label = resource.label || '';
  const icon = getTalkResourceKind(label);
  const actionClassName =
    'group/link inline-flex min-w-0 items-center justify-between gap-3 rounded-[1.55rem] border px-4 py-3 text-[color:var(--card-accent)]/88 transition-[transform,border-color,background-color,color,box-shadow] duration-200 hover:-translate-y-0.5 hover:text-[color:var(--card-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--card-accent)]/45';

  return (
    <a
      href={resource.href}
      {...(resource.download ? { download: '' } : {})}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={actionClassName}
      onClick={onClick}
      style={{
        borderColor: tint(48),
        background: `linear-gradient(180deg, ${tint(12)}, ${tint(6)})`,
        boxShadow: `inset 0 1px 0 ${tint(12)}`,
      }}
      aria-label={label}
    >
      <span className="inline-flex min-w-0 items-center gap-2 leading-snug font-medium tracking-[0.01em]">
        {icon === 'slides' ? (
          <FileText
            size={14}
            aria-hidden="true"
            className="icon-bounce text-[color:var(--card-accent)]"
          />
        ) : icon === 'video' ? (
          <Video
            size={14}
            aria-hidden="true"
            className="icon-bounce text-[color:var(--card-accent)]"
          />
        ) : icon === 'code' ? (
          <Code2
            size={14}
            aria-hidden="true"
            className="icon-bounce text-[color:var(--card-accent)]"
          />
        ) : (
          <ExternalLink
            size={14}
            aria-hidden="true"
            className="icon-bounce text-[color:var(--card-accent)]"
          />
        )}
        <span className="min-w-0 truncate whitespace-nowrap">{label}</span>
      </span>
      <span className="shrink-0 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">
        {isExternal ? (
          <ExternalLink
            size={14}
            aria-hidden="true"
            className="icon-bounce text-[color:var(--card-accent)]"
          />
        ) : (
          <ArrowUpRight
            size={14}
            aria-hidden="true"
            className="icon-bounce text-[color:var(--card-accent)]"
          />
        )}
      </span>
    </a>
  );
};

function renderTalkResources(
  resources: readonly TalkResource[],
  tint: (intensity: number) => string,
  onResourceClick?: (event: ReactMouseEvent<HTMLAnchorElement>) => void
) {
  return resources.map(resource => (
    <TalkResourceButton
      key={resource.href}
      resource={resource}
      tint={tint}
      onClick={onResourceClick}
    />
  ));
}

const TalkCardComponent: FC<TalkCardProps> = ({ item, featured = false }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const detailsId = `talk-details-${encodeURIComponent(
    `${item.title}-${formatDate(item.date)}`
  ).replace(/%/g, '')}`;
  const cardViewportRowClassName = featured ? 'max-w-[calc(100vw-5rem)]' : undefined;
  const accent = getAccentColorVar('accent');
  const visualSpec = resolveCardVisualSpec(toTalkCardVisualInput(item));
  const tint = (intensity: number) =>
    `color-mix(in oklab, var(--card-accent) ${intensity}%, transparent)`;
  const resources = item.resources ?? [];
  const hasResources = resources.length > 0;
  const isVirtual =
    item.mode?.toLowerCase().includes('virtual') || item.mode?.toLowerCase().includes('online');
  const modeLabel = item.mode || (isVirtual ? 'Virtual' : 'Live');
  const formattedDate = formatDate(item.date);
  const stopCardClick = (event: ReactMouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };
  const openDetails = () => {
    setDetailsOpen(true);
  };
  const onCardKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDetails();
    }
  };
  const detailSections: { title: string; content: ReactNode }[] = [
    {
      title: 'Event context',
      content: (
        <div className="grid gap-3 sm:grid-cols-3">
          <CardInfoPanel className="px-3 py-3">
            <p className="type-micro font-semibold tracking-[0.24em] text-white/42 uppercase">
              Date
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/78">{formattedDate}</p>
          </CardInfoPanel>
          <CardInfoPanel className="px-3 py-3">
            <p className="type-micro font-semibold tracking-[0.24em] text-white/42 uppercase">
              Mode
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/78">{modeLabel}</p>
          </CardInfoPanel>
          <CardInfoPanel className="px-3 py-3">
            <p className="type-micro font-semibold tracking-[0.24em] text-white/42 uppercase">
              Audience
            </p>
            {item.audienceUrl && item.audience ? (
              <a
                href={item.audienceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex text-sm leading-relaxed text-[color:var(--card-accent)]/88 transition-colors hover:text-[color:var(--card-accent)]"
                onClick={stopCardClick}
              >
                {item.audience}
              </a>
            ) : item.audience ? (
              <p className="mt-2 text-sm leading-relaxed text-white/78">{item.audience}</p>
            ) : (
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Audience details were not attached to this event listing.
              </p>
            )}
          </CardInfoPanel>
        </div>
      ),
    },
    {
      title: 'Tags',
      content: <CardTagList tags={item.tags} />,
    },
  ];

  if (hasResources) {
    detailSections.push({
      title: 'Resources',
      content: (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {renderTalkResources(resources, tint, stopCardClick)}
        </div>
      ),
    });
  }

  return (
    <MediaContentCard
      accent={accent}
      featured={featured}
      className={cn(
        'talk-card h-full cursor-pointer hover:-translate-y-1 hover:border-[color:var(--card-accent)]/30 hover:shadow-[0_38px_78px_-42px_rgba(3,7,18,0.95)] focus-visible:-translate-y-1 focus-visible:border-[color:var(--card-accent)]/38 focus-visible:ring-2 focus-visible:ring-[color:var(--card-accent)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(5,10,20,0.94)] focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0',
        !hasResources && 'talk-card--no-resources'
      )}
      role="button"
      tabIndex={0}
      onClick={openDetails}
      onKeyDown={onCardKeyDown}
      aria-haspopup="dialog"
      aria-expanded={detailsOpen}
      aria-controls={detailsId}
      media={
        <CardVisualPanel
          spec={visualSpec}
          className="mb-0 [aspect-ratio:auto] h-full rounded-none border-0 shadow-none"
        />
      }
      footer={
        hasResources ? (
          <MeasuredOverflowRow
            items={resources}
            maxVisible={2}
            minVisible={1}
            viewportSafe={featured}
            className="media-card__action-row talk-card__actions type-caption text-white/80 md:text-xs"
            itemClassName="media-card__action-item"
            overflowClassName="media-card__action-item media-card__action-item--more"
            getKey={resource => resource.href}
            renderItem={resource => (
              <TalkResourceButton resource={resource} tint={tint} onClick={stopCardClick} />
            )}
            renderOverflow={hiddenResourceCount => (
              <button
                type="button"
                className="group/link inline-flex min-w-0 items-center justify-center gap-2 rounded-[1.55rem] border px-4 py-3 font-bold whitespace-nowrap text-[color:var(--card-accent)] transition-[transform,border-color,background-color,color,box-shadow] duration-200 hover:-translate-y-0.5 hover:text-white focus-visible:ring-2 focus-visible:ring-[color:var(--card-accent)]/55 focus-visible:outline-none"
                style={{
                  borderColor: tint(58),
                  background: `linear-gradient(180deg, ${tint(26)}, ${tint(13)})`,
                  boxShadow: `inset 0 1px 0 ${tint(22)}, 0 14px 28px -22px var(--card-accent)`,
                }}
                onClick={event => {
                  event.stopPropagation();
                  setDetailsOpen(true);
                }}
                aria-label={`Show all resources for ${item.title}`}
              >
                +{hiddenResourceCount} more
              </button>
            )}
          />
        ) : null
      }
    >
      <div className="flex h-full flex-col">
        <CardMetaRow viewportSafe={featured} className={cardViewportRowClassName}>
          <CardMetaChip>Talk</CardMetaChip>
          <CardMetaChip icon={Calendar}>{formattedDate}</CardMetaChip>
          <CardMetaChip icon={isVirtual ? Video : MapPin} title={modeLabel}>
            {modeLabel}
          </CardMetaChip>
        </CardMetaRow>

        <div className="mt-4 flex flex-1 flex-col gap-4">
          <div className={cn('min-w-0 space-y-3', cardViewportRowClassName)}>
            <h3 className="type-featured-card-title md:type-featured-card-title max-w-full leading-[1.05] font-semibold tracking-[-0.045em] text-balance text-white">
              {item.title}
            </h3>
          </div>

          <CardInfoPanel className={cardViewportRowClassName}>
            <div className="flex items-start gap-3">
              <span
                className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full"
                style={{ background: tint(12), color: 'var(--card-accent)' }}
              >
                <Users size={13} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="type-micro font-semibold tracking-[0.24em] text-white/42 uppercase">
                  Audience
                </p>
                {item.audienceUrl && item.audience ? (
                  <a
                    href={item.audienceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex text-sm leading-relaxed text-[color:var(--card-accent)]/88 transition-colors hover:text-[color:var(--card-accent)]"
                    onClick={stopCardClick}
                    data-card-description
                  >
                    {item.audience}
                  </a>
                ) : item.audience ? (
                  <p className="mt-2 text-sm leading-relaxed text-white/78" data-card-description>
                    {item.audience}
                  </p>
                ) : (
                  <p className="mt-2 text-sm leading-relaxed text-white/60" data-card-description>
                    Audience details were not attached to this event listing.
                  </p>
                )}
              </div>
            </div>
          </CardInfoPanel>

          <div className="flex flex-col gap-3">
            <CardTagList
              tags={item.tags}
              maxVisible={featured ? 4 : 3}
              viewportSafe={featured}
              className={cardViewportRowClassName}
              onOverflowClick={() => {
                setDetailsOpen(true);
              }}
              overflowLabel={`Show all tags for ${item.title}`}
            />
          </div>
        </div>
      </div>

      <CardDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        contentId={detailsId}
        accent={accent}
        eyebrow="Talk details"
        title={item.title}
        description="Event context, visible tags, and linked talk resources."
        sections={detailSections}
      />
    </MediaContentCard>
  );
};

export const TalkCard = memo(TalkCardComponent, (prevProps, nextProps) => {
  return prevProps.item === nextProps.item && prevProps.featured === nextProps.featured;
});

TalkCard.displayName = 'TalkCard';
export default TalkCard;
