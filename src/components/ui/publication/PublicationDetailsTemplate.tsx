import './publication-modal.css';
import '@/styles/components/dialog-surface.css';
import { Code2, Database, ExternalLink, FileText, Video, X } from 'lucide-react';

import { AuthorChipCloud } from './AuthorList';
import { Badge } from '@/components/ui/core/badge';
import type { CSSProperties, FC } from 'react';
import type { Publication } from '@/types';
import { PublicationMeta } from './PublicationMeta';
import { memo } from 'react';

interface PublicationDetailsTemplateProps {
  readonly item: Publication;
  readonly accent: string;
}

const PublicationDetailsTemplateComponent: FC<PublicationDetailsTemplateProps> = ({
  item,
  accent,
}) => {
  const trimmedAbstract = item.abstract?.trim();
  const abstractText = trimmedAbstract === '' ? undefined : trimmedAbstract;
  const hasResources = Boolean(item.url) || Boolean(item.artifacts?.length);

  return (
    <template data-details-template>
      <h2 className="sr-only">Publication Details</h2>
      <p className="sr-only">Full details and resources for the selected publication.</p>
      <div
        className="dialog-surface publication-modal flex max-h-[86vh] flex-col"
        style={{ '--card-accent': accent } as CSSProperties}
      >
        <header className="publication-modal__header">
          <div className="publication-modal__headline">
            <span className="publication-modal__eyebrow">Publication</span>
            <h3>{item.title}</h3>
          </div>
          <button
            type="button"
            data-close-details
            className="publication-modal__close dialog-close"
            aria-label="Close details"
            title="Close"
          >
            <span className="sr-only">Close</span>
            <X size={16} aria-hidden="true" />
          </button>
        </header>

        <div className="publication-modal__scroll" role="document">
          <div className="publication-modal__meta">
            <AuthorChipCloud authors={item.authors} className="publication-modal__authors" />
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

          <section className="publication-modal__section">
            <h4>Abstract</h4>
            <p>{abstractText ?? 'Abstract coming soon.'}</p>
          </section>
        </div>

        {hasResources ? (
          <footer className="publication-modal__resource-bar" aria-label="Publication resources">
            <h4>Resources</h4>
            <div className="publication-modal__resources">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="publication-modal__chip"
                >
                  <span aria-hidden="true" className="publication-modal__chip-icon">
                    <FileText size={14} aria-hidden="true" />
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
                  >
                    <span aria-hidden="true" className="publication-modal__chip-icon" title={title}>
                      {icon}
                    </span>
                    {label}
                  </a>
                );
              })}
            </div>
          </footer>
        ) : null}
      </div>
    </template>
  );
};

export const PublicationDetailsTemplate = memo(PublicationDetailsTemplateComponent);
PublicationDetailsTemplate.displayName = 'PublicationDetailsTemplate';
export default PublicationDetailsTemplate;
