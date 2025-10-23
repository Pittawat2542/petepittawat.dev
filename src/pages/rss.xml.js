import { SITE_DESCRIPTION, SITE_TITLE } from '@/consts';
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';

export async function GET(context) {
  const posts = await getCollection('blog');
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
        link: `/blog/${post.slug}/`,
        categories,
        // Enrich feed with full content (Markdown/MDX body)
        content: post.body,
      };
    }),
    // Add namespace + extra data
    customData:
      '<language>en</language>\n' + '<xmlns:content="http://purl.org/rss/1.0/modules/content/"/>',
  });
}
