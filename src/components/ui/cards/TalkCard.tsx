import { Calendar, Code2, ExternalLink, FileText, MapPin, Users, Video } from 'lucide-react';

import { Badge } from '@/components/ui/core/badge';
import type { CSSProperties, FC } from 'react';
import type { Talk } from '@/types';
import { formatDate } from '@/lib';
import { memo } from 'react';
import { BlogCardOverlays } from '@/components/ui/blog/BlogCardOverlays';

interface TalkCardProps {
  readonly item: Talk;
}

const TalkCardComponent: FC<TalkCardProps> = ({ item }) => {
  const accent = 'var(--accent-talks)';
  const cardStyle = { '--card-accent': accent } as CSSProperties;
  return (
    <article className="aurora-card group talk-card flex h-full flex-col" style={cardStyle}>
      <BlogCardOverlays accent={accent} />
      <div className="aurora-card__body flex flex-col gap-3 px-5 py-5 md:px-6 md:py-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-sm text-[color:var(--white)]/70">
            <Calendar
              size={14}
              className="icon-bounce text-[color:var(--accent)]/70"
              aria-hidden="true"
            />
            <span>{formatDate(item.date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs tracking-wide text-[color:var(--white)]/60 uppercase">
            <div className="flex items-center gap-1">
              {item.mode?.toLowerCase().includes('virtual') ||
              item.mode?.toLowerCase().includes('online') ? (
                <Video
                  size={12}
                  className="icon-bounce text-[color:var(--accent)]/60"
                  aria-hidden="true"
                />
              ) : (
                <MapPin
                  size={12}
                  className="icon-bounce text-[color:var(--accent)]/60"
                  aria-hidden="true"
                />
              )}
              <span>{item.mode}</span>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <h3 className="flex-1 text-base leading-snug font-semibold md:text-lg">{item.title}</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-[color:var(--white)]/80">
          <Users
            size={14}
            className="icon-bounce text-[color:var(--accent)]/70"
            aria-hidden="true"
          />
          {item.audienceUrl ? (
            <a
              href={item.audienceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-glow text-[color:var(--accent)] hover:underline"
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
              <Badge key={t} className="text-xs" variant="outline">
                {t}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
      {item.resources?.length ? (
        <div className="aurora-card__footer flex flex-wrap gap-2 text-xs text-white/80">
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
                className="aurora-chip aurora-chip--pill"
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
                    <FileText size={14} aria-hidden="true" className="icon-bounce" />
                  ) : icon === 'video' ? (
                    <Video size={14} aria-hidden="true" className="icon-bounce" />
                  ) : icon === 'code' ? (
                    <Code2 size={14} aria-hidden="true" className="icon-bounce" />
                  ) : (
                    <ExternalLink size={14} aria-hidden="true" className="icon-bounce" />
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
