import Filter from './Filter';
import type { Project } from '../types';
import ProjectCard from './ui/ProjectCard';
import { useDataFilter } from '../lib/hooks';

type Props = { items: Project[] };

export default function ProjectsExplorer({ items }: Props) {
  const { q, setQ, filters, setFilters, filtered, filterOptions } = useDataFilter(items, {
    searchFields: (item) => [item.title, item.summary, item.collaborators ?? '', item.role ?? ''],
    filterFields: {
      year: (item) => item.year.toString(),
      tag: (item) => item.tags,
      type: (item) => item.type ?? 'other',
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <Filter
        q={q}
        setQ={setQ}
        filters={filters}
        setFilters={setFilters}
        filterOptions={filterOptions}
        placeholder="Search title, summary, collaborators..."
        filteredCount={filtered.length}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered
          .slice()
          .sort((a, b) => b.year - a.year)
          .map((item, i) => (
            <div key={`${item.title}-${item.year}`} className="stagger-fade-in" style={{ animationDelay: `${Math.min(i * 100, 800)}ms` }}>
              <ProjectCard item={item} />
            </div>
          ))}
        {!filtered.length && (
          <p className="text-sm text-[color:var(--white)]/60">No results.</p>
        )}
      </div>
    </div>
  );
}
