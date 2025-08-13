import type { Project } from '../../types';
import { Card } from './card';
import { Badge } from './badge';
import { ExternalLink, ArrowUpRight } from 'lucide-react';

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
  return (
    <Card className={`p-4 md:p-5 h-full flex flex-col hover-card ${featured ? 'card-featured' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base md:text-lg font-semibold leading-snug">
          {item.title}
        </h3>
        <div className="flex items-center gap-2">
          {item.type ? (
            <Badge
              className="text-xs whitespace-nowrap"
              style={{
                color: typeAccentVar(item.type),
                borderColor: `color-mix(in oklab, ${typeAccentVar(item.type)} 55%, transparent)`,
                background: `color-mix(in oklab, ${typeAccentVar(item.type)} 12%, transparent)`
              }}
              title={item.type}
            >
              {toTitleCase(item.type)}
            </Badge>
          ) : null}
          <Badge className="text-xs whitespace-nowrap" variant="outline">{item.year}</Badge>
        </div>
      </div>
      {item.role || item.collaborators ? (
        <p className="mt-1 text-xs md:text-sm text-[color:var(--white)]/70">
          {item.role ? <span className="mr-2">{item.role}</span> : null}
          {item.collaborators ? <span className="opacity-80">• {item.collaborators}</span> : null}
        </p>
      ) : null}
      <p className="mt-3 text-sm text-[color:var(--white)]/85">{item.summary}</p>
      {item.tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {item.tags.map((t) => (
            <Badge key={t} className="text-xs" variant="outline">{t}</Badge>
          ))}
        </div>
      ) : null}
      {item.links?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.links.map((l) => {
            const accent = typeAccentVar(item.type);
            const isExternal = !l.href.startsWith('/');
            return (
              <a
                key={l.href}
                href={l.href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noreferrer' : undefined}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2"
                style={{
                  color: accent,
                  background: `color-mix(in oklab, ${accent} 14%, transparent)`,
                  border: `1px solid color-mix(in oklab, ${accent} 45%, transparent)`,
                  boxShadow: `0 6px 18px -10px ${accent}`
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = `color-mix(in oklab, ${accent} 22%, transparent)`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = `color-mix(in oklab, ${accent} 14%, transparent)`;
                }}
                aria-label={l.label}
              >
                <span title={isExternal ? "External link" : "Internal link"} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
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
