import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePagination, useQueryParamSync } from '@/lib/hooks';
import type { BlogPost } from '@/types';

export type BlogSort = 'newest' | 'oldest';

const comparators: Record<BlogSort, (a: BlogPost, b: BlogPost) => number> = {
  newest: (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  oldest: (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf(),
} as const;

interface UseBlogListStateProps {
  readonly posts: readonly BlogPost[];
  readonly tags: readonly string[];
  readonly initialTags?: readonly string[] | undefined;
}

export function useBlogListState({ posts, tags, initialTags }: UseBlogListStateProps) {
  const [searchValue, setSearchValue] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<BlogSort>('newest');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [perPage, setPerPage] = useState(12);

  useQueryParamSync('q', searchValue, setSearchValue);

  // Read URL params on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const urlTags = params.getAll('tag');
    if (urlTags.length) {
      setSelectedTags(new Set(urlTags));
    } else if (initialTags?.length) {
      setSelectedTags(new Set(initialTags));
    }

    const sortParam = params.get('sort');
    if (sortParam === 'oldest' || sortParam === 'newest') {
      setSort(sortParam as BlogSort);
    }

    const yearParam = params.get('year');
    if (yearParam) {
      setFilters(prev => ({ ...prev, year: yearParam }));
    }

    const seriesParam = params.get('series');
    if (seriesParam) {
      setFilters(prev => ({ ...prev, series: seriesParam }));
    }
  }, [initialTags]);

  // Update URL params when filters change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    const trimmed = searchValue.trim();
    if (trimmed) params.set('q', trimmed);
    if (sort === 'oldest') params.set('sort', 'oldest');
    if (selectedTags.size) {
      Array.from(selectedTags)
        .sort()
        .forEach(tag => params.append('tag', tag));
    }
    const yearFilter = filters['year'];
    if (yearFilter && yearFilter !== 'all') params.set('year', yearFilter);
    const query = params.toString();
    const url = query ? `?${query}` : window.location.pathname;
    window.history.replaceState({}, '', url);
  }, [filters, searchValue, selectedTags, sort]);

  const filteredPosts = useMemo(() => {
    const qLower = searchValue.trim().toLowerCase();

    return posts.filter(post => {
      if (qLower) {
        const hay = [
          post.data.title,
          post.data.excerpt,
          post.data.tags.join(' '),
          post.data.seriesTitle || '',
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(qLower)) {
          return false;
        }
      }

      if (selectedTags.size) {
        const hasAny = post.data.tags.some((tag: string) => selectedTags.has(tag));
        if (!hasAny) return false;
      }

      const yearFilter = filters['year'];
      if (yearFilter && yearFilter !== 'all') {
        const year = new Date(post.data.pubDate).getFullYear().toString();
        if (year !== yearFilter) return false;
      }

      const seriesFilter = filters['series'];
      if (seriesFilter && seriesFilter !== 'all') {
        if (seriesFilter === 'standalone') {
          if (post.data.seriesSlug) return false;
        } else if (post.data.seriesSlug !== seriesFilter) {
          return false;
        }
      }

      return true;
    });
  }, [filters, posts, searchValue, selectedTags]);

  const sortedPosts = useMemo(() => {
    const next = [...filteredPosts];
    next.sort(comparators[sort]);
    return next;
  }, [filteredPosts, sort]);

  const pagination = usePagination({
    items: sortedPosts,
    perPage,
    initialPage: 1,
  });

  const handlePerPageChange = useCallback(
    (value: number) => {
      setPerPage(value);
      pagination.setPerPage(value);
    },
    [pagination]
  );

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tags.forEach(tag => {
      if (tag === 'All') {
        counts[tag] = posts.length;
      } else {
        counts[tag] = posts.filter(post => post.data.tags.includes(tag)).length;
      }
    });
    return counts;
  }, [posts, tags]);

  const filterOptions = useMemo(() => {
    const years = Array.from(
      new Set(posts.map(post => new Date(post.data.pubDate).getFullYear().toString()))
    )
      .sort()
      .reverse();
    return { year: years } as Record<string, string[]>;
  }, [posts]);

  return {
    searchValue,
    setSearchValue,
    selectedTags,
    setSelectedTags,
    sort,
    setSort,
    filters,
    setFilters,
    perPage,
    handlePerPageChange,
    filteredPosts,
    sortedPosts,
    pagination,
    tagCounts,
    filterOptions,
    availableTags: tags,
    allPosts: posts,
    totalResults: posts.length,
  };
}
