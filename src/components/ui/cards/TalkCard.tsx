import { Calendar, Code2, ExternalLink, FileText, MapPin, Users, Video } from 'lucide-react';
import { memo, type FC } from 'react';
import { BlogCardOverlays } from '@/components/ui/blog/BlogCardOverlays';
import { Badge } from '@/components/ui/core/badge';
import { createAccentStyle, getAccentColorVar } from '@/lib/utils';
import { formatDate } from '@/lib';
import type { Talk } from '@/types';

interface TalkCardProps {
  readonly item: Talk;
}

const TalkCardComponent: FC<TalkCardProps> = ({ item }) => {
  const accent = getAccentColorVar('accent-talks');
  const cardStyle = createAccentStyle(accent);
  return (
    <article
      className="aurora-card group talk-card flex h-full flex-col will-change-transform"
      style={cardStyle}
    >
      <div className="aurora-card__wrapper" />
      <BlogCardOverlays accent={accent} />
      <div className="aurora-card__body flex flex-col gap-3 px-5 py-5 md:gap-4 md:px-6 md:py-6 lg:px-7 lg:py-7">
        <div className="flex items-center justify-between gap-2 md:gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[color:var(--white)]/70 md:text-sm">
            <Calendar
              size={14}
              className="icon-bounce text-[color:var(--card-accent)]/70"
              aria-hidden="true"
            />
            <span>{formatDate(item.date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] tracking-wide text-[color:var(--white)]/60 uppercase md:text-xs">
            <div className="flex items-center gap-1">
              {item.mode?.toLowerCase().includes('virtual') ||
              item.mode?.toLowerCase().includes('online') ? (
                <Video
                  size={12}
                  className="icon-bounce text-[color:var(--card-accent)]/60"
                  aria-hidden="true"
                />
              ) : (
                <MapPin
                  size={12}
                  className="icon-bounce text-[color:var(--card-accent)]/60"
                  aria-hidden="true"
                />
              )}
              <span>{item.mode}</span>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <h3 className="flex-1 text-base leading-snug font-semibold md:text-lg lg:text-xl">
            {item.title}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-[color:var(--white)]/80 md:text-sm">
          <Users
            size={14}
            className="icon-bounce text-[color:var(--card-accent)]/70"
            aria-hidden="true"
          />
          {item.audienceUrl ? (
            <a
              href={item.audienceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-glow text-[color:var(--card-accent)] hover:underline"
            >
              {item.audience}
            </a>
          ) : (
            <span>{item.audience}</span>
          )}
        </div>
        {item.tags?.length ? (
          <div className="mt-1 flex flex-wrap gap-2">
            {item.tags.map(t => (
              <Badge
                key={t}
                className="text-[11px] md:text-xs"
                variant="outline"
                style={{
                  borderColor: 'color-mix(in oklab, var(--card-accent) 30%, transparent)',
                  color: 'color-mix(in oklab, var(--card-accent) 82%, white)',
                  background: 'color-mix(in oklab, var(--card-accent) 18%, rgba(15,23,42,0.35))',
                }}
              >
                {t}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
      {item.resources?.length ? (
        <div className="aurora-card__footer flex flex-wrap gap-2 text-[11px] text-white/80 md:text-xs">
          {item.resources.map(r => {
            const isExternal = /^https?:\/\//i.test(r.href);
            const label = r.label || '';
            const icon =
              /^slides?$/i.test(label) || /deck|ppt|pdf/i.test(label)
                ? 'slides'
                : /video|talk|youtube|presentation/i.test(label)
                  ? 'video'
                  : /code|repo|github/i.test(label)
                    ? 'code'
                    : /demo|site|website/i.test(label)
                      ? 'link'
                      : 'link';
            return (
              <a
                key={r.href}
                href={r.href}
                {...(r.download ? { download: '' } : {})}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="aurora-chip aurora-chip--pill text-[color:var(--card-accent)]/85 transition-colors duration-150 hover:text-[color:var(--card-accent)]"
                aria-label={label}
              >
                <span
                  title={
                    icon === 'slides'
                      ? 'Slides'
                      : icon === 'video'
                        ? 'Video'
                        : icon === 'code'
                          ? 'Code'
                          : 'External link'
                  }
                >
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
                </span>
                <span>{label}</span>
              </a>
            );
          })}
        </div>
      ) : null}
    </article>
  );
};

// Memoize the component
export const TalkCard = memo(TalkCardComponent, (prevProps, nextProps) => {
  return prevProps.item === nextProps.item;
});

TalkCard.displayName = 'TalkCard';
export default TalkCard;
