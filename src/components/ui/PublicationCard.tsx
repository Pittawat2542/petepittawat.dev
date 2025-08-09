import { useState } from 'react';
import { highlightAuthorNames, isFirstAuthor } from '../../lib';
import { FIRST_AUTHOR_TITLE } from '../../lib/constants';
import type { Publication } from '../../types';

export function PublicationCard({ item }: { item: Publication }) {
  const firstAuthor = isFirstAuthor(item.authors);
  const coFirstAuthor = item.title.trim() === FIRST_AUTHOR_TITLE;
  const highlight = firstAuthor || coFirstAuthor;
  const badgeLabel = firstAuthor ? 'First author' : coFirstAuthor ? 'Co-first author' : null;
  const [open, setOpen] = useState(false);
  const detailsId = `pub-details-${encodeURIComponent(item.title).replace(/%/g, '')}`;

  return (
    <article className={[`glass-card p-4 md:p-5`, highlight ? 'first-author' : ''].filter(Boolean).join(' ')}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-base md:text-lg font-semibold leading-snug">
              {item.url ? (
                <a href={item.url} target="_blank" rel="noreferrer" className="text-[color:var(--accent)] hover:underline">
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </h3>
            <p className="mt-1 text-sm text-[color:var(--white)]/80">{highlightAuthorNames(item.authors)}</p>
            <p className="mt-1 text-xs md:text-sm text-[color:var(--white)]/60">
              <span className="uppercase tracking-wide mr-2">{item.type}</span>
              <span>• {item.venue}</span>
              <span> • {item.year}</span>
            </p>
          </div>
          
          {/* First author badge and details button in a better layout */}
          <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-2">
            {badgeLabel && (
              <span className="glass-chip text-[color:var(--accent)] font-semibold text-xs py-1 px-2 whitespace-nowrap shrink-0">
                {badgeLabel}
              </span>
            )}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={detailsId}
              className="rounded-full px-3 py-1.5 text-xs bg-[color:var(--black-nav)]/80 text-[color:var(--white)] ring-1 ring-[color:var(--white)]/10 hover:ring-[color:var(--accent)] hover:text-[color:var(--accent)] transition-all flex items-center gap-1"
            >
              <span>Details</span>
              <svg className={[`h-3 w-3 transition-transform`, open ? 'rotate-180' : 'rotate-0'].join(' ')} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {item.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <span key={t} className="inline-block glass-chip text-xs">
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      
      {/* Expandable details */}
      <div id={detailsId} className={[`collapsible mt-4`, open ? 'open' : ''].join(' ')}>
        <div>
          <div className="rounded-xl ring-1 ring-[color:var(--white)]/10 bg-[color:var(--white)]/5 p-4 md:p-5">
            <div className="grid gap-4 md:grid-cols-5">
              <div className="md:col-span-3">
                <p className="text-sm text-[color:var(--white)]/90 font-medium mb-1">Abstract</p>
                <p className="text-sm text-[color:var(--white)]/80 whitespace-pre-wrap">
                  {item.abstract?.trim() || 'Abstract coming soon.'}
                </p>
              </div>
              {item.artifacts?.length ? (
                <div className="md:col-span-2">
                  <p className="text-sm text-[color:var(--white)]/90 font-medium mb-1">Artifacts</p>
                  <div className="flex flex-wrap gap-2">
                    {item.artifacts.map((a) => (
                      <a
                        key={a.href}
                        href={a.href}
                        target="_blank"
                        rel="noreferrer"
                        className="glass-chip hover:text-[color:var(--accent)] transition-transform duration-200 ease-in-out hover:-translate-y-0.5 text-xs"
                      >
                        {a.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default PublicationCard;
