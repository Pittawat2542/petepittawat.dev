import type { Project, Publication, Talk } from './content';
import type { ListingItem } from './listing';
import { slugify } from './slug.ts';

type Collections = { projects: Project; publications: Publication; talks: Talk };
export type CollectionListingInput = {
  [K in keyof Collections]: { kind: K; items: readonly Collections[K][] };
}[keyof Collections];
export type CollectionItem = {
  [K in keyof Collections]: { kind: K; item: Collections[K] };
}[keyof Collections];

export function collectionMetadata(input: CollectionItem): ListingItem {
  const { item } = input;
  let date: number;
  let fields: Record<string, string>;
  let search: string[];
  let prefix: string;
  switch (input.kind) {
    case 'projects':
      prefix = 'project';
      date = Date.UTC(input.item.year, 0, 1);
      fields = { year: String(input.item.year), type: input.item.type ?? 'other' };
      search = [
        input.item.title,
        input.item.summary,
        input.item.collaborators ?? '',
        input.item.role ?? '',
      ];
      break;
    case 'publications':
      prefix = 'publication';
      date = Date.UTC(input.item.year, 0, 1);
      fields = { year: String(input.item.year), type: input.item.type };
      search = [input.item.title, input.item.venue, input.item.authors];
      break;
    case 'talks':
      prefix = 'talk';
      date = +input.item.date;
      fields = {
        year: String(input.item.date.getUTCFullYear()),
        mode: input.item.mode,
        audience: input.item.audience,
      };
      search = [input.item.title, input.item.audience, input.item.mode];
      break;
  }
  return {
    id: `${prefix}-${slugify(item.title)}-${fields['year']}`,
    title: item.title,
    search: search.join(' ').toLowerCase(),
    date,
    tags: item.tags,
    fields,
  };
}

export function buildCollectionListing(input: CollectionListingInput) {
  const entries =
    input.kind === 'projects'
      ? input.items.map(item => ({
          kind: 'projects' as const,
          item,
          meta: collectionMetadata({ kind: 'projects', item }),
        }))
      : input.kind === 'publications'
        ? input.items.map(item => ({
            kind: 'publications' as const,
            item,
            meta: collectionMetadata({ kind: 'publications', item }),
          }))
        : input.items.map(item => ({
            kind: 'talks' as const,
            item,
            meta: collectionMetadata({ kind: 'talks', item }),
          }));
  return entries.sort(
    (a, b) => b.meta.date - a.meta.date || a.meta.title.localeCompare(b.meta.title)
  );
}
