import { Building2, Calendar, ExternalLink } from 'lucide-react';

type ServiceItem = {
  venue: string;
  year?: number;
  years?: number[];
  url?: string;
};

type Section = {
  type: 'conferences' | 'journals' | string;
  label?: string;
  items: ServiceItem[];
};

type Props = {
  data: { sections: Section[] };
};

export default function AcademicServices({ data }: Props) {
  const sections = data.sections || [];
  return (
    <section className="mt-10">
      <div className="glass-card rounded-2xl p-5 md:p-6">
        <header className="mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
            <Building2 size={18} />
            Academic Services
          </h2>
          <p className="text-sm text-[color:var(--white)]/70 mt-1">
            Reviewer and service roles across conferences and journals.
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((sec) => (
            <div key={sec.type} className="space-y-3">
              <h3 className="text-sm font-semibold text-[color:var(--white)]/80 uppercase tracking-wide">
                {sec.label || sec.type}
              </h3>
              <ul className="flex flex-col gap-2">
                {sec.items.map((it) => (
                  <li key={`${it.venue}-${(it.year ?? it.years?.join('-')) ?? ''}`}>
                    <a
                      href={it.url || '#'}
                      target={it.url ? '_blank' : undefined}
                      rel={it.url ? 'noreferrer' : undefined}
                      className="group inline-flex items-center justify-between w-full rounded-xl px-3 py-2 ring-1 ring-[color:var(--white)]/10 hover:ring-[color:var(--accent-publications)]/50 transition-all glass-surface"
                      style={{
                        color: 'var(--white)',
                        background: 'color-mix(in oklab, var(--accent-publications) 6%, transparent)'
                      }}
                    >
                      <div className="min-w-0 flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[color:var(--accent-publications)]/20 ring-1 ring-[color:var(--accent-publications)]/30 text-[color:var(--accent-publications)]">
                          <Building2 size={14} />
                        </span>
                        <span className="truncate font-medium">{it.venue}</span>
                      </div>
                      <div className="shrink-0 ml-3 flex items-center gap-2 text-xs text-[color:var(--white)]/80">
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 ring-1 ring-[color:var(--white)]/15">
                          <Calendar size={12} />
                          <span>{it.year ?? (it.years ? it.years.join(' | ') : '')}</span>
                        </span>
                        {it.url && <ExternalLink size={14} className="opacity-70 group-hover:opacity-100" />}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
