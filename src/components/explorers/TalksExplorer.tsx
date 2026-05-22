import { memo } from 'react';
import type { FC } from 'react';
import type { Talk } from '@/types';
import TalkCard from '@/components/ui/cards/TalkCard';
import { EditorialExplorer } from './EditorialExplorer';
import { slugify } from '@/lib/slug';

interface TalksExplorerProps {
  readonly items: readonly Talk[];
}

type TalkSort = 'newest' | 'oldest' | 'title-az' | 'title-za';

const comparators: Record<TalkSort, (a: Talk, b: Talk) => number> = {
  newest: (a, b) => +new Date(b.date) - +new Date(a.date) || a.title.localeCompare(b.title),
  oldest: (a, b) => +new Date(a.date) - +new Date(b.date) || a.title.localeCompare(b.title),
  'title-az': (a, b) => a.title.localeCompare(b.title),
  'title-za': (a, b) => b.title.localeCompare(a.title),
};

const TalksExplorerComponent: FC<TalksExplorerProps> = ({ items }) => {
  return (
    <EditorialExplorer<Talk, TalkSort>
      items={items}
      searchFields={item => [item.title, item.audience, item.mode]}
      filterFields={{
        mode: item => item.mode,
        year: item => new Date(item.date).getFullYear().toString(),
        audience: item => item.audience,
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
      renderItem={item => <TalkCard item={item} />}
      renderFeaturedItem={item => <TalkCard item={item} featured />}
      getItemKey={item => `${item.title}-${item.date}`}
      getItemId={item => `talk-${slugify(item.title)}-${new Date(item.date).getFullYear()}`}
      searchPlaceholder="Search title, audience..."
      hashPrefix="talk-"
      featuredLabel="Featured talk"
      gridLabel="Talks"
      emptyTitle="No matching talks"
      emptyCopy="Try a broader search, remove a tag, or reset the mode, year, and audience filters."
    />
  );
};

export const TalksExplorer = memo(TalksExplorerComponent);
TalksExplorer.displayName = 'TalksExplorer';
export default TalksExplorer;
