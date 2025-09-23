import { ArrowUpRight, ExternalLink } from 'lucide-react';
import type { FC, MouseEvent } from 'react';

import type { Publication } from '../../../types';
import { memo } from 'react';

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
  const buttonStyle = {
    color: accent,
    background: `color-mix(in oklab, ${accent} 14%, transparent)`,
    border: `1px solid color-mix(in oklab, ${accent} 45%, transparent)`,
    boxShadow: `0 10px 22px -14px ${accent}`,
  };

  const handleMouseEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    (e.currentTarget as HTMLAnchorElement).style.background =
      `color-mix(in oklab, ${accent} 22%, transparent)`;
  };

  const handleMouseLeave = (e: MouseEvent<HTMLAnchorElement>) => {
    (e.currentTarget as HTMLAnchorElement).style.background =
      `color-mix(in oklab, ${accent} 14%, transparent)`;
  };

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-[background-color,color,border-color,transform] duration-200 ease-out will-change-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[color:var(--white)]/20 focus-visible:outline-none"
          style={buttonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
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
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-[background-color,color,border-color,transform] duration-200 ease-out will-change-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[color:var(--white)]/20 focus-visible:outline-none"
            style={buttonStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
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
