import React from 'react';
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
              <span key={t} className="inline-block glass-chip">
                {t}
              </span>
            ))}
          </div>
        ) : null}
        {item.resources?.length ? (
          <div className="mt-2 flex flex-wrap gap-3">
            {item.resources.map((r) => (
              <a
                key={r.href}
                href={r.href}
                {...(r.download ? { download: '' } : {})}
                className="text-sm text-[color:var(--accent)] hover:underline"
                target={r.href.startsWith('http') ? '_blank' : undefined}
                rel={r.href.startsWith('http') ? 'noreferrer' : undefined}
              >
                {r.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default TalkCard;
