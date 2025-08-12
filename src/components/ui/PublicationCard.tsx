import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { highlightAuthorNames, isFirstAuthor } from '../../lib';
import { FIRST_AUTHOR_TITLE } from '../../lib/constants';
import type { Publication } from '../../types';

function toTitleCase(input?: string) {
  if (!input) return '';
  return input.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));
}

function typeAccentVar(type?: string) {
  const key = (type ?? '').toLowerCase();
  switch (key) {
    case 'journal':
      return 'var(--accent-publications)';
    case 'conference':
      return 'var(--accent-talks)';
    case 'workshop':
      return 'var(--accent-projects)';
    case 'preprint':
    case 'arxiv':
      return 'var(--accent-research)';
    case 'poster':
      return 'var(--accent-about)';
    case 'demo':
      return 'var(--accent-2)';
    default:
      return 'var(--accent-publications)';
  }
}

export function PublicationCard({ item, featured = false }: { item: Publication; featured?: boolean }) {
  const firstAuthor = isFirstAuthor(item.authors);
  const coFirstAuthor = item.title.trim() === FIRST_AUTHOR_TITLE;
  const highlight = firstAuthor || coFirstAuthor;
  const badgeLabel = firstAuthor ? 'First author' : coFirstAuthor ? 'Co-first author' : null;
  const [open, setOpen] = useState(false);
  const detailsId = `pub-details-${encodeURIComponent(item.title).replace(/%/g, '')}`;

  const accent = typeAccentVar(item.type);

  function onCardClick(e: React.MouseEvent) {
    // Ignore clicks on links or buttons inside the card
    const target = e.target as HTMLElement;
    if (target.closest('a, button')) return;
    setOpen(true);
  }
  
  // Lock scroll when modal is open and bind Esc to close
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onEsc);
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
    }
  }

  return (
    <article
      className={[`glass-card p-4 md:p-5 cursor-pointer`, highlight ? 'first-author' : '', featured ? 'card-featured' : ''].filter(Boolean).join(' ')}
      role="button"
      tabIndex={0}
      onClick={onCardClick}
      onKeyDown={onKeyDown}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={detailsId}
    >
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
            <p className="mt-1 text-xs md:text-sm text-[color:var(--white)]/60 flex items-center gap-2 flex-wrap">
              {item.type ? (
                <span
                  className="glass-chip text-xs whitespace-nowrap"
                  style={{
                    color: typeAccentVar(item.type),
                    borderColor: `color-mix(in oklab, ${typeAccentVar(item.type)} 55%, transparent)`,
                    background: `color-mix(in oklab, ${typeAccentVar(item.type)} 12%, transparent)`
                  }}
                  title={item.type}
                >
                  {toTitleCase(item.type)}
                </span>
              ) : null}
              <span className="whitespace-nowrap">• {item.venue}</span>
              <span className="whitespace-nowrap">• {item.year}</span>
            </p>
          </div>
          {/* First author badge */}
          <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-2">
            {badgeLabel && (
              <span className="glass-chip text-[color:var(--accent)] font-semibold text-xs py-1 px-2 whitespace-nowrap shrink-0">
                {badgeLabel}
              </span>
            )}
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

        {/* Resource links (always visible) */}
        {(item.url || item.artifacts?.length) ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
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
                onClick={(e) => e.stopPropagation()}
                aria-label="Open paper"
              >
                <span>Paper</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <path d="M15 3h6v6"></path>
                  <path d="M10 14 21 3"></path>
                </svg>
              </a>
            ) : null}
            {item.artifacts?.map((a) => {
              const isExternal = !a.href.startsWith('/');
              return (
                <a
                  key={a.href}
                  href={a.href}
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
                  onClick={(e) => e.stopPropagation()}
                  aria-label={a.label}
                >
                  <span>{a.label}</span>
                  {isExternal ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <path d="M15 3h6v6"></path>
                      <path d="M10 14 21 3"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9 18v-6h6"></path>
                      <path d="M21 21 14 14"></path>
                      <path d="M3 3h7v7H3z"></path>
                    </svg>
                  )}
                </a>
              );
            })}
          </div>
        ) : null}
      </div>
      
      {/* Modal with full details (rendered in a portal to avoid stacking/containment issues) */}
      {open
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={detailsId}
              className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
              <div className="relative z-[1010] w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
                <div
                  className="glass-card modal-card p-5 md:p-6"
                  style={{
                    backgroundColor: 'color-mix(in oklab, var(--black) 84%, transparent)'
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 id={detailsId} className="text-lg md:text-xl font-semibold leading-snug">
                      {item.title}
                    </h3>
                    <button
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs bg-[color:var(--black-nav)]/80 text-[color:var(--white)] ring-1 ring-[color:var(--white)]/10 hover:ring-[color:var(--accent)] hover:text-[color:var(--accent)] transition-all"
                      onClick={() => setOpen(false)}
                      aria-label="Close details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M18 6 6 18" />
                        <path d="M6 6l12 12" />
                      </svg>
                      Close
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-[color:var(--white)]/80">{highlightAuthorNames(item.authors)}</p>
                  <p className="mt-2 text-xs md:text-sm text-[color:var(--white)]/60 flex items-center gap-2 flex-wrap">
                    {item.type ? (
                      <span
                        className="glass-chip text-xs whitespace-nowrap"
                        style={{
                          color: accent,
                          borderColor: `color-mix(in oklab, ${accent} 55%, transparent)`,
                          background: `color-mix(in oklab, ${accent} 12%, transparent)`
                        }}
                      >
                        {toTitleCase(item.type)}
                      </span>
                    ) : null}
                    <span className="whitespace-nowrap">• {item.venue}</span>
                    <span className="whitespace-nowrap">• {item.year}</span>
                  </p>

                  {item.tags?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.tags.map((t) => (
                        <span key={t} className="inline-block glass-chip text-xs">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-4 max-h-[min(80vh,48rem)] overflow-auto pr-1">
                    <p className="text-sm text-[color:var(--white)]/90 font-medium mb-1">Abstract</p>
                    <p className="text-sm text-[color:var(--white)]/80 whitespace-pre-wrap">
                      {item.abstract?.trim() || 'Abstract coming soon.'}
                    </p>

                    {(item.url || item.artifacts?.length) ? (
                      <div className="mt-5 pt-4 border-t border-[color:var(--white)]/10">
                        <p className="text-sm text-[color:var(--white)]/90 font-medium mb-2">Resources</p>
                        <div className="flex flex-wrap gap-2">
                          {item.url ? (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2"
                              style={{
                                color: accent,
                                background: `color-mix(in oklab, ${accent} 14%, transparent)`,
                                border: `1px solid color-mix(in oklab, ${accent} 45%, transparent)`,
                                boxShadow: `0 6px 18px -10px ${accent}`
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <path d="M15 3h6v6"></path>
                                <path d="M10 14 21 3"></path>
                              </svg>
                              Paper
                            </a>
                          ) : null}
                          {item.artifacts?.map((a) => (
                            <a
                              key={a.href}
                              href={a.href}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2"
                              style={{
                                color: accent,
                                background: `color-mix(in oklab, ${accent} 14%, transparent)`,
                                border: `1px solid color-mix(in oklab, ${accent} 45%, transparent)`,
                                boxShadow: `0 6px 18px -10px ${accent}`
                              }}
                            >
                              {/* simple icon heuristic by label */}
                              {/^code$/i.test(a.label) ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <path d="m18 16 4-4-4-4" />
                                  <path d="m6 8-4 4 4 4" />
                                  <path d="m14.5 4-5 16" />
                                </svg>
                              ) : /data|dataset/i.test(a.label) ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                                  <path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"></path>
                                  <path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"></path>
                                </svg>
                              ) : /video|talk|presentation/i.test(a.label) ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <path d="m22 8-6 4 6 4V8Z" />
                                  <rect x="2" y="6" width="14" height="12" rx="2" ry="2" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <path d="M10 13a5 5 0 1 0 7 7L22 15a5 5 0 0 0-7-7L9 14"></path>
                                  <path d="M16 7a5 5 0 0 0-7 7"></path>
                                </svg>
                              )}
                              {a.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </article>
  );
}

export default PublicationCard;
