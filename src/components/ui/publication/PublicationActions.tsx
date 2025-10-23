import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { memo } from 'react';
import type { CSSProperties, FC, MouseEvent } from 'react';

import type { Publication } from '@/types';

interface PublicationActionsProps {
  readonly item: Publication;
  readonly dedupedArtifacts: NonNullable<Publication['artifacts']>;
  readonly accent: string;
  readonly onStopPropagation: (e: MouseEvent) => void;
}

const PublicationActionsComponent: FC<PublicationActionsProps> = ({
  item,
  dedupedArtifacts,
  accent,
  onStopPropagation,
}) => {
  const chipStyle = { '--card-accent': accent } as CSSProperties;

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="aurora-chip aurora-chip--pill"
          style={chipStyle}
          onClick={onStopPropagation}
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
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="aurora-chip aurora-chip--pill"
            style={chipStyle}
            onClick={onStopPropagation}
            aria-label={a.label}
          >
            <span>{a.label}</span>
            <span
              title={isExternal ? 'External link' : 'Internal link'}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              {isExternal ? (
                <ExternalLink size={14} aria-hidden="true" className="icon-bounce" />
              ) : (
                <ArrowUpRight size={14} aria-hidden="true" className="icon-bounce" />
              )}
            </span>
          </a>
        );
      })}
    </div>
  );
};

// Memoize the component with custom comparison
export const PublicationActions = memo(PublicationActionsComponent, (prevProps, nextProps) => {
  return (
    prevProps.item === nextProps.item &&
    prevProps.dedupedArtifacts === nextProps.dedupedArtifacts &&
    prevProps.accent === nextProps.accent &&
    prevProps.onStopPropagation === nextProps.onStopPropagation
  );
});

PublicationActions.displayName = 'PublicationActions';
export default PublicationActions;
