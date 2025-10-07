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
import type { CSSProperties, FC, MouseEvent } from 'react';
import type { Publication } from '@/types';
import { PublicationMeta } from './PublicationMeta';
import { memo } from 'react';
import { BlogCardOverlays } from '@/components/ui/blog/BlogCardOverlays';

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
  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => event.stopPropagation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(52rem,94vw)] max-w-none overflow-hidden border-none bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Publication Details</DialogTitle>
        <DialogDescription className="sr-only">
          Full details and resources for the selected publication.
        </DialogDescription>
        <div
          className="aurora-modal aurora-modal--publication publication-modal flex max-h-[86vh] flex-col"
          style={{ '--card-accent': accent } as CSSProperties}
        >
          <BlogCardOverlays accent={accent} intensity="subtle" />

          <header className="publication-modal__header">
            <div className="publication-modal__headline">
              <span className="publication-modal__eyebrow">Publication</span>
              <h3 id={detailsId}>{item.title}</h3>
            </div>
            <DialogClose
              className="publication-modal__close"
              aria-label="Close details"
              title="Close"
            >
              <span className="sr-only">Close</span>
              <X size={16} aria-hidden="true" />
            </DialogClose>
          </header>

          <div className="publication-modal__meta">
            <p className="publication-modal__authors">
              <AuthorList authors={item.authors} />
            </p>
            <PublicationMeta item={item} accent={accent} />
            {item.tags?.length ? (
              <div className="publication-modal__tags">
                {item.tags.map(tag => (
                  <Badge key={tag} className="text-xs" variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>

          <div className="publication-modal__body" role="document">
            <section className="publication-modal__section">
              <h4>Abstract</h4>
              <p>{item.abstract?.trim() || 'Abstract coming soon.'}</p>
            </section>

            {item.url || item.artifacts?.length ? (
              <section className="publication-modal__section publication-modal__section--resources">
                <h4>Resources</h4>
                <div className="publication-modal__resources">
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="publication-modal__chip"
                      onClick={handleLinkClick}
                    >
                      <span aria-hidden="true" className="publication-modal__chip-icon">
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
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <path d="M15 3h6v6"></path>
                          <path d="M10 14 21 3"></path>
                        </svg>
                      </span>
                      Paper
                    </a>
                  ) : null}

                  {item.artifacts?.map(artifact => {
                    const label = artifact.label;
                    const title = /^code$/i.test(label)
                      ? 'Code'
                      : /data|dataset/i.test(label)
                        ? 'Data'
                        : /video|talk|presentation/i.test(label)
                          ? 'Video'
                          : 'External link';

                    const icon = /^code$/i.test(label) ? (
                      <Code2 size={14} aria-hidden="true" />
                    ) : /data|dataset/i.test(label) ? (
                      <Database size={14} aria-hidden="true" />
                    ) : /video|talk|presentation/i.test(label) ? (
                      <Video size={14} aria-hidden="true" />
                    ) : (
                      <ExternalLink size={14} aria-hidden="true" />
                    );

                    return (
                      <a
                        key={artifact.href}
                        href={artifact.href}
                        target="_blank"
                        rel="noreferrer"
                        className="publication-modal__chip"
                        onClick={handleLinkClick}
                      >
                        <span
                          aria-hidden="true"
                          className="publication-modal__chip-icon"
                          title={title}
                        >
                          {icon}
                        </span>
                        {label}
                      </a>
                    );
                  })}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const PublicationModal = memo(PublicationModalComponent);
PublicationModal.displayName = 'PublicationModal';
export default PublicationModal;
