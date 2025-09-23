import { ArrowUpRight, CalendarDays, ExternalLink, Star, Users } from 'lucide-react';
import { memo } from 'react';

import { Badge } from '@/components/ui/core/badge';
import { Card } from '@/components/ui/core/card';
import type { FC } from 'react';
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
  const accentColor = typeAccentVar(item.type);
  const tint = (intensity: number) =>
    `color-mix(in oklab, ${accentColor} ${intensity}%, transparent)`;
  return (
    <Card
      className={[
        `glass-entry group project-card flex h-full flex-col rounded-3xl p-0`,
        featured ? 'card-featured' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="glass-entry__glow" />
      <div className="glass-entry__content flex flex-1 flex-col gap-5 p-6 md:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="text-base leading-snug font-semibold break-words md:text-lg">
              {item.title}
            </h3>
            {item.summary ? (
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--white)]/82">
                {item.summary}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] md:text-xs">
            {item.type ? (
              <Badge
                className="inline-flex items-center gap-1.5 px-3 py-1 font-medium whitespace-nowrap"
                style={{
                  color: accentColor,
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
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium"
                style={{
                  color: accentColor,
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
          <div className="flex flex-wrap items-center gap-2 text-xs text-[color:var(--white)]/75 md:text-sm">
            {item.role ? (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
                style={{
                  color: accentColor,
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
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
                style={{
                  color: accentColor,
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
              <Badge key={t} className="text-xs" variant="outline">
                {t}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      {item.links?.length ? (
        <div className="glass-entry__footer mt-auto flex flex-wrap items-center gap-2 px-6 py-3.5 text-xs text-white/78 md:px-7 md:py-4">
          {item.links.map((l, idx) => {
            const isExternal = !l.href.startsWith('/');
            return (
              <a
                key={`${l.href}-${idx}`}
                href={l.href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-[background-color,color,border-color,transform] duration-200 ease-out will-change-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[color:var(--white)]/20 focus-visible:outline-none"
                style={{
                  color: accentColor,
                  background: tint(14),
                  border: `1px solid ${tint(45)}`,
                  boxShadow: `0 10px 22px -14px ${accentColor}`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = tint(22);
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = tint(14);
                }}
                aria-label={l.label}
              >
                <span>{l.label}</span>
                <span
                  title={isExternal ? 'External link' : 'Internal link'}
                  className="icon-bounce transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
    </Card>
  );
};

// Memoize the component with custom comparison
export const ProjectCard = memo(ProjectCardComponent, (prevProps, nextProps) => {
  return prevProps.item === nextProps.item && prevProps.featured === nextProps.featured;
});

ProjectCard.displayName = 'ProjectCard';
export default ProjectCard;
