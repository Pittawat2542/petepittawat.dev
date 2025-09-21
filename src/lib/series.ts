import type { CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export interface SeriesInfo {
  slug: string;
  title: string;
  description: string;
  posts: BlogPost[];
  totalParts: number;
}

export interface SeriesNavigation {
  current: BlogPost;
  series: SeriesInfo;
  previousPost: BlogPost | undefined;
  nextPost: BlogPost | undefined;
}

/**
 * Get all unique series from a collection of blog posts
 */
export function getAllSeries(posts: BlogPost[]): SeriesInfo[] {
  const seriesMap = new Map<string, SeriesInfo>();

  posts.forEach(post => {
    const { seriesSlug, seriesTitle, seriesDescription } = post.data;
    
    if (seriesSlug && seriesTitle) {
      if (!seriesMap.has(seriesSlug)) {
        seriesMap.set(seriesSlug, {
          slug: seriesSlug,
          title: seriesTitle,
          description: seriesDescription || '',
          posts: [],
          totalParts: 0
        });
      }
      
      seriesMap.get(seriesSlug)!.posts.push(post);
    }
  });

  // Sort posts within each series by order and update totalParts
  seriesMap.forEach(series => {
    series.posts.sort((a, b) => {
      const orderA = a.data.seriesOrder || 0;
      const orderB = b.data.seriesOrder || 0;
      return orderA - orderB;
    });
    series.totalParts = series.posts.length;
  });

  return Array.from(seriesMap.values());
}

/**
 * Get series information for a specific series slug
 */
export function getSeriesBySlug(posts: BlogPost[], seriesSlug: string): SeriesInfo | null {
  const allSeries = getAllSeries(posts);
  return allSeries.find(s => s.slug === seriesSlug) || null;
}

/**
 * Get series navigation information for a specific post
 */
export function getSeriesNavigation(posts: BlogPost[], currentPost: BlogPost): SeriesNavigation | null {
  const { seriesSlug } = currentPost.data;
  
  if (!seriesSlug) {
    return null;
  }

  const series = getSeriesBySlug(posts, seriesSlug);
  if (!series) {
    return null;
  }

  const currentIndex = series.posts.findIndex(post => post.slug === currentPost.slug);
  if (currentIndex === -1) {
    return null;
  }

  const previousPost = currentIndex > 0 ? series.posts[currentIndex - 1] : undefined;
  const nextPost = currentIndex < series.posts.length - 1 ? series.posts[currentIndex + 1] : undefined;

  return {
    current: currentPost,
    series,
    previousPost,
    nextPost
  };
}

/**
 * Get the current part number of a post within its series
 */
export function getPostPartNumber(posts: BlogPost[], post: BlogPost): number | null {
  const { seriesSlug } = post.data;
  
  if (!seriesSlug) {
    return null;
  }

  const series = getSeriesBySlug(posts, seriesSlug);
  if (!series) {
    return null;
  }

  const index = series.posts.findIndex(p => p.slug === post.slug);
  return index !== -1 ? index + 1 : null;
}

/**
 * Check if a post belongs to a series
 */
export function isPartOfSeries(post: BlogPost): boolean {
  return !!(post.data.seriesSlug && post.data.seriesTitle);
}

/**
 * Get series progress as a percentage (0-100)
 */
export function getSeriesProgress(series: SeriesInfo, currentPost: BlogPost): number {
  const currentIndex = series.posts.findIndex(post => post.slug === currentPost.slug);
  if (currentIndex === -1) return 0;
  
  return Math.round(((currentIndex + 1) / series.totalParts) * 100);
}
