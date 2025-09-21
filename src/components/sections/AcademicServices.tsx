import { Building2, Calendar, ExternalLink } from 'lucide-react';

import type { FC } from 'react';
import { memo } from 'react';

interface ServiceItem {
  readonly venue: string;
  readonly year?: number;
  readonly years?: readonly number[];
  readonly url?: string;
}

interface Section {
  readonly type: 'conferences' | 'journals' | string;
  readonly label?: string;
  readonly items: readonly ServiceItem[];
}

interface AcademicServicesProps {
  readonly data: {
    readonly sections: readonly Section[];
  };
}

const AcademicServicesComponent: FC<AcademicServicesProps> = ({ data }) => {
  const sections = data.sections || [];
  
  if (sections.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <div className="glass-card rounded-2xl p-5 md:p-6">
        <header className="mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
            <Building2 size={18} aria-hidden="true" />
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
                {sec.items.map((item) => {
                  const yearDisplay = item.year ?? (item.years ? item.years.join(' | ') : '');
                  const itemKey = `${item.venue}-${yearDisplay}`;
                  
                  return (
                    <li key={itemKey}>
                      <a
                        href={item.url || '#'}
                        target={item.url ? '_blank' : undefined}
                        rel={item.url ? 'noreferrer' : undefined}
                        className="group inline-flex items-center justify-between w-full rounded-xl px-3 py-2 ring-1 ring-[color:var(--white)]/10 hover:ring-[color:var(--accent-publications)]/50 transition-[transform,box-shadow,border-color,background-color] duration-150 ease-out will-change-transform hover:-translate-y-0.5 glass-surface"
                        style={{
                          color: 'var(--white)',
                          background: 'color-mix(in oklab, var(--accent-publications) 6%, transparent)'
                        }}
                        aria-label={`${item.venue} ${yearDisplay}${item.url ? ' (opens in new tab)' : ''}`}
                      >
                        <div className="min-w-0 flex items-center gap-2">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[color:var(--accent-publications)]/20 ring-1 ring-[color:var(--accent-publications)]/30 text-[color:var(--accent-publications)]">
                            <Building2 size={14} aria-hidden="true" />
                          </span>
                          <span className="truncate font-medium">{item.venue}</span>
                        </div>
                        <div className="shrink-0 ml-3 flex items-center gap-2 text-xs text-[color:var(--white)]/80">
                          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 ring-1 ring-[color:var(--white)]/15">
                            <Calendar size={12} aria-hidden="true" />
                            <span>{yearDisplay}</span>
                          </span>
                          {item.url && (
                            <ExternalLink 
                              size={14} 
                              className="opacity-70 group-hover:opacity-100" 
                              aria-hidden="true" 
                            />
                          )}
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Memoized component for performance optimization
export const AcademicServices = memo(AcademicServicesComponent);
AcademicServices.displayName = 'AcademicServices';

// Default export for backward compatibility
export default AcademicServices;
