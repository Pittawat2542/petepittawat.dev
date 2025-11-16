/**
 * useBlogFilters - Responsible for blog filtering and sorting logic
 * Follows Single Responsibility Principle (SRP)
 */

import { useMemo } from 'react';
import type { BlogPost } from '@/types';

export type BlogSort = 'newest' | 'oldest';

const comparators: Record<BlogSort, (a: BlogPost, b: BlogPost) => number> = {
  newest: (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  oldest: (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf(),
} as const;

interface UseBlogFiltersParams {
  posts: readonly BlogPost[];
  query: string;
  selectedTags: Set<string>;
  filters: Record<string, string>;
  sort: BlogSort;
}

export function useBlogFilters({
  posts,
  query,
  selectedTags,
  filters,
  sort,
}: UseBlogFiltersParams) {
  const filtered = useMemo(() => {
    const qLower = query.trim().toLowerCase();

    return posts.filter(post => {
      // Search query filter
      if (qLower) {
        const hay = [
          post.data.title,
          post.data.excerpt,
          post.data.tags.join(' '),
          post.data.seriesTitle || '',
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(qLower)) return false;
      }

      // Tag filter
      if (selectedTags.size) {
        const hasAny = post.data.tags.some((tag: string) => selectedTags.has(tag));
        if (!hasAny) return false;
      }

      // Year filter
      if (filters['year'] && filters['year'] !== 'all') {
        const year = new Date(post.data.pubDate).getFullYear().toString();
        if (year !== filters['year']) return false;
      }

      // Series filter
      if (filters['series'] && filters['series'] !== 'all') {
        if (filters['series'] === 'standalone') {
          if (post.data.seriesSlug) return false;
        } else if (post.data.seriesSlug !== filters['series']) {
          return false;
        }
      }

      return true;
    });
  }, [filters, posts, query, selectedTags]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort(comparators[sort]);
    return list;
  }, [filtered, sort]);

  return { filtered, sorted };
}
