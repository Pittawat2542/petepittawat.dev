import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { memo } from 'react';
import type { CSSProperties, FC, MouseEvent } from 'react';

import { MeasuredOverflowRow } from '@/components/ui/cards/CardAtoms';
import type { Publication } from '@/types';

interface PublicationActionsProps {
  readonly item: Publication;
  readonly dedupedArtifacts: NonNullable<Publication['artifacts']>;
  readonly accent: string;
  readonly onStopPropagation: (e: MouseEvent) => void;
  readonly maxVisible?: number;
  readonly onOverflowClick?: () => void;
}

const PublicationActionsComponent: FC<PublicationActionsProps> = ({
  item,
  dedupedArtifacts,
  accent,
  onStopPropagation,
  maxVisible,
  onOverflowClick,
}) => {
  const tint = (intensity: number) =>
    `color-mix(in oklab, var(--card-accent) ${intensity}%, transparent)`;
  const chipStyle = { '--card-accent': accent } as CSSProperties;
  const actionClassName =
    'group/link inline-flex min-w-0 items-start justify-between gap-3 rounded-[1.4rem] border px-4 py-3 text-[color:var(--card-accent)]/88 transition-[transform,border-color,background-color,color,box-shadow] duration-200 hover:-translate-y-0.5 hover:text-[color:var(--card-accent)]';
  const actions = [
    ...(item.url
      ? [
          {
            key: item.url,
            href: item.url,
            label: 'Paper',
            ariaLabel: 'Open paper',
            isExternal: true,
          },
        ]
      : []),
    ...dedupedArtifacts.map((artifact, idx) => ({
      key: `${artifact.href}-${idx}`,
      href: artifact.href,
      label: artifact.label,
      ariaLabel: artifact.label,
      isExternal: !artifact.href.startsWith('/'),
    })),
  ];
  const renderOverflow = (hiddenActionCount: number) =>
    onOverflowClick ? (
      <button
        type="button"
        className="group/link inline-flex min-w-0 items-center justify-between gap-3 rounded-[1.4rem] border px-4 py-3 font-bold text-[color:var(--card-accent)] transition-[transform,border-color,background-color,color,box-shadow] duration-200 hover:-translate-y-0.5 hover:text-white"
        style={{
          ...chipStyle,
          borderColor: tint(58),
          background: `linear-gradient(180deg, ${tint(26)}, ${tint(13)})`,
          boxShadow: `inset 0 1px 0 ${tint(22)}, 0 14px 28px -22px var(--card-accent)`,
        }}
        onClick={event => {
          event.stopPropagation();
          onOverflowClick();
        }}
        aria-label={`Show ${hiddenActionCount} more publication resources`}
      >
        <span className="min-w-0 text-left leading-snug font-medium tracking-[0.01em] whitespace-nowrap">
          +{hiddenActionCount} more
        </span>
        <ArrowUpRight size={14} aria-hidden="true" className="icon-bounce" />
      </button>
    ) : null;

  return (
    <MeasuredOverflowRow
      items={actions}
      maxVisible={maxVisible}
      minVisible={1}
      className="media-card__action-row text-white/80 md:text-xs"
      itemClassName="media-card__action-item"
      overflowClassName="media-card__action-item media-card__action-item--more"
      getKey={action => action.key}
      renderItem={action => (
        <a
          key={action.key}
          href={action.href}
          target={action.isExternal ? '_blank' : undefined}
          rel={action.isExternal ? 'noopener noreferrer' : undefined}
          className={actionClassName}
          style={{
            ...chipStyle,
            borderColor: tint(48),
            background: `linear-gradient(180deg, ${tint(12)}, ${tint(6)})`,
            boxShadow: `inset 0 1px 0 ${tint(12)}`,
          }}
          onClick={onStopPropagation}
          aria-label={action.ariaLabel}
        >
          <span className="min-w-0 truncate text-left leading-snug font-medium tracking-[0.01em] whitespace-nowrap">
            {action.label}
          </span>
          <span
            title={action.isExternal ? 'External link' : 'Internal link'}
            className="mt-0.5 shrink-0 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
          >
            {action.isExternal ? (
              <ExternalLink size={14} aria-hidden="true" className="icon-bounce" />
            ) : (
              <ArrowUpRight size={14} aria-hidden="true" className="icon-bounce" />
            )}
          </span>
        </a>
      )}
      renderOverflow={renderOverflow}
    />
  );
};

// Memoize the component with custom comparison
export const PublicationActions = memo(PublicationActionsComponent, (prevProps, nextProps) => {
  return (
    prevProps.item === nextProps.item &&
    prevProps.dedupedArtifacts === nextProps.dedupedArtifacts &&
    prevProps.accent === nextProps.accent &&
    prevProps.onStopPropagation === nextProps.onStopPropagation &&
    prevProps.maxVisible === nextProps.maxVisible &&
    prevProps.onOverflowClick === nextProps.onOverflowClick
  );
});

PublicationActions.displayName = 'PublicationActions';
export default PublicationActions;
