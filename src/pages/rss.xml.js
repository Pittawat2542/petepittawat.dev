import { SITE_DESCRIPTION, SITE_TITLE } from '@/consts';
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';

export async function GET(context) {
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map(post => {
      let title = post.data.title;
      let description = post.data.excerpt;

      // Add series information to title and description if applicable
      if (post.data.seriesSlug && post.data.seriesTitle && post.data.seriesOrder) {
        title = `${post.data.seriesTitle} (Part ${post.data.seriesOrder}): ${title}`;
        description = `Part ${post.data.seriesOrder} of the "${post.data.seriesTitle}" series. ${description}`;
      }

      const categories = [...(post.data.tags || [])];
      // Add series as a category if it exists
      if (post.data.seriesSlug) {
        categories.push(`series:${post.data.seriesSlug}`);
      }

      return {
        title,
        description,
        pubDate: post.data.pubDate,
        link: post.data.externalUrl ?? `/blog/${post.data.slug}/`,
        categories,
      };
    }),
  });
}
