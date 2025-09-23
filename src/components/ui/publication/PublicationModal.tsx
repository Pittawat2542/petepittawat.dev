import { Code2, Database, ExternalLink, Video, X } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/core/dialog';

import { AuthorList } from './AuthorList';
import { Badge } from '@/components/ui/core/badge';
import { Card } from '@/components/ui/core/card';
import type { FC } from 'react';
import type { Publication } from '@/types';
import { PublicationMeta } from './PublicationMeta';
import { memo } from 'react';

interface PublicationModalProps {
  readonly item: Publication;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly accent: string;
  readonly detailsId: string;
}

const PublicationModalComponent: FC<PublicationModalProps> = ({
  item,
  open,
  onOpenChange,
  accent,
  detailsId,
}) => {
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(48rem,94vw)] max-w-none overflow-hidden p-0">
        <DialogTitle className="sr-only">Publication Details</DialogTitle>
        <DialogDescription className="sr-only">
          Full details and resources for the selected publication.
        </DialogDescription>
        <Card
          className="modal-card flex max-h-[85vh] flex-col overflow-hidden p-5 md:p-6"
          style={{ backgroundColor: 'color-mix(in oklab, var(--black) 84%, transparent)' }}
        >
          <div className="flex items-start justify-between gap-4">
            <h3 id={detailsId} className="text-lg leading-snug font-semibold md:text-xl">
              {item.title}
            </h3>
            <DialogClose
              className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--black-nav)]/80 px-3 py-1.5 text-xs text-[color:var(--white)] ring-1 ring-[color:var(--white)]/10 transition-[color,border-color,background-color] duration-150 ease-out hover:text-[color:var(--accent)] hover:ring-[color:var(--accent)]"
              aria-label="Close details"
              title="Close"
              onClick={stopPropagation}
            >
              <X size={14} aria-hidden="true" />
              Close
            </DialogClose>
          </div>

          <p className="mt-1 text-sm text-[color:var(--white)]/80">
            <AuthorList authors={item.authors} />
          </p>

          <PublicationMeta item={item} accent={accent} />

          {item.tags?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.map(t => (
                <Badge key={t} className="text-xs" variant="outline">
                  {t}
                </Badge>
              ))}
            </div>
          ) : null}

          <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
            <p className="mb-1 text-sm font-medium text-[color:var(--white)]/90">Abstract</p>
            <p className="text-sm whitespace-pre-wrap text-[color:var(--white)]/80">
              {item.abstract?.trim() || 'Abstract coming soon.'}
            </p>
          </div>

          {item.url || item.artifacts?.length ? (
            <div className="sticky bottom-0 mt-4 border-t border-[color:var(--white)]/10 bg-[color:var(--black-nav)]/70 pt-4 backdrop-blur-md">
              <p className="mb-2 text-sm font-medium text-[color:var(--white)]/90">Resources</p>
              <div className="flex flex-wrap gap-2">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium break-words whitespace-normal transition-[background-color,color,border-color] duration-150 ease-out focus-visible:ring-2 focus-visible:outline-none"
                    style={{
                      color: accent,
                      background: `color-mix(in oklab, ${accent} 14%, transparent)`,
                      border: `1px solid color-mix(in oklab, ${accent} 45%, transparent)`,
                      boxShadow: `0 6px 18px -10px ${accent}`,
                    }}
                    onClick={stopPropagation}
                  >
                    <span title="Paper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <path d="M15 3h6v6"></path>
                        <path d="M10 14 21 3"></path>
                      </svg>
                    </span>
                    Paper
                  </a>
                ) : null}

                {item.artifacts?.map(a => (
                  <a
                    key={a.href}
                    href={a.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium break-words whitespace-normal transition-[background-color,color,border-color] duration-150 ease-out focus-visible:ring-2 focus-visible:outline-none"
                    style={{
                      color: accent,
                      background: `color-mix(in oklab, ${accent} 14%, transparent)`,
                      border: `1px solid color-mix(in oklab, ${accent} 45%, transparent)`,
                      boxShadow: `0 6px 18px -10px ${accent}`,
                    }}
                    onClick={stopPropagation}
                  >
                    <span
                      title={
                        /^code$/i.test(a.label)
                          ? 'Code'
                          : /data|dataset/i.test(a.label)
                            ? 'Data'
                            : /video|talk|presentation/i.test(a.label)
                              ? 'Video'
                              : 'External link'
                      }
                    >
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
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export const PublicationModal = memo(PublicationModalComponent);
PublicationModal.displayName = 'PublicationModal';
export default PublicationModal;
