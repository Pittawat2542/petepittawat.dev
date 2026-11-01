import {
  ArrowUpRight,
  BookOpen,
  Code2,
  Database,
  ExternalLink,
  FileText,
  Globe,
  Video,
} from 'lucide-react';
import { memo } from 'react';
import type { CSSProperties, FC } from 'react';

import { MeasuredOverflowRow } from '@/components/ui/cards/CardAtoms';
import type { Publication } from '@/types';

interface PublicationActionsProps {
  readonly item: Publication;
  readonly dedupedArtifacts: NonNullable<Publication['artifacts']>;
  readonly accent: string;
  readonly maxVisible?: number;
  readonly detailsTrigger?: boolean;
  readonly viewportSafe?: boolean;
}

function getPublicationActionIcon(label: string) {
  if (/paper|pdf|preprint|article/i.test(label)) {
    return FileText;
  }
  if (/github|repo|code|source|implementation/i.test(label)) {
    return Code2;
  }
  if (/data|dataset|benchmark/i.test(label)) {
    return Database;
  }
  if (/video|talk|presentation|demo/i.test(label)) {
    return Video;
  }
  if (/doc|readme|book/i.test(label)) {
    return BookOpen;
  }
  return Globe;
}

const PublicationActionsComponent: FC<PublicationActionsProps> = ({
  item,
  dedupedArtifacts,
  accent,
  maxVisible,
  detailsTrigger,
  viewportSafe,
}) => {
  const tint = (intensity: number) =>
    `color-mix(in oklab, var(--card-accent) ${intensity}%, transparent)`;
  const chipStyle = { '--card-accent': accent } as CSSProperties;
  const actionClassName =
    'group/link inline-flex min-w-0 items-center gap-2.5 rounded-[var(--radius-control)] border px-4 py-3 text-sm text-[color:var(--card-accent)] transition-[transform,border-color,background-color,color,box-shadow] duration-200 hover:text-white focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-primary)] focus-visible:outline-none';
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
    detailsTrigger ? (
      <button
        type="button"
        className="group/link inline-flex min-w-0 items-center justify-center gap-2 rounded-[var(--radius-control)] border px-4 py-3 text-sm font-bold whitespace-nowrap text-[color:var(--card-accent)] transition-[transform,border-color,background-color,color,box-shadow] duration-200 hover:text-white focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-primary)] focus-visible:outline-none"
        style={{
          ...chipStyle,
          borderColor: tint(58),
          background: 'var(--color-surface)',
        }}
        data-details-trigger
        aria-label={`Show ${hiddenActionCount} more publication resources`}
      >
        +{hiddenActionCount} more
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
      viewportSafe={viewportSafe}
      getKey={action => action.key}
      renderItem={action => {
        const Icon = getPublicationActionIcon(action.label);

        return (
          <a
            key={action.key}
            href={action.href}
            target={action.isExternal ? '_blank' : undefined}
            rel={action.isExternal ? 'noopener noreferrer' : undefined}
            className={actionClassName}
            style={{
              ...chipStyle,
              borderColor: tint(24),
              background: 'var(--color-surface)',
            }}
            aria-label={action.ariaLabel}
          >
            <Icon
              size={16}
              aria-hidden="true"
              className="flex-shrink-0 transition-transform duration-200 group-hover/link:scale-110"
            />
            <span className="min-w-0 truncate font-semibold tracking-[0.02em] whitespace-nowrap">
              {action.label}
            </span>
            <span
              title={action.isExternal ? 'External link' : 'Internal link'}
              className="ml-auto inline-flex items-center text-white/40 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-white"
            >
              {action.isExternal ? (
                <ExternalLink size={13} aria-hidden="true" />
              ) : (
                <ArrowUpRight size={13} aria-hidden="true" />
              )}
            </span>
          </a>
        );
      }}
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
    prevProps.maxVisible === nextProps.maxVisible &&
    prevProps.detailsTrigger === nextProps.detailsTrigger &&
    prevProps.viewportSafe === nextProps.viewportSafe
  );
});

PublicationActions.displayName = 'PublicationActions';
export default PublicationActions;
