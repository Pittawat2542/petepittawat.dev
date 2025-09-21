import { Code2, Database, ExternalLink, Video, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/core/dialog';

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

const PublicationModalComponent: FC<PublicationModalProps> = ({ item, open, onOpenChange, accent, detailsId }) => {
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-[min(48rem,94vw)] p-0 overflow-hidden">
        <DialogTitle className="sr-only">Publication Details</DialogTitle>
        <DialogDescription className="sr-only">Full details and resources for the selected publication.</DialogDescription>
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
              onClick={stopPropagation}
            >
              <X size={14} aria-hidden="true" />
              Close
            </DialogClose>
          </div>
          
          <p className="mt-1 text-sm text-[color:var(--white)]/80"><AuthorList authors={item.authors} /></p>
          
          <PublicationMeta item={item} accent={accent} />

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
          </div>

          {(item.url || item.artifacts?.length) ? (
            <div className="pt-4 mt-4 border-t border-[color:var(--white)]/10 sticky bottom-0 bg-[color:var(--black-nav)]/70 backdrop-blur-md">
              <p className="text-sm text-[color:var(--white)]/90 font-medium mb-2">Resources</p>
              <div className="flex flex-wrap gap-2">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-[background-color,color,border-color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 max-w-full whitespace-normal break-words"
                    style={{
                      color: accent,
                      background: `color-mix(in oklab, ${accent} 14%, transparent)`,
                      border: `1px solid color-mix(in oklab, ${accent} 45%, transparent)`,
                      boxShadow: `0 6px 18px -10px ${accent}`
                    }}
                    onClick={stopPropagation}
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
                    onClick={stopPropagation}
                  >
                    <span title={
                      /^code$/i.test(a.label) ? "Code" :
                      /data|dataset/i.test(a.label) ? "Data" :
                      /video|talk|presentation/i.test(a.label) ? "Video" :
                      "External link"
                    }>
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