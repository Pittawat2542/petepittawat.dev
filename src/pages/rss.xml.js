import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';

export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.pubDate,
      link: `/blog/${post.slug}/`,
      categories: post.data.tags || [],
      // Enrich feed with full content (Markdown/MDX body)
      content: post.body,
    })),
    // Add namespace + extra data
    customData:
      '<language>en</language>\n' +
      '<xmlns:content="http://purl.org/rss/1.0/modules/content/"/>',
  });
}
