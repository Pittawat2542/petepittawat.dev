/**
 * PublicationsExplorer - Publications list display
 * Refactored to use generic DataExplorer component (DRY principle)
 */

import type { FC } from 'react';
import type { Publication } from '@/types';
import { PublicationCard } from '@/components/ui/publication';
import { DataExplorer } from './DataExplorer';
import { slugify } from '@/lib/slug';

interface PublicationsExplorerProps {
  readonly items: readonly Publication[];
}

type PublicationSort = 'newest' | 'oldest' | 'title-az' | 'title-za';

const comparators: Record<PublicationSort, (a: Publication, b: Publication) => number> = {
  newest: (a, b) => b.year - a.year || a.title.localeCompare(b.title),
  oldest: (a, b) => a.year - b.year || a.title.localeCompare(b.title),
  'title-az': (a, b) => a.title.localeCompare(b.title),
  'title-za': (a, b) => b.title.localeCompare(a.title),
};

const PublicationsExplorerComponent: FC<PublicationsExplorerProps> = ({ items }) => {
  return (
    <DataExplorer<Publication, PublicationSort>
      items={items}
      searchFields={item => [item.title, item.venue, item.authors]}
      filterFields={{
        year: item => item.year.toString(),
        tag: item => item.tags,
        type: item => item.type,
      }}
      sortComparators={comparators}
      sortOptions={[
        { value: 'newest', label: 'Newest' },
        { value: 'oldest', label: 'Oldest' },
        { value: 'title-az', label: 'Title A→Z' },
        { value: 'title-za', label: 'Title Z→A' },
      ]}
      defaultSort="newest"
      renderItem={item => <PublicationCard item={item} />}
      getItemKey={item => `${item.title}-${item.year}`}
      getItemId={item => `publication-${slugify(item.title)}-${item.year}`}
      searchPlaceholder="Search title, venue, authors..."
      hashPrefix="publication-"
      perPage={6}
      emptyMessage="No results."
    />
  );
};

export default PublicationsExplorerComponent;
