import { ArrowUpRight, CalendarDays, ExternalLink, Star, Users } from 'lucide-react';
import { memo, type FC } from 'react';
import { BlogCardOverlays } from '@/components/ui/blog/BlogCardOverlays';
import { Badge } from '@/components/ui/core/badge';
import { cn, createAccentStyle, getAccentColorVar } from '@/lib/utils';
import type { Project } from '@/types';

function toTitleCase(input?: string) {
  if (!input) return '';
  return input.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1));
}

function typeAccentVar(type?: string) {
  const key = (type ?? '').toLowerCase();
  switch (key) {
    case 'research':
      return 'var(--accent-publications)';
    case 'tutorial':
      return 'var(--accent-talks)';
    case 'side project':
      return 'var(--accent-projects)';
    case 'initiative':
      return 'var(--accent)';
    case 'leadership':
      return 'var(--accent-about)';
    case 'class project':
      return 'var(--accent-blog)';
    case 'group project':
      return 'var(--accent)';
    case 'senior project':
      return 'var(--accent-about)';
    case 'freelance':
      return 'var(--accent-2)';
    case 'extracurricular':
      return 'var(--white)';
    default:
      return 'var(--accent-projects)';
  }
}

interface ProjectCardProps {
  readonly item: Project;
  readonly featured?: boolean;
}

const ProjectCardComponent: FC<ProjectCardProps> = ({ item, featured = false }) => {
  const accentColor = getAccentColorVar(typeAccentVar(item.type));
  const tint = (intensity: number) =>
    `color-mix(in oklab, var(--card-accent) ${intensity}%, transparent)`;
  const cardStyle = createAccentStyle(accentColor);
  return (
    <article
      className={cn(
        'aurora-card group project-card flex h-full flex-col',
        featured && 'aurora-card--featured'
      )}
      style={cardStyle}
    >
      <BlogCardOverlays accent={accentColor} />
      <div className="aurora-card__body flex flex-1 flex-col gap-4 px-5 py-5 md:gap-5 md:px-6 md:py-6 lg:px-7 lg:py-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between md:gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base leading-snug font-semibold break-words md:text-lg">
              {item.title}
            </h3>
            {item.summary ? (
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--white)]/82 lg:text-base">
                {item.summary}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] md:text-xs lg:text-sm">
            {item.type ? (
              <Badge
                className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium whitespace-nowrap md:text-xs"
                style={{
                  color: 'var(--card-accent)',
                  borderColor: tint(55),
                  background: tint(14),
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
                  background: tint(12),
                  border: `1px solid ${tint(45)}`,
                }}
              >
                <CalendarDays size={12} aria-hidden="true" className="icon-bounce" />
                <span>{item.year}</span>
              </span>
            ) : null}
          </div>
        </div>

        {item.role || item.collaborators ? (
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[color:var(--white)]/75 md:text-xs lg:text-sm">
            {item.role ? (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] md:text-xs"
                style={{
                  color: 'var(--card-accent)',
                  background: tint(10),
                  border: `1px solid ${tint(35)}`,
                }}
              >
                <Users size={12} className="icon-bounce" aria-hidden="true" />
                <span>{item.role}</span>
              </span>
            ) : null}
            {item.collaborators ? (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] md:text-xs"
                style={{
                  color: 'var(--card-accent)',
                  background: tint(10),
                  border: `1px solid ${tint(35)}`,
                }}
              >
                <Users size={12} className="icon-bounce" aria-hidden="true" />
                <span
                  className="max-w-[14rem] truncate md:max-w-[18rem]"
                  title={item.collaborators}
                >
                  {item.collaborators}
                </span>
              </span>
            ) : null}
          </div>
        ) : null}

        {item.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {item.tags.map(t => (
              <Badge key={t} className="text-[11px] md:text-xs" variant="outline">
                {t}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      {item.links?.length ? (
        <div className="aurora-card__footer flex flex-wrap items-center gap-2 text-[11px] text-white/80 md:text-xs">
          {item.links.map((l, idx) => {
            const isExternal = !l.href.startsWith('/');
            return (
              <a
                key={`${l.href}-${idx}`}
                href={l.href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="aurora-chip aurora-chip--pill text-[color:var(--card-accent)]/85 transition-colors duration-150 hover:text-[color:var(--card-accent)]"
                aria-label={l.label}
              >
                <span>{l.label}</span>
                <span
                  title={isExternal ? 'External link' : 'Internal link'}
                  className="icon-bounce text-[color:var(--card-accent)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
      ) : null}
    </article>
  );
};

// Memoize the component with custom comparison
export const ProjectCard = memo(ProjectCardComponent, (prevProps, nextProps) => {
  return prevProps.item === nextProps.item && prevProps.featured === nextProps.featured;
});

ProjectCard.displayName = 'ProjectCard';
export default ProjectCard;
