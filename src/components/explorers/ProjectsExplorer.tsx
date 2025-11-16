/**
 * ProjectsExplorer - Projects list display
 * Refactored to use generic DataExplorer component (DRY principle)
 */

import type { FC } from 'react';
import type { Project } from '@/types';
import ProjectCard from '@/components/ui/cards/ProjectCard';
import { DataExplorer } from './DataExplorer';
import { slugify } from '@/lib/slug';

interface ProjectsExplorerProps {
  readonly items: readonly Project[];
}

type ProjectSort = 'newest' | 'oldest' | 'title-az' | 'title-za';

const comparators: Record<ProjectSort, (a: Project, b: Project) => number> = {
  newest: (a, b) => b.year - a.year || a.title.localeCompare(b.title),
  oldest: (a, b) => a.year - b.year || a.title.localeCompare(b.title),
  'title-az': (a, b) => a.title.localeCompare(b.title),
  'title-za': (a, b) => b.title.localeCompare(a.title),
};

const ProjectsExplorerComponent: FC<ProjectsExplorerProps> = ({ items }) => {
  return (
    <DataExplorer<Project, ProjectSort>
      items={items}
      searchFields={item => [item.title, item.summary, item.collaborators ?? '', item.role ?? '']}
      filterFields={{
        year: item => item.year.toString(),
        tag: item => item.tags,
        type: item => item.type ?? 'other',
      }}
      sortComparators={comparators}
      sortOptions={[
        { value: 'newest', label: 'Newest' },
        { value: 'oldest', label: 'Oldest' },
        { value: 'title-az', label: 'Title A→Z' },
        { value: 'title-za', label: 'Title Z→A' },
      ]}
      defaultSort="newest"
      renderItem={item => <ProjectCard item={item} />}
      getItemKey={item => `${item.title}-${item.year}`}
      getItemId={item => `project-${slugify(item.title)}-${item.year}`}
      searchPlaceholder="Search title, summary, collaborators..."
      hashPrefix="project-"
      perPage={6}
      emptyMessage="No results."
    />
  );
};

export default ProjectsExplorerComponent;
