import {
  ArrowUpRight,
  BookOpen,
  Code,
  Code2,
  Cpu,
  ExternalLink,
  FileText,
  Globe,
  Star,
  Users,
} from 'lucide-react';
import { memo, type FC } from 'react';
import '@/styles/components/project-card.css';
import { Badge } from '@/components/ui/core/badge';
import { cn, getAccentColorVar } from '@/lib/utils';
import { resolveCardVisualSpec, toProjectCardVisualInput } from '@/lib/card-visual';
import type { Project } from '@/types';
import CardVisualPanel from './CardVisualPanel';
import { CardInfoPanel, CardTagList } from './CardAtoms';
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

const ProjectCardComponent: FC<ProjectCardProps> = ({ item, featured = false }) => {
  const accentColor = getAccentColorVar(typeAccentVar(item.type));
  const visualSpec = resolveCardVisualSpec(toProjectCardVisualInput(item));
  const tint = (intensity: number) =>
    `color-mix(in oklab, var(--card-accent) ${intensity}%, transparent)`;
  const isMultiLink = (item.links?.length ?? 0) > 2;
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
        item.links?.length ? (
          <div className={cn('flex w-full', isMultiLink ? 'flex-col gap-2' : 'flex-row gap-2.5')}>
            {item.links.map((l, idx) => {
              const isExternal = !l.href.startsWith('/');
              const Icon = getLinkIcon(l.label);
              return (
                <a
                  key={`${l.href}-${idx}`}
                  href={l.href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'group/link inline-flex items-center gap-2.5 rounded-xl border px-4 text-[color:var(--card-accent)] transition-[transform,border-color,background-color,color,box-shadow] duration-200 hover:-translate-y-0.5 hover:text-white',
                    isMultiLink
                      ? 'w-full justify-start py-2.5 text-sm'
                      : 'flex-1 justify-center py-3 text-sm'
                  )}
                  style={{
                    borderColor: tint(24),
                    background: `linear-gradient(180deg, ${tint(10)}, ${tint(4)})`,
                    boxShadow: `inset 0 1px 0 ${tint(10)}`,
                  }}
                  aria-label={l.label}
                >
                  <Icon
                    size={16}
                    aria-hidden="true"
                    className="flex-shrink-0 transition-transform duration-200 group-hover/link:scale-110"
                  />
                  <span className="font-semibold tracking-[0.02em]">{l.label}</span>
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
            })}
          </div>
        ) : null
      }
    >
      <div className="flex h-full flex-col">
        <div className="flex w-full items-center justify-between gap-3">
          {featured ? (
            <div className="type-micro flex flex-wrap items-center gap-1.5 font-semibold tracking-[0.28em] text-white/48 uppercase">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  background: 'color-mix(in oklab, var(--card-accent) 72%, white)',
                  boxShadow: `0 0 0 6px ${tint(12)}`,
                }}
              />
              <span>Project</span>
              {item.type ? (
                <>
                  <span className="text-white/24">•</span>
                  <span style={{ color: 'var(--card-accent)' }}>{toTitleCase(item.type)}</span>
                </>
              ) : null}
              {item.year ? (
                <>
                  <span className="text-white/24">•</span>
                  <span>{item.year}</span>
                </>
              ) : null}
            </div>
          ) : (
            <>
              <div className="type-micro flex flex-wrap items-center gap-1.5 font-semibold tracking-[0.28em] text-white/48 uppercase">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{
                    background: 'color-mix(in oklab, var(--card-accent) 72%, white)',
                    boxShadow: `0 0 0 6px ${tint(12)}`,
                  }}
                />
                <span>Project</span>
                {item.year ? (
                  <>
                    <span className="text-white/24">•</span>
                    <span>{item.year}</span>
                  </>
                ) : null}
              </div>
              {item.type ? (
                <Badge
                  className="type-caption inline-flex items-center gap-1.5 rounded-full border-0 px-3 py-1 font-medium whitespace-nowrap md:text-xs"
                  style={{
                    color: 'var(--card-accent)',
                    background: tint(10),
                  }}
                  title={item.type}
                >
                  {toTitleCase(item.type)}
                </Badge>
              ) : null}
            </>
          )}
        </div>

        <div className="mt-5 flex flex-1 flex-col gap-5">
          <div className="space-y-3">
            <h3 className="type-featured-card-title max-w-[16ch] leading-[1.02] font-semibold tracking-[-0.045em] text-balance text-white">
              {item.title}
            </h3>
            {featured && (
              <div
                className="h-px w-full"
                style={{
                  background: 'linear-gradient(90deg, var(--card-accent), transparent)',
                }}
              />
            )}
            {item.summary ? (
              <p className="max-w-[30ch] text-base leading-[1.72] text-[color:var(--white)]/78 md:text-base">
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

          <div className="mt-auto flex flex-col gap-3">
            <CardTagList tags={item.tags} tone="muted" />
          </div>
        </div>
      </div>
    </MediaContentCard>
  );
};

// Memoize the component with custom comparison
export const ProjectCard = memo(ProjectCardComponent, (prevProps, nextProps) => {
  return prevProps.item === nextProps.item && prevProps.featured === nextProps.featured;
});

ProjectCard.displayName = 'ProjectCard';
export default ProjectCard;
