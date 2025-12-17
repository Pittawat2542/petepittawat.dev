import { Building2, Calendar, ExternalLink } from 'lucide-react';

import type { FC } from 'react';
import { memo } from 'react';

interface ServiceItem {
  readonly venue: string;
  readonly year?: number;
  readonly years?: readonly number[];
  readonly url?: string;
  readonly links?: readonly { readonly year: number; readonly url: string }[];
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

const formatYears = (item: ServiceItem): string => {
  const years = item.years ?? item.links?.map(link => link.year);

  if (Array.isArray(years) && years.length > 0) {
    const uniqueYears = Array.from(new Set(years));
    return uniqueYears.sort((a, b) => a - b).join(' | ');
  }

  return item.year ? String(item.year) : '';
};

const getItemUrl = (item: ServiceItem): string | undefined => {
  if (item.links && item.links.length > 0) {
    const sortedLinks = [...item.links].sort((a, b) => b.year - a.year);
    return sortedLinks[0]?.url;
  }

  return item.url;
};

const AcademicServicesComponent: FC<AcademicServicesProps> = ({ data }) => {
  const sections = data.sections || [];

  if (sections.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <div className="glass-card shape-squircle rounded-2xl p-5 md:p-6">
        <header className="mb-4 md:mb-6">
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight md:text-2xl">
            <Building2 size={18} aria-hidden="true" />
            Academic Services
          </h2>
          <p className="mt-1 text-sm text-[color:var(--white)]/70">
            Reviewer and service roles across conferences and journals.
          </p>
        </header>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {sections.map(sec => (
            <div key={sec.type} className="space-y-3">
              <h3 className="text-sm font-semibold tracking-wide text-[color:var(--white)]/80 uppercase">
                {sec.label || sec.type}
              </h3>
              <ul className="flex flex-col gap-2">
                {sec.items.map(item => {
                  const yearDisplay = formatYears(item);
                  const itemKey = `${item.venue}-${yearDisplay || 'n/a'}`;

                  const href = getItemUrl(item);

                  return (
                    <li key={itemKey}>
                      <a
                        href={href || '#'}
                        target={href ? '_blank' : undefined}
                        rel={href ? 'noreferrer' : undefined}
                        className="group glass-surface shape-squircle-sm inline-flex w-full items-center justify-between rounded-xl px-3 py-2 ring-1 ring-[color:var(--white)]/10 transition-[transform,box-shadow,border-color,background-color] duration-150 ease-out will-change-transform hover:-translate-y-0.5 hover:ring-[color:var(--accent-publications)]/50"
                        style={{
                          color: 'var(--white)',
                          background:
                            'color-mix(in oklab, var(--accent-publications) 6%, transparent)',
                        }}
                        aria-label={`${item.venue} ${yearDisplay}${href ? ' (opens in new tab)' : ''}`}
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="shape-squircle-sm inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[color:var(--accent-publications)]/20 text-[color:var(--accent-publications)] ring-1 ring-[color:var(--accent-publications)]/30">
                            <Building2 size={14} aria-hidden="true" />
                          </span>
                          <span className="truncate font-medium">{item.venue}</span>
                        </div>
                        <div className="ml-3 flex shrink-0 items-center gap-2 text-xs text-[color:var(--white)]/80">
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
