import type { FC } from 'react';
import type { Project } from '@/types';
import ProjectCard from '@/components/ui/cards/ProjectCard';
import { EditorialExplorer } from './EditorialExplorer';
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
    <EditorialExplorer<Project, ProjectSort>
      items={items}
      searchFields={item => [item.title, item.summary, item.collaborators ?? '', item.role ?? '']}
      filterFields={{
        year: item => item.year.toString(),
        type: item => item.type ?? 'other',
      }}
      tagField={item => item.tags}
      sortComparators={comparators}
      sortOptions={[
        { value: 'newest', label: 'Newest' },
        { value: 'oldest', label: 'Oldest' },
        { value: 'title-az', label: 'Title A→Z' },
        { value: 'title-za', label: 'Title Z→A' },
      ]}
      defaultSort="newest"
      renderItem={item => <ProjectCard item={item} />}
      renderFeaturedItem={item => <ProjectCard item={item} featured />}
      getItemKey={item => `${item.title}-${item.year}`}
      getItemId={item => `project-${slugify(item.title)}-${item.year}`}
      searchPlaceholder="Search title, summary, collaborators..."
      hashPrefix="project-"
      featuredLabel="Featured project"
      gridLabel="Projects"
      emptyTitle="No matching projects"
      emptyCopy="Try a broader search, remove a tag, or reset the year and type filters."
    />
  );
};

export default ProjectsExplorerComponent;
