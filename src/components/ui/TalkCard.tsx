import { formatDate } from '../../lib';
import type { Talk } from '../../types';

export function TalkCard({ item }: { item: Talk }) {
  return (
    <article className="glass-card p-4 md:p-5">
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
              <span key={t} className="inline-block glass-chip text-xs">
                {t}
              </span>
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
                  {icon === 'slides' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="14" rx="2" />
                      <path d="M8 20h8" />
                    </svg>
                  ) : icon === 'video' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m22 8-6 4 6 4V8Z" />
                      <rect x="2" y="6" width="14" height="12" rx="2" ry="2" />
                    </svg>
                  ) : icon === 'code' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m18 16 4-4-4-4" />
                      <path d="m6 8-4 4 4 4" />
                      <path d="m14.5 4-5 16" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <path d="M15 3h6v6"></path>
                      <path d="M10 14 21 3"></path>
                    </svg>
                  )}
                  <span>{label}</span>
                </a>
              );
            })}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default TalkCard;
