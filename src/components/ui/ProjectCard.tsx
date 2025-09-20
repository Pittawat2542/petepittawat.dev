import { ArrowUpRight, Calendar, ExternalLink, Star, Users } from 'lucide-react';

import { Badge } from './badge';
import { Card } from './card';
import type { Project } from '../../types';

function toTitleCase(input?: string) {
  if (!input) return '';
  return input.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));
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

export default function ProjectCard({ item, featured = false }: { item: Project; featured?: boolean }) {
  const accentColor = typeAccentVar(item.type);
  return (
    <Card className={`glass-entry group project-card ${featured ? 'card-featured' : ''} p-0 h-full flex flex-col`}>
      <div className="glass-entry__glow" />
      <div className="glass-entry__content flex flex-col gap-4 p-5 md:p-6 flex-1">
        <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <h3 className="text-base md:text-lg font-semibold leading-snug flex-1">
            {item.title}
          </h3>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {item.type ? (
            <Badge
              className="text-xs whitespace-nowrap inline-flex items-center gap-1"
              style={{
                color: typeAccentVar(item.type),
                borderColor: `color-mix(in oklab, ${typeAccentVar(item.type)} 55%, transparent)`,
                background: `color-mix(in oklab, ${typeAccentVar(item.type)} 12%, transparent)`
              }}
              title={item.type}
            >
              <Star size={10} aria-hidden="true" className="icon-bounce" />
              {toTitleCase(item.type)}
            </Badge>
          ) : null}
          <Badge className="text-xs whitespace-nowrap inline-flex items-center gap-1" variant="outline">
            <Calendar size={10} aria-hidden="true" className="icon-bounce" />
            {item.year}
          </Badge>
        </div>
      </div>
      {item.role || item.collaborators ? (
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs md:text-sm text-[color:var(--white)]/70">
          {item.role ? (
            <div className="flex items-center gap-1.5">
              <Users size={12} className="text-[color:var(--accent)]/70 icon-bounce" aria-hidden="true" />
              <span>{item.role}</span>
            </div>
          ) : null}
          {item.collaborators ? (
            <div className="flex items-center gap-1.5">
              <Users size={12} className="text-[color:var(--accent)]/70 icon-bounce" aria-hidden="true" />
              <span className="opacity-80">{item.collaborators}</span>
            </div>
          ) : null}
        </div>
      ) : null}
      <p className="text-sm text-[color:var(--white)]/82 leading-relaxed">{item.summary}</p>
      {item.tags?.length ? (
        <div className="flex flex-wrap gap-2">
          {item.tags.map((t) => (
            <Badge key={t} className="text-xs" variant="outline">{t}</Badge>
          ))}
        </div>
      ) : null}
      </div>
      {item.links?.length ? (
        <div className="glass-entry__footer mt-auto flex flex-wrap items-center gap-2 px-5 py-3 md:px-6 md:py-4 text-sm text-white/78">
          {item.links.map((l, idx) => {
            const isExternal = !l.href.startsWith('/');
            return (
              <a
                key={`${l.href}-${idx}`}
                href={l.href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-[background-color,color,border-color,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--white)]/20 will-change-transform hover:-translate-y-0.5"
                style={{
                  color: accentColor,
                  background: `color-mix(in oklab, ${accentColor} 12%, transparent)`,
                  border: `1px solid color-mix(in oklab, ${accentColor} 38%, transparent)`,
                  boxShadow: `0 10px 22px -14px ${accentColor}`
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = `color-mix(in oklab, ${accentColor} 22%, transparent)`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = `color-mix(in oklab, ${accentColor} 12%, transparent)`;
                }}
                aria-label={l.label}
              >
                <span title={isExternal ? "External link" : "Internal link"} className="icon-bounce transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  {isExternal ? <ExternalLink size={14} aria-hidden="true" /> : <ArrowUpRight size={14} aria-hidden="true" />}
                </span>
                <span>{l.label}</span>
              </a>
            );
          })}
        </div>
      ) : null}
    </Card>
  );
}
