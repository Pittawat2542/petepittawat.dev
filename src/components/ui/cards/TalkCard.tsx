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
import { Badge } from '@/components/ui/core/badge';
import AuroraCardShell from './AuroraCardShell';
import { getAccentColorVar } from '@/lib/utils';
import { formatDate } from '@/lib';
import type { Talk } from '@/types';
import { resolveCardVisualSpec, toTalkCardVisualInput } from '@/lib/card-visual';
import CardVisualPanel from './CardVisualPanel';

interface TalkCardProps {
  readonly item: Talk;
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

const TalkCardComponent: FC<TalkCardProps> = ({ item }) => {
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
    <AuroraCardShell
      accent={accent}
      className="talk-card h-full"
      bodyClassName="flex flex-1 flex-col px-5 py-5 md:px-6 md:py-6 lg:px-7 lg:py-7"
      footer={
        hasResources ? (
          <div className="grid w-full [grid-template-columns:repeat(auto-fit,minmax(11.5rem,1fr))] gap-2.5 text-[11px] text-white/80 md:text-xs">
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
          <div
            className="rounded-[1.3rem] border px-4 py-3"
            style={{
              borderColor: tint(18),
              background: `linear-gradient(180deg, ${tint(8)}, transparent)`,
            }}
          >
            <p className="text-[10px] font-semibold tracking-[0.24em] text-white/42 uppercase">
              Session archive
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              No public resources are linked for this talk.
            </p>
          </div>
        )
      }
    >
      <div className="flex h-full flex-col">
        <CardVisualPanel spec={visualSpec} />

        <div className="flex items-start justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.28em] text-white/48 uppercase">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{
                background: 'color-mix(in oklab, var(--card-accent) 72%, white)',
                boxShadow: `0 0 0 6px ${tint(12)}`,
              }}
            />
            Talk
          </div>
          <div
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-medium tracking-[0.2em] text-[color:var(--card-accent)]/70 uppercase md:text-[11px]"
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
            <div className="flex items-center gap-2 text-sm text-[color:var(--white)]/68 md:text-[0.95rem]">
              <Calendar
                size={15}
                className="icon-bounce text-[color:var(--card-accent)]/70"
                aria-hidden="true"
              />
              <span>{formatDate(item.date)}</span>
            </div>
            <h3 className="max-w-[17ch] text-[2rem] leading-[1.05] font-semibold tracking-[-0.045em] text-balance text-white md:text-[2.15rem]">
              {item.title}
            </h3>
          </div>

          <div
            className="rounded-[1.2rem] border px-4 py-4"
            style={{
              borderColor: tint(18),
              background: `linear-gradient(180deg, ${tint(8)}, transparent)`,
            }}
          >
            <div className="flex items-start gap-3">
              <span
                className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full"
                style={{ background: tint(12), color: 'var(--card-accent)' }}
              >
                <Users size={13} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold tracking-[0.24em] text-white/42 uppercase">
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
          </div>

          <div className={`${hasResources ? 'mt-auto' : 'mt-6'} flex flex-col gap-3`}>
            {item.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <Badge
                    key={tag}
                    className="rounded-full border px-3 py-1 text-[11px] font-medium md:text-xs"
                    variant="outline"
                    style={{
                      borderColor: 'color-mix(in oklab, var(--card-accent) 20%, transparent)',
                      color: 'color-mix(in oklab, var(--card-accent) 74%, white)',
                      background: 'color-mix(in oklab, var(--card-accent) 8%, rgba(15,23,42,0.35))',
                    }}
                  >
                    {tag}
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
    </AuroraCardShell>
  );
};

export const TalkCard = memo(TalkCardComponent, (prevProps, nextProps) => {
  return prevProps.item === nextProps.item;
});

TalkCard.displayName = 'TalkCard';
export default TalkCard;
