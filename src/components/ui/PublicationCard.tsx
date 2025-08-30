import { useEffect, useState } from 'react';
import { highlightAuthorNames, isFirstAuthor } from '../../lib';
import { FIRST_AUTHOR_TITLE } from '../../lib/constants';
import type { Publication } from '../../types';
import { Card } from './card';
import { Dialog, DialogContent, DialogClose } from './dialog';
import { Badge } from './badge';
import { ExternalLink, ArrowUpRight, Code2, Database, Video, X, Building2, CalendarDays } from 'lucide-react';
import Tooltip from './tooltip';

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

  function onCardClick() {
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

  // Deduplicate artifact links by href and avoid duplicating the main paper URL
  const dedupedArtifacts = (() => {
    const arr = Array.isArray(item.artifacts) ? item.artifacts : [];
    const seen = new Set<string>();
    const cleaned = [] as NonNullable<typeof item.artifacts>;
    for (const a of arr) {
      if (!a || !a.href) continue;
      if (item.url && a.href === item.url) continue;
      if (seen.has(a.href)) continue;
      seen.add(a.href);
      cleaned.push(a);
    }
    return cleaned;
  })();

  return (
    <Card
      className={[`p-4 md:p-5 cursor-pointer publication-card`, highlight ? 'first-author' : '', featured ? 'card-featured' : ''].filter(Boolean).join(' ')}
      role="button"
      tabIndex={0}
      onClick={onCardClick}
      onKeyDown={onKeyDown}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={detailsId}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 min-w-0 overflow-x-hidden">
          <div className="min-w-0">
            <h3 className="text-base md:text-lg font-semibold leading-snug">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[color:var(--accent)] hover:underline"
                  onClick={(e) => {
                    // Prefer expanding details modal on title click
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(true);
                  }}
                >
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </h3>
            <p className="mt-1 text-sm text-[color:var(--white)]/80">{highlightAuthorNames(item.authors)}</p>
            <p className="mt-1 text-xs md:text-sm text-[color:var(--white)]/60 flex items-center gap-2 flex-wrap">
              {item.type ? (
                <Badge
                  className="text-xs whitespace-nowrap"
                  style={{
                    color: accent,
                    borderColor: `color-mix(in oklab, ${accent} 55%, transparent)`,
                    background: `color-mix(in oklab, ${accent} 12%, transparent)`
                  }}
                  title={item.type}
                >
                  {toTitleCase(item.type)}
                </Badge>
              ) : null}
              {item.venue ? (
                <Tooltip content={item.venue}>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] md:text-xs font-medium truncate max-w-[60vw] md:max-w-[22rem]"
                    style={{
                      color: accent,
                      background: `color-mix(in oklab, ${accent} 10%, transparent)`,
                      border: `1px solid color-mix(in oklab, ${accent} 45%, transparent)`
                    }}
                  >
                  <Building2 size={12} aria-hidden="true" className="icon-bounce" />
                    <span className="truncate">{item.venue}</span>
                  </span>
                </Tooltip>
              ) : null}
              <Tooltip content={String(item.year)}>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] md:text-xs font-medium"
                  style={{
                    color: accent,
                    background: `color-mix(in oklab, ${accent} 10%, transparent)`,
                    border: `1px solid color-mix(in oklab, ${accent} 45%, transparent)`
                  }}
                >
                  <CalendarDays size={12} aria-hidden="true" className="icon-bounce" />
                  <span>{item.year}</span>
                </span>
              </Tooltip>
            </p>
          </div>
          {/* First author badge */}
          <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-2">
            {badgeLabel && (
              <Badge className="text-[color:var(--accent)] font-semibold text-xs py-1 px-2 whitespace-nowrap shrink-0" variant="outline">
                {badgeLabel}
              </Badge>
            )}
          </div>
        </div>
        
        {item.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <Badge key={t} className="text-xs" variant="outline">
                {t}
              </Badge>
            ))}
          </div>
        ) : null}

        {/* Resource links (always visible) */}
        {(item.url || dedupedArtifacts.length) ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-[background-color,color,border-color,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 btn-ripple max-w-full whitespace-normal break-words will-change-transform hover:-translate-y-0.5"
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
                <span title="External link">
                  <ExternalLink size={14} aria-hidden="true" className="icon-bounce" />
                </span>
              </a>
            ) : null}
            {dedupedArtifacts.map((a, idx) => {
              const isExternal = !a.href.startsWith('/');
              return (
                <a
                  key={`${a.href}-${idx}`}
                  href={a.href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noreferrer' : undefined}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-[background-color,color,border-color,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 btn-ripple max-w-full whitespace-normal break-words will-change-transform hover:-translate-y-0.5"
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
                  <span title={isExternal ? "External link" : "Internal link"} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    {isExternal ? <ExternalLink size={14} aria-hidden="true" className="icon-bounce" /> : <ArrowUpRight size={14} aria-hidden="true" className="icon-bounce" />}
                  </span>
                </a>
              );
            })}
          </div>
        ) : null}
      </div>
      
      {/* Modal with full details (Radix Dialog for consistency) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-none w-[min(48rem,94vw)] p-0 overflow-hidden">
          <Card
            className="modal-card p-5 md:p-6 flex flex-col max-h-[85vh] overflow-hidden"
            style={{ backgroundColor: 'color-mix(in oklab, var(--black) 84%, transparent)' }}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 id={detailsId} className="text-lg md:text-xl font-semibold leading-snug">
                {item.title}
              </h3>
              <DialogClose
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs bg-[color:var(--black-nav)]/80 text-[color:var(--white)] ring-1 ring-[color:var(--white)]/10 hover:ring-[color:var(--accent)] hover:text-[color:var(--accent)] transition-[color,border-color,background-color] duration-150 ease-out"
                aria-label="Close details"
                title="Close"
                onClick={(e) => e.stopPropagation()}
              >
                <X size={14} aria-hidden="true" />
                Close
              </DialogClose>
            </div>
                  <p className="mt-1 text-sm text-[color:var(--white)]/80">{highlightAuthorNames(item.authors)}</p>
                  <p className="mt-2 text-xs md:text-sm text-[color:var(--white)]/60 flex items-center gap-2 flex-wrap">
                    {item.type ? (
                      <Badge
                        className="text-xs whitespace-nowrap"
                        style={{
                          color: accent,
                          borderColor: `color-mix(in oklab, ${accent} 55%, transparent)`,
                          background: `color-mix(in oklab, ${accent} 12%, transparent)`
                        }}
                      >
                        {toTitleCase(item.type)}
                      </Badge>
                    ) : null}
                    {item.venue ? (
                      <Tooltip content={item.venue}>
                        <span
                          className="inline-block rounded-lg px-2.5 py-1 text-xs font-medium max-w-full"
                          style={{
                            color: accent,
                            background: `color-mix(in oklab, ${accent} 10%, transparent)`,
                            border: `1px solid color-mix(in oklab, ${accent} 45%, transparent)`
                          }}
                        >
                          <span className="flex items-start gap-1.5 text-left">
                            <Building2 size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
                            <span className="whitespace-normal break-words leading-snug">{item.venue}</span>
                          </span>
                        </span>
                      </Tooltip>
                    ) : null}
                    <Tooltip content={String(item.year)}>
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{
                          color: accent,
                          background: `color-mix(in oklab, ${accent} 10%, transparent)`,
                          border: `1px solid color-mix(in oklab, ${accent} 45%, transparent)`
                        }}
                      >
                        <CalendarDays size={14} aria-hidden="true" />
                        <span>{item.year}</span>
                      </span>
                    </Tooltip>
                  </p>

                  {item.tags?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.tags.map((t) => (
                        <Badge key={t} className="text-xs" variant="outline">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-4 overflow-y-auto pr-1 flex-1 min-h-0">
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
                              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-[background-color,color,border-color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 max-w-full whitespace-normal break-words"
                              style={{
                                color: accent,
                                background: `color-mix(in oklab, ${accent} 14%, transparent)`,
                                border: `1px solid color-mix(in oklab, ${accent} 45%, transparent)`,
                                boxShadow: `0 6px 18px -10px ${accent}`
                              }}
                            >
                              <span title="Paper">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                  <path d="M15 3h6v6"></path>
                                  <path d="M10 14 21 3"></path>
                                </svg>
                              </span>
                              Paper
                            </a>
                          ) : null}
                          {item.artifacts?.map((a) => (
                            <a
                              key={a.href}
                              href={a.href}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-[background-color,color,border-color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 max-w-full whitespace-normal break-words"
                              style={{
                                color: accent,
                                background: `color-mix(in oklab, ${accent} 14%, transparent)`,
                                border: `1px solid color-mix(in oklab, ${accent} 45%, transparent)`,
                                boxShadow: `0 6px 18px -10px ${accent}`
                              }}
                            >
                              <span title={
                                /^code$/i.test(a.label) ? "Code" :
                                /data|dataset/i.test(a.label) ? "Data" :
                                /video|talk|presentation/i.test(a.label) ? "Video" :
                                "External link"
                              }>
                                {/* simple icon heuristic by label */}
                                {/^code$/i.test(a.label) ? (
                                  <Code2 size={14} aria-hidden="true" />
                                ) : /data|dataset/i.test(a.label) ? (
                                  <Database size={14} aria-hidden="true" />
                                ) : /video|talk|presentation/i.test(a.label) ? (
                                  <Video size={14} aria-hidden="true" />
                                ) : (
                                  <ExternalLink size={14} aria-hidden="true" />
                                )}
                              </span>
                              {a.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
          </Card>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default PublicationCard;
