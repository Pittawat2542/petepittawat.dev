import { memo, useEffect, useMemo, useState } from 'react';
import { useInfiniteList, useQueryParamSync } from '@/lib/hooks';

import { BlogCard } from '@/components/ui/cards/BlogCard';
import type { BlogPost } from '@/types';
import type { FC } from 'react';
import FilterPanel from '@/components/ui/filter/FilterPanel';

interface BlogListPageProps {
  readonly posts: readonly BlogPost[];
  readonly tags: readonly string[];
  readonly initialTags?: readonly string[]; // Optional: preselect tags when mounting (e.g., tag pages)
}

type BlogSort = 'newest' | 'oldest';

const comparators: Record<BlogSort, (a: BlogPost, b: BlogPost) => number> = {
  newest: (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  oldest: (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf(),
} as const;

const BlogListPageComponent: FC<BlogListPageProps> = ({ posts, tags, initialTags }) => {
  const [q, setQ] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<BlogSort>('newest');
  const [filters, setFilters] = useState<Record<string, string>>({});

  useQueryParamSync('q', q, setQ);

  // Initialize from URL ?tag=foo&tag=bar or from initialTags
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTags = params.getAll('tag');
      if (urlTags.length) {
        setSelectedTags(new Set(urlTags));
      } else if (initialTags?.length) {
        setSelectedTags(new Set(initialTags));
      }
      const sortParam = params.get('sort');
      if (sortParam === 'oldest' || sortParam === 'newest') setSort(sortParam);
      const yearParam = params.get('year');
      if (yearParam) setFilters((prev) => ({ ...prev, year: yearParam }));
      const seriesParam = params.get('series');
      if (seriesParam) setFilters((prev) => ({ ...prev, series: seriesParam }));
    } catch {}
  }, [initialTags]);

  // Keep URL in sync for shareability
  useEffect(() => {
    try {
      const params = new URLSearchParams();
      const trimmed = q.trim();
      if (trimmed) params.set('q', trimmed);
      if (sort === 'oldest') params.set('sort', 'oldest');
      if (selectedTags.size) {
        for (const tag of Array.from(selectedTags).sort()) params.append('tag', tag);
      }
      if (filters['year'] && filters['year'] !== 'all') params.set('year', filters['year']);
      const query = params.toString();
      const url = query ? `?${query}` : window.location.pathname;
      window.history.replaceState({}, '', url);
    } catch {}
  }, [filters, q, selectedTags, sort]);

  const filteredPosts = useMemo(() => {
    const qLower = q.trim().toLowerCase();

    return posts.filter((post) => {
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

      if (selectedTags.size) {
        const hasAny = post.data.tags.some((tag) => selectedTags.has(tag));
        if (!hasAny) return false;
      }

      if (filters['year'] && filters['year'] !== 'all') {
        const year = new Date(post.data.pubDate).getFullYear().toString();
        if (year !== filters['year']) return false;
      }

      if (filters['series'] && filters['series'] !== 'all') {
        if (filters['series'] === 'standalone') {
          if (post.data.seriesSlug) return false;
        } else if (post.data.seriesSlug !== filters['series']) {
          return false;
        }
      }

      return true;
    });
  }, [filters, posts, q, selectedTags]);

  const sortedPosts = useMemo(() => {
    const list = [...filteredPosts];
    list.sort(comparators[sort]);
    return list;
  }, [filteredPosts, sort]);

  const { paged: pagePosts, loadingMore, pendingSkeletons, sentinelRef } = useInfiniteList({ items: sortedPosts, per: 12 });

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tags.forEach((tag) => {
      if (tag === 'All') {
        counts[tag] = posts.length;
      } else {
        counts[tag] = posts.filter((post) => post.data.tags.includes(tag)).length;
      }
    });
    return counts;
  }, [posts, tags]);

  const filterOptions = useMemo(() => {
    const years = Array.from(
      new Set(posts.map((post) => new Date(post.data.pubDate).getFullYear().toString())),
    )
      .sort()
      .reverse();
    return { year: years } as Record<string, string[]>;
  }, [posts]);

  return (
    <section className="flex w-full flex-col">
      <FilterPanel
        searchValue={q}
        onSearchChange={setQ}
        searchPlaceholder="Search title, excerpt, series, or tags..."
        filters={filters}
        onFiltersChange={setFilters}
        filterOptions={filterOptions}
        availableTags={Array.from(tags)}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        tagCounts={tagCounts}
        sortOptions={[
          { value: 'newest', label: 'Newest' },
          { value: 'oldest', label: 'Oldest' },
        ]}
        sortValue={sort}
        onSortChange={(value) => setSort(value as BlogSort)}
        filteredResults={sortedPosts.length}
        compact
      />
      <ul className="mt-2 md:mt-4 grid w-full grid-cols-1 gap-5 py-3 md:grid-cols-2 md:gap-8 md:py-4 2xl:grid-cols-3">
        {pagePosts.map((post, index) => (
          <BlogCard
            key={post.slug}
            post={post}
            allPosts={Array.from(posts)}
            className="reveal"
            style={{ transitionDelay: `${Math.min(index * 100, 800)}ms` }}
          />
        ))}
        {loadingMore &&
          Array.from({ length: pendingSkeletons }).map((_, index) => (
            <li
              key={`skeleton-${index}`}
              className="glass-card animate-pulse rounded-2xl border border-border bg-card p-6"
            >
              <div className="mb-4 h-40 w-full rounded-xl bg-white/10" />
              <div className="mb-2 h-6 w-3/4 rounded bg-white/10" />
              <div className="mb-1 h-4 w-full rounded bg-white/10" />
              <div className="h-4 w-5/6 rounded bg-white/10" />
            </li>
          ))}
      </ul>
      <div ref={sentinelRef} className="h-6 w-full" aria-hidden="true" />
    </section>
  );
};

// Memoize the component with custom comparison
export const BlogListPage = memo(BlogListPageComponent, (prevProps, nextProps) => {
  return (
    prevProps.posts === nextProps.posts &&
    prevProps.tags === nextProps.tags &&
    prevProps.initialTags === nextProps.initialTags
  );
});

BlogListPage.displayName = 'BlogListPage';
export default BlogListPage;

