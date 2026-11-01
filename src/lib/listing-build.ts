import { getCollection } from 'astro:content';
import { getPreferredBlogPostStates, groupBlogPostsByTranslation } from './blog-translations';
import { responsiveCover } from './responsive-cover';
import { buildSeriesIndex } from './listing';
import type { ListingItem } from './listing';
import { slugify } from './slug';

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
