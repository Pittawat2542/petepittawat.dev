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
import { memo, type FC } from 'react';
import { getAccentColorVar } from '@/lib/utils';
import { formatDate } from '@/lib';
import type { Talk } from '@/types';
import { resolveCardVisualSpec, toTalkCardVisualInput } from '@/lib/card-visual';
import CardVisualPanel from './CardVisualPanel';
import { CardDivider, CardInfoPanel, CardKicker, CardTagList } from './CardAtoms';
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

const TalkCardComponent: FC<TalkCardProps> = ({ item, featured = false }) => {
  const accent = getAccentColorVar('accent');
  const visualSpec = resolveCardVisualSpec(toTalkCardVisualInput(item));
  const tint = (intensity: number) =>
    `color-mix(in oklab, var(--card-accent) ${intensity}%, transparent)`;
  const resources = item.resources ?? [];
  const hasResources = resources.length > 0;
  const isVirtual =
    item.mode?.toLowerCase().includes('virtual') || item.mode?.toLowerCase().includes('online');
  const modeLabel = item.mode || (isVirtual ? 'Virtual' : 'Live');
  const actionClassName =
    'group/link inline-flex min-w-0 items-start justify-between gap-3 rounded-[1.55rem] border px-4 py-3 text-[color:var(--card-accent)]/88 transition-[transform,border-color,background-color,color,box-shadow] duration-200 hover:-translate-y-0.5 hover:text-[color:var(--card-accent)]';

  return (
    <MediaContentCard
      accent={accent}
      featured={featured}
      className="talk-card h-full"
      media={
        <CardVisualPanel
          spec={visualSpec}
          className="mb-0 [aspect-ratio:auto] h-full rounded-none border-0 shadow-none"
        />
      }
      footer={
        hasResources ? (
          <div className="type-caption grid w-full [grid-template-columns:repeat(auto-fit,minmax(11.5rem,1fr))] gap-2.5 text-white/80 md:text-xs">
            {resources.map(resource => {
              const isExternal = /^https?:\/\//i.test(resource.href);
              const label = resource.label || '';
              const icon = getTalkResourceKind(label);

              return (
                <a
                  key={resource.href}
                  href={resource.href}
                  {...(resource.download ? { download: '' } : {})}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className={actionClassName}
                  style={{
                    borderColor: tint(48),
                    background: `linear-gradient(180deg, ${tint(12)}, ${tint(6)})`,
                    boxShadow: `inset 0 1px 0 ${tint(12)}`,
                  }}
                  aria-label={label}
                >
                  <span className="inline-flex min-w-0 items-start gap-2 leading-snug font-medium tracking-[0.01em]">
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
                    <span className="min-w-0 break-words">{label}</span>
                  </span>
                  <span className="mt-0.5 shrink-0 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">
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
            })}
          </div>
        ) : (
          <CardInfoPanel className="rounded-[1.3rem] py-3">
            <p className="type-micro font-semibold tracking-[0.24em] text-white/42 uppercase">
              Session archive
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              No public resources are linked for this talk.
            </p>
          </CardInfoPanel>
        )
      }
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <CardKicker label="Talk" />
          <div
            className="type-micro md:type-caption inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium tracking-[0.2em] text-[color:var(--card-accent)]/70 uppercase"
            style={{
              borderColor: tint(36),
              background: `linear-gradient(180deg, ${tint(10)}, ${tint(6)})`,
            }}
          >
            {isVirtual ? (
              <Video
                size={12}
                className="icon-bounce text-[color:var(--card-accent)]/68"
                aria-hidden="true"
              />
            ) : (
              <MapPin
                size={12}
                className="icon-bounce text-[color:var(--card-accent)]/68"
                aria-hidden="true"
              />
            )}
            <span>{modeLabel}</span>
          </div>
        </div>

        <div className="mt-5 flex flex-1 flex-col gap-5">
          <div className="space-y-3">
            <div className="md:type-body-sm flex items-center gap-2 text-sm text-[color:var(--white)]/68">
              <Calendar
                size={15}
                className="icon-bounce text-[color:var(--card-accent)]/70"
                aria-hidden="true"
              />
              <span>{formatDate(item.date)}</span>
            </div>
            <h3 className="type-featured-card-title md:type-featured-card-title max-w-[17ch] leading-[1.05] font-semibold tracking-[-0.045em] text-balance text-white">
              {item.title}
            </h3>
          </div>

          <CardInfoPanel>
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
              </div>
            </div>
          </CardInfoPanel>

          <div className={`${hasResources ? 'mt-auto' : 'mt-6'} flex flex-col gap-3`}>
            <CardTagList tags={item.tags} />
            <CardDivider />
          </div>
        </div>
      </div>
    </MediaContentCard>
  );
};

export const TalkCard = memo(TalkCardComponent, (prevProps, nextProps) => {
  return prevProps.item === nextProps.item && prevProps.featured === nextProps.featured;
});

TalkCard.displayName = 'TalkCard';
export default TalkCard;
