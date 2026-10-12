import { getCollection } from 'astro:content';
import { getPreferredBlogPostStates, groupBlogPostsByTranslation } from './blog-translations';
import { responsiveCover } from './responsive-cover';
import { buildSeriesIndex } from './listing';
import type { ListingItem } from './listing';
import { slugify } from './slug';
import type { Project, Publication, Talk } from './content';

export async function buildBlogListing(locale: 'en' | 'th') {
  const all = await getCollection('blog');
  const states = getPreferredBlogPostStates(groupBlogPostsByTranslation(all), locale).sort(
    (a, b) => +b.current.data.pubDate - +a.current.data.pubDate
  );
  const series = buildSeriesIndex(states.map(state => state.current));
  return Promise.all(
    states.map(async state => {
      const post = state.current;
      const { data } = post;
      const meta: ListingItem = {
        id: `blog-${slugify(post.id)}`,
        title: data.title,
        search: [data.title, data.excerpt, ...data.tags, data.seriesTitle ?? '']
          .join(' ')
          .toLowerCase(),
        date: +data.pubDate,
        tags: data.tags,
        fields: {
          year: String(data.pubDate.getUTCFullYear()),
          series: data.seriesSlug ?? 'standalone',
        },
      };
      return {
        post,
        state,
        meta,
        series: series.get(post.id),
        cover: data.coverImage ? await responsiveCover(data.coverImage) : undefined,
      };
    })
  );
}
export function blogFragmentPath(locale: 'en' | 'th') {
  return `/listing-assets/blog/${locale}/`;
}
export function collectionMetadata(
  kind: 'projects' | 'publications' | 'talks',
  item: Project | Publication | Talk
): ListingItem {
  const isTalk = 'date' in item;
  const date = isTalk ? +new Date(item.date) : Date.UTC(item.year, 0, 1);
  const fields: Record<string, string> = { year: String(new Date(date).getUTCFullYear()) };
  if (!isTalk) fields['type'] = item.type ?? 'other';
  if (isTalk) {
    fields['mode'] = item.mode;
    fields['audience'] = item.audience;
  }
  const search =
    kind === 'publications' && 'authors' in item
      ? [item.title, item.venue, item.authors]
      : isTalk
        ? [item.title, item.audience, item.mode]
        : [
            item.title,
            'summary' in item ? item.summary : '',
            'collaborators' in item ? (item.collaborators ?? '') : '',
            'role' in item ? (item.role ?? '') : '',
          ];
  return {
    id: `${kind === 'publications' ? 'publication' : kind === 'projects' ? 'project' : 'talk'}-${slugify(item.title)}-${fields['year']}`,
    title: item.title,
    search: search.join(' ').toLowerCase(),
    date,
    tags: item.tags,
    fields,
  };
}
