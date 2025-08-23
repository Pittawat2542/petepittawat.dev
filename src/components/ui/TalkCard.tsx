import { Calendar, Code2, ExternalLink, FileText, MapPin, Users, Video } from 'lucide-react';

import { Badge } from './badge';
import { Card } from './card';
import type { Talk } from '../../types';
import { formatDate } from '../../lib';

export function TalkCard({ item }: { item: Talk }) {
  return (
    <Card className="p-4 md:p-5 card-subtle-lift">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-sm text-[color:var(--white)]/70">
            <Calendar size={14} className="text-[color:var(--accent)]/70 icon-bounce" aria-hidden="true" />
            <span>{formatDate(item.date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[color:var(--white)]/60">
            <div className="flex items-center gap-1">
              {item.mode?.toLowerCase().includes('virtual') || item.mode?.toLowerCase().includes('online') ? (
                <Video size={12} className="text-[color:var(--accent)]/60 icon-bounce" aria-hidden="true" />
              ) : (
                <MapPin size={12} className="text-[color:var(--accent)]/60 icon-bounce" aria-hidden="true" />
              )}
              <span>{item.mode}</span>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <h3 className="text-base md:text-lg font-semibold leading-snug flex-1">{item.title}</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-[color:var(--white)]/80">
          <Users size={14} className="text-[color:var(--accent)]/70 icon-bounce" aria-hidden="true" />
          {item.audienceUrl ? (
            <a href={item.audienceUrl} target="_blank" rel="noreferrer" className="text-[color:var(--accent)] hover:underline link-glow">
              {item.audience}
            </a>
          ) : (
            <span>{item.audience}</span>
          )}
        </div>
        {item.tags?.length ? (
          <div className="mt-1 flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <Badge key={t} className="text-xs" variant="outline">{t}</Badge>
            ))}
          </div>
        ) : null}
        {item.resources?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {item.resources.map((r) => {
              const accent = 'var(--accent-talks)';
              const isExternal = /^https?:\/\//i.test(r.href);
              const label = r.label || '';
              const icon = (/^slides?$/i.test(label) || /deck|ppt|pdf/i.test(label)) ? 'slides'
                : (/video|talk|youtube|presentation/i.test(label) ? 'video'
                : (/code|repo|github/i.test(label) ? 'code'
                : (/demo|site|website/i.test(label) ? 'link' : 'link')));
              return (
                <a
                  key={r.href}
                  href={r.href}
                  {...(r.download ? { download: '' } : {})}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noreferrer' : undefined}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-[background-color,color,border-color,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 btn-ripple will-change-transform hover:-translate-y-0.5"
                  style={{
                    color: accent,
                    background: `color-mix(in oklab, ${accent} 14%, transparent)`,
                    border: `1px solid color-mix(in oklab, ${accent} 45%, transparent)`,
                    boxShadow: `0 6px 18px -10px ${accent}`
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = `color-mix(in oklab, ${accent} 22%, transparent)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = `color-mix(in oklab, ${accent} 14%, transparent)`;
                  }}
                  aria-label={label}
                >
              <span title={
                icon === 'slides' ? "Slides" :
                icon === 'video' ? "Video" :
                icon === 'code' ? "Code" :
                "External link"
              }>
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
      </div>
    </Card>
  );
}

export default TalkCard;
