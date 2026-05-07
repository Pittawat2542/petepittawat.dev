import type { CollectionEntry } from 'astro:content';

/**
 * Strips heavy fields (body, render) from Astro content entries
 * to prevent massive JSON serialization in the HTML for React islands.
 */
export function toCompactBlogPost(post: CollectionEntry<'blog'>) {
  return {
    id: post.id,
    collection: 'blog' as const,
    data: post.data,
  };
}

export function toCompactBlogPosts(posts: CollectionEntry<'blog'>[]) {
  return posts.map(toCompactBlogPost);
}
