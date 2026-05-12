import { ArrowUpRight, CalendarDays, ExternalLink, Star, Users } from 'lucide-react';
import { memo, type FC } from 'react';
import { Badge } from '@/components/ui/core/badge';
import AuroraCardShell from './AuroraCardShell';
import { getAccentColorVar } from '@/lib/utils';
import { resolveCardVisualSpec, toProjectCardVisualInput } from '@/lib/card-visual';
import type { Project } from '@/types';
import CardVisualPanel from './CardVisualPanel';

function toTitleCase(input?: string) {
  if (!input) return '';
  return input.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1));
}

function typeAccentVar(_type?: string) {
  return 'var(--accent)';
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
  return (
    <AuroraCardShell
      accent={accentColor}
      featured={featured}
      className="project-card h-full"
      bodyClassName="flex flex-1 flex-col px-5 py-5 md:px-6 md:py-6 lg:px-7 lg:py-7"
      footer={
        item.links?.length ? (
          <div className="flex flex-wrap gap-2.5 text-[11px] text-white/80 md:text-xs">
            {item.links.map((l, idx) => {
              const isExternal = !l.href.startsWith('/');
              return (
                <a
                  key={`${l.href}-${idx}`}
                  href={l.href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="group/link inline-flex min-w-[8.5rem] flex-1 items-center justify-between gap-2 rounded-full border px-4 py-3 text-[color:var(--card-accent)]/88 transition-[transform,border-color,background-color,color,box-shadow] duration-200 hover:-translate-y-0.5 hover:text-[color:var(--card-accent)]"
                  style={{
                    borderColor: tint(48),
                    background: `linear-gradient(180deg, ${tint(12)}, ${tint(6)})`,
                    boxShadow: `inset 0 1px 0 ${tint(12)}`,
                  }}
                  aria-label={l.label}
                >
                  <span className="font-medium tracking-[0.01em]">{l.label}</span>
                  <span
                    title={isExternal ? 'External link' : 'Internal link'}
                    className="icon-bounce text-[color:var(--card-accent)] transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                  >
                    {isExternal ? (
                      <ExternalLink size={14} aria-hidden="true" />
                    ) : (
                      <ArrowUpRight size={14} aria-hidden="true" />
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
        <CardVisualPanel spec={visualSpec} />

        <div className="flex items-start justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.28em] text-white/48 uppercase">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{
                background: 'color-mix(in oklab, var(--card-accent) 72%, white)',
                boxShadow: `0 0 0 6px ${tint(12)}`,
              }}
            />
            Project
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 text-[11px] md:text-xs">
            {item.type ? (
              <Badge
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium whitespace-nowrap md:text-xs"
                style={{
                  color: 'var(--card-accent)',
                  borderColor: tint(52),
                  background: `linear-gradient(180deg, ${tint(14)}, ${tint(8)})`,
                }}
                title={item.type}
              >
                <Star size={12} aria-hidden="true" className="icon-bounce" />
                {toTitleCase(item.type)}
              </Badge>
            ) : null}
            {item.year ? (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium md:text-xs"
                style={{
                  color: 'var(--card-accent)',
                  background: `linear-gradient(180deg, ${tint(12)}, ${tint(7)})`,
                  border: `1px solid ${tint(42)}`,
                }}
              >
                <CalendarDays size={12} aria-hidden="true" className="icon-bounce" />
                <span>{item.year}</span>
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-5 flex flex-1 flex-col gap-5">
          <div className="space-y-3">
            <h3 className="max-w-[16ch] text-[1.95rem] leading-[1.02] font-semibold tracking-[-0.045em] text-balance text-white">
              {item.title}
            </h3>
            {item.summary ? (
              <p className="max-w-[30ch] text-[1rem] leading-[1.72] text-[color:var(--white)]/78 md:text-[1.02rem]">
                {item.summary}
              </p>
            ) : null}
          </div>

          {item.role || item.collaborators ? (
            <div
              className="grid gap-2 rounded-[1.2rem] border px-3 py-3"
              style={{
                borderColor: tint(18),
                background: `linear-gradient(180deg, ${tint(8)}, transparent)`,
              }}
            >
              {item.role ? (
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ background: tint(12), color: 'var(--card-accent)' }}
                  >
                    <Star size={13} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold tracking-[0.24em] text-white/42 uppercase">
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
                    <p className="text-[10px] font-semibold tracking-[0.24em] text-white/42 uppercase">
                      Collaborators
                    </p>
                    <p className="text-sm leading-relaxed text-white/78">{item.collaborators}</p>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-auto flex flex-col gap-3">
            {item.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {item.tags.map(t => (
                  <Badge
                    key={t}
                    className="rounded-full border px-3 py-1 text-[11px] font-medium text-white/70 md:text-xs"
                    variant="outline"
                    style={{
                      borderColor: tint(20),
                      background: tint(6),
                    }}
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            ) : null}
            <div
              className="h-px w-full"
              style={{
                background: `linear-gradient(90deg, ${tint(32)}, transparent 85%)`,
              }}
            />
          </div>
        </div>
      </div>
    </AuroraCardShell>
  );
};

// Memoize the component with custom comparison
export const ProjectCard = memo(ProjectCardComponent, (prevProps, nextProps) => {
  return prevProps.item === nextProps.item && prevProps.featured === nextProps.featured;
});

ProjectCard.displayName = 'ProjectCard';
export default ProjectCard;
