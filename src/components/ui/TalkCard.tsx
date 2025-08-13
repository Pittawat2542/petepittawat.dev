import { formatDate } from '../../lib';
import type { Talk } from '../../types';
import { Card } from './card';
import { Badge } from './badge';
import { FileText, Video, Code2, ExternalLink } from 'lucide-react';

export function TalkCard({ item }: { item: Talk }) {
  return (
    <Card className="p-4 md:p-5 hover-card">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[color:var(--white)]/70">{formatDate(item.date)}</span>
          <span className="text-xs uppercase tracking-wide text-[color:var(--white)]/60">{item.mode}</span>
        </div>
        <h3 className="text-base md:text-lg font-semibold leading-snug">{item.title}</h3>
        <p className="text-sm text-[color:var(--white)]/80">
          {item.audienceUrl ? (
            <a href={item.audienceUrl} target="_blank" rel="noreferrer" className="text-[color:var(--accent)] hover:underline">
              {item.audience}
            </a>
          ) : (
            item.audience
          )}
        </p>
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
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2"
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
                <FileText size={14} aria-hidden="true" />
              ) : icon === 'video' ? (
                <Video size={14} aria-hidden="true" />
              ) : icon === 'code' ? (
                <Code2 size={14} aria-hidden="true" />
              ) : (
                <ExternalLink size={14} aria-hidden="true" />
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
