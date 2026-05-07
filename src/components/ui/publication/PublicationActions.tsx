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
  const tint = (intensity: number) =>
    `color-mix(in oklab, var(--card-accent) ${intensity}%, transparent)`;
  const chipStyle = { '--card-accent': accent } as CSSProperties;
  const actionClassName =
    'group/link inline-flex min-w-0 items-start justify-between gap-3 rounded-[1.4rem] border px-4 py-3 text-[color:var(--card-accent)]/88 transition-[transform,border-color,background-color,color,box-shadow] duration-200 hover:-translate-y-0.5 hover:text-[color:var(--card-accent)]';

  return (
    <div className="grid w-full [grid-template-columns:repeat(auto-fit,minmax(10.5rem,1fr))] gap-2.5">
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className={actionClassName}
          style={{
            ...chipStyle,
            borderColor: tint(48),
            background: `linear-gradient(180deg, ${tint(12)}, ${tint(6)})`,
            boxShadow: `inset 0 1px 0 ${tint(12)}`,
          }}
          onClick={onStopPropagation}
          aria-label="Open paper"
        >
          <span className="min-w-0 text-left leading-snug font-medium tracking-[0.01em] break-words">
            Paper
          </span>
          <span
            title="External link"
            className="mt-0.5 shrink-0 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
          >
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
            className={actionClassName}
            style={{
              ...chipStyle,
              borderColor: tint(48),
              background: `linear-gradient(180deg, ${tint(12)}, ${tint(6)})`,
              boxShadow: `inset 0 1px 0 ${tint(12)}`,
            }}
            onClick={onStopPropagation}
            aria-label={a.label}
          >
            <span className="min-w-0 text-left leading-snug font-medium tracking-[0.01em] break-words">
              {a.label}
            </span>
            <span
              title={isExternal ? 'External link' : 'Internal link'}
              className="mt-0.5 shrink-0 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
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
