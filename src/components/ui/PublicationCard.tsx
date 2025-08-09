import React, { useState } from 'react';

export type Artifact = { label: string; href: string };
export type Publication = {
  year: number;
  type: 'journal' | 'conference' | 'preprint' | string;
  title: string;
  authors: string;
  venue: string;
  url: string | null;
  artifacts: Artifact[];
  tags: string[];
  abstract?: string;
};

function highlightMyName(authors: string) {
  // Highlight "Pittawat" and/or "Taveekitworachai" wherever they appear
  const re = /(Pittawat|Taveekitworachai)/gi;
  const parts = authors.split(re);
  return parts.map((part, i) =>
    re.test(part)
      ? (
          <strong key={i} className="text-[color:var(--accent)]">
            {part}
          </strong>
        )
      : (
          <span key={i}>{part}</span>
        )
  );
}

export function PublicationCard({ item }: { item: Publication }) {
  const firstAuthorTitle =
    'The Chronicles of ChatGPT: Generating and Evaluating Visual Novel Narratives on Climate Change Through ChatGPT';

  function isFirstAuthor(authors: string) {
    // Normalize separators and get first name block
    const normalized = authors.replace(/\sand\s/gi, ', ');
    const [first = ''] = normalized.split(',');
    return /pittawat|taveekitworachai/i.test(first);
  }

  const firstAuthor = isFirstAuthor(item.authors);
  const coFirstAuthor = item.title.trim() === firstAuthorTitle;
  const highlight = firstAuthor || coFirstAuthor;
  const badgeLabel = firstAuthor ? 'First author' : coFirstAuthor ? 'Co-first author' : null;
  const [open, setOpen] = useState(false);
  const detailsId = `pub-details-${encodeURIComponent(item.title).replace(/%/g, '')}`;

  return (
    <article className={["glass-card p-4 md:p-5", highlight ? 'first-author' : ''].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-4">
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
          <p className="mt-1 text-sm text-[color:var(--white)]/80">{highlightMyName(item.authors)}</p>
          <p className="mt-1 text-xs md:text-sm text-[color:var(--white)]/60">
            <span className="uppercase tracking-wide mr-2">{item.type}</span>
            <span>• {item.venue}</span>
            <span> • {item.year}</span>
          </p>
          {item.tags?.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <span key={t} className="inline-block glass-chip">
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="shrink-0 text-right flex flex-col items-end gap-2">
          {badgeLabel ? (
            <span className="glass-chip text-[color:var(--accent)] font-semibold">{badgeLabel}</span>
          ) : null}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={detailsId}
            className="rounded-md px-3 py-1.5 text-xs bg-transparent text-[color:var(--white)] hover:bg-[color:var(--white)]/5 ring-1 ring-[color:var(--white)]/10 transition-colors"
          >
            <span className="inline-flex items-center gap-1">
              Details
              <svg className={["h-3 w-3 transition-transform", open ? 'rotate-180' : 'rotate-0'].join(' ')} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
        </div>
      </div>
      {/* Expandable details */}
      <div id={detailsId} className={["collapsible mt-3", open ? 'open' : ''].join(' ')}>
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
                        className="glass-chip hover:text-[color:var(--accent)] transition-transform duration-200 ease-in-out hover:-translate-y-0.5"
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
