import type { BlogPost } from '../types';

export function useBlogCardSeries(post: BlogPost, allPosts: readonly BlogPost[]) {
  const isPartOfSeries = post.data.seriesSlug && post.data.seriesTitle;
  let partNumber = post.data.seriesOrder || 0;
  let totalParts = 0;

  // Calculate total parts in series if allPosts is provided
  if (isPartOfSeries && allPosts.length > 0) {
    const seriesPosts = allPosts.filter(p => p.data.seriesSlug === post.data.seriesSlug);
    totalParts = seriesPosts.length;
    
    // If no explicit order, calculate based on date
    if (!partNumber) {
      const sortedPosts = [...seriesPosts].sort(
        (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf()
      );
      partNumber = sortedPosts.findIndex(p => p.slug === post.slug) + 1;
    }
  }

  return {
    isPartOfSeries: !!isPartOfSeries,
    partNumber,
    totalParts,
    seriesTitle: post.data.seriesTitle
  };
}