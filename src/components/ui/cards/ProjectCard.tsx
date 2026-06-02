import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Code,
  Code2,
  Cpu,
  ExternalLink,
  FileText,
  Globe,
  Star,
  Tag,
  Users,
} from 'lucide-react';
import { memo, useState, type FC, type ReactNode } from 'react';
import '@/styles/components/project-card.css';
import { cn, getAccentColorVar } from '@/lib/utils';
import { resolveCardVisualSpec, toProjectCardVisualInput } from '@/lib/card-visual';
import type { Project, ProjectLink } from '@/types';
import CardVisualPanel from './CardVisualPanel';
import {
  CardInfoPanel,
  CardMetaChip,
  CardMetaRow,
  CardTagList,
  MeasuredOverflowRow,
} from './CardAtoms';
import CardDetailsDialog from './CardDetailsDialog';
import MediaContentCard from './MediaContentCard';

function toTitleCase(input?: string) {
  if (!input) return '';
  return input.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1));
}

function typeAccentVar(_type?: string) {
  return 'var(--accent)';
}

function getLinkIcon(label: string) {
  const normalized = label.toLowerCase();
  if (
    normalized.includes('paper') ||
    normalized.includes('pdf') ||
    normalized.includes('report') ||
    normalized.includes('thesis')
  ) {
    return FileText;
  }
  if (
    normalized.includes('model') ||
    normalized.includes('weights') ||
    normalized.includes('hugging')
  ) {
    return Cpu;
  }
  if (
    normalized.includes('book') ||
    normalized.includes('doc') ||
    normalized.includes('tutorial') ||
    normalized.includes('read')
  ) {
    return BookOpen;
  }
  if (normalized.includes('github') || normalized.includes('repo')) {
    return Code2;
  }
  if (
    normalized.includes('code') ||
    normalized.includes('source') ||
    normalized.includes('implementation')
  ) {
    return Code;
  }
  return Globe;
}

interface ProjectCardProps {
  readonly item: Project;
  readonly featured?: boolean;
}

interface ProjectLinkButtonProps {
  readonly link: ProjectLink;
  readonly index: number;
  readonly tint: (intensity: number) => string;
  readonly compact?: boolean;
}

const ProjectLinkButton: FC<ProjectLinkButtonProps> = ({ link, index, tint, compact = false }) => {
  const isExternal = !link.href.startsWith('/');
  const Icon = getLinkIcon(link.label);

  return (
    <a
      key={`${link.href}-${index}`}
      href={link.href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={cn(
        'group/link inline-flex min-w-0 items-center gap-2.5 rounded-xl border px-4 text-[color:var(--card-accent)] transition-[transform,border-color,background-color,color,box-shadow] duration-200 hover:-translate-y-0.5 hover:text-white focus-visible:ring-2 focus-visible:ring-[color:var(--card-accent)]/45 focus-visible:outline-none',
        compact ? 'justify-start py-2.5 text-sm' : 'justify-center py-3 text-sm'
      )}
      style={{
        borderColor: tint(24),
        background: `linear-gradient(180deg, ${tint(10)}, ${tint(4)})`,
        boxShadow: `inset 0 1px 0 ${tint(10)}`,
      }}
      aria-label={link.label}
    >
      <Icon
        size={16}
        aria-hidden="true"
        className="flex-shrink-0 transition-transform duration-200 group-hover/link:scale-110"
      />
      <span className="truncate font-semibold tracking-[0.02em]">{link.label}</span>
      <span
        title={isExternal ? 'External link' : 'Internal link'}
        className="ml-auto inline-flex items-center text-white/40 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-white"
      >
        {isExternal ? (
          <ExternalLink size={13} aria-hidden="true" />
        ) : (
          <ArrowUpRight size={13} aria-hidden="true" />
        )}
      </span>
    </a>
  );
};

function renderProjectLinks(
  links: readonly ProjectLink[],
  tint: (intensity: number) => string,
  compact = false
) {
  return links.map((link, idx) => (
    <ProjectLinkButton
      key={`${link.href}-${idx}`}
      link={link}
      index={idx}
      tint={tint}
      compact={compact}
    />
  ));
}

const ProjectCardComponent: FC<ProjectCardProps> = ({ item, featured = false }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const accentColor = getAccentColorVar(typeAccentVar(item.type));
  const visualSpec = resolveCardVisualSpec(toProjectCardVisualInput(item));
  const tint = (intensity: number) =>
    `color-mix(in oklab, var(--card-accent) ${intensity}%, transparent)`;
  const links = item.links ?? [];
  const hasHiddenMetadata = links.length > 1 || item.tags.length > 1;
  const renderLinkOverflow = (hiddenCount: number) => (
    <button
      type="button"
      className="group/link inline-flex min-w-0 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold whitespace-nowrap text-[color:var(--card-accent)] transition-[transform,border-color,background-color,color,box-shadow] duration-200 hover:-translate-y-0.5 hover:text-white focus-visible:ring-2 focus-visible:ring-[color:var(--card-accent)]/55 focus-visible:outline-none"
      style={{
        borderColor: tint(58),
        background: `linear-gradient(180deg, ${tint(26)}, ${tint(13)})`,
        boxShadow: `inset 0 1px 0 ${tint(22)}, 0 14px 28px -22px var(--card-accent)`,
      }}
      onClick={() => {
        setDetailsOpen(true);
      }}
      aria-label={`Show all metadata for ${item.title}`}
    >
      +{hiddenCount} more
    </button>
  );
  const detailSections: { title: string; content: ReactNode }[] = [
    {
      title: 'Tags',
      content: <CardTagList tags={item.tags} tone="muted" />,
    },
  ];

  if (links.length) {
    detailSections.push({
      title: 'Links',
      content: (
        <div className="grid gap-2.5 sm:grid-cols-2">{renderProjectLinks(links, tint, true)}</div>
      ),
    });
  }

  return (
    <MediaContentCard
      accent={accentColor}
      featured={featured}
      className="project-card h-full"
      media={
        <CardVisualPanel
          spec={visualSpec}
          className="mb-0 [aspect-ratio:auto] h-full rounded-none border-0 shadow-none"
        />
      }
      footer={
        links.length ? (
          <MeasuredOverflowRow
            items={links}
            maxVisible={2}
            minVisible={1}
            className="media-card__action-row project-card__actions"
            itemClassName="media-card__action-item"
            overflowClassName="media-card__action-item media-card__action-item--more"
            getKey={(link, idx) => `${link.href}-${idx}`}
            renderItem={(link, idx) => <ProjectLinkButton link={link} index={idx} tint={tint} />}
            renderOverflow={renderLinkOverflow}
          />
        ) : null
      }
    >
      <div className="flex h-full flex-col">
        <CardMetaRow>
          <CardMetaChip>Project</CardMetaChip>
          {item.type ? (
            <CardMetaChip icon={Tag} title={item.type}>
              {toTitleCase(item.type)}
            </CardMetaChip>
          ) : null}
          {item.year ? <CardMetaChip icon={CalendarDays}>{item.year}</CardMetaChip> : null}
        </CardMetaRow>

        <div className="mt-4 flex flex-1 flex-col gap-4">
          <div className="space-y-3">
            <h3 className="type-featured-card-title max-w-full leading-[1.02] font-semibold tracking-[-0.045em] text-balance text-white">
              {item.title}
            </h3>
            {item.summary ? (
              <p
                className="max-w-full text-base leading-[1.72] text-[color:var(--white)]/78 md:text-base"
                data-card-description
              >
                {item.summary}
              </p>
            ) : null}
          </div>

          {item.role || item.collaborators ? (
            <CardInfoPanel className="grid gap-2 px-3 py-3">
              {item.role ? (
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ background: tint(12), color: 'var(--card-accent)' }}
                  >
                    <Star size={13} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="type-micro font-semibold tracking-[0.24em] text-white/42 uppercase">
                      Role
                    </p>
                    <p className="text-sm leading-relaxed text-white/78">{item.role}</p>
                  </div>
                </div>
              ) : null}
              {item.collaborators ? (
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ background: tint(12), color: 'var(--card-accent)' }}
                  >
                    <Users size={13} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="type-micro font-semibold tracking-[0.24em] text-white/42 uppercase">
                      Collaborators
                    </p>
                    <p className="text-sm leading-relaxed text-white/78">{item.collaborators}</p>
                  </div>
                </div>
              ) : null}
            </CardInfoPanel>
          ) : null}

          <div className="flex flex-col gap-3">
            <CardTagList
              tags={item.tags}
              tone="muted"
              maxVisible={featured ? 4 : 3}
              onOverflowClick={() => {
                setDetailsOpen(true);
              }}
              overflowLabel={`Show all tags for ${item.title}`}
            />
          </div>
        </div>
      </div>

      {hasHiddenMetadata ? (
        <CardDetailsDialog
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          accent={accentColor}
          eyebrow="Project details"
          title={item.title}
          description="All visible tags and linked project resources."
          sections={detailSections}
        />
      ) : null}
    </MediaContentCard>
  );
};

// Memoize the component with custom comparison
export const ProjectCard = memo(ProjectCardComponent, (prevProps, nextProps) => {
  return prevProps.item === nextProps.item && prevProps.featured === nextProps.featured;
});

ProjectCard.displayName = 'ProjectCard';
export default ProjectCard;
