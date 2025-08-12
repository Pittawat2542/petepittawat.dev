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
  return (
    <article className={`glass-card p-4 md:p-5 h-full flex flex-col ${featured ? 'card-featured' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base md:text-lg font-semibold leading-snug">
          {item.title}
        </h3>
        <div className="flex items-center gap-2">
          {item.type ? (
            <span
              className="glass-chip text-xs whitespace-nowrap"
              style={{
                color: typeAccentVar(item.type),
                borderColor: `color-mix(in oklab, ${typeAccentVar(item.type)} 55%, transparent)`,
                background: `color-mix(in oklab, ${typeAccentVar(item.type)} 12%, transparent)`
              }}
              title={item.type}
            >
              {toTitleCase(item.type)}
            </span>
          ) : null}
          <span className="glass-chip text-xs whitespace-nowrap">{item.year}</span>
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
            <span key={t} className="glass-chip text-xs">{t}</span>
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
                <span>{l.label}</span>
                {isExternal ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <path d="M15 3h6v6"></path>
                    <path d="M10 14 21 3"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 18v-6h6"></path>
                    <path d="M21 21 14 14"></path>
                    <path d="M3 3h7v7H3z"></path>
                  </svg>
                )}
              </a>
            );
          })}
        </div>
      ) : null}
    </article>
  );
}
