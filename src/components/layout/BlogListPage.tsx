/**
 * BlogListPage - Blog list display component
 * Refactored to follow Single Responsibility Principle (SRP)
 * by extracting filtering, URL sync, and sorting into focused hooks
 */

import { memo, useMemo, useState } from 'react';
import { usePagination } from '@/lib/hooks/usePagination';
import { useQueryParamSync } from '@/lib/hooks/useQueryParamSync';
import { useBlogFilters, type BlogSort } from '@/lib/hooks/useBlogFilters';
import { useUrlSync } from '@/lib/hooks/useUrlSync';
import { useUrlParams } from '@/lib/hooks/useUrlParams';

import { BlogCard } from '@/components/ui/cards/BlogCard';
import type { BlogPost } from '@/types';
import type { FC } from 'react';
import FilterPanel from '@/components/ui/filter/FilterPanel';
import PageControls from '@/components/ui/navigation/PageControls';

interface BlogListPageProps {
  readonly posts: readonly BlogPost[];
  readonly tags: readonly string[];
  readonly initialTags?: readonly string[]; // Optional: preselect tags when mounting (e.g., tag pages)
}

interface UrlParams {
  tags: string[];
  sort: BlogSort;
  yearFilter: string;
  seriesFilter: string;
}

const BlogListPageComponent: FC<BlogListPageProps> = ({ posts, tags, initialTags }) => {
  const [q, setQ] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<BlogSort>('newest');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [perPage, setPerPage] = useState(12);

  useQueryParamSync('q', q, setQ);

  // Initialize from URL parameters or initialTags
  useUrlParams<UrlParams>({
    parser: params => {
      const urlTags = params.getAll('tag');
      const sortParam = params.get('sort') as BlogSort | null;
      const yearParam = params.get('year');
      const seriesParam = params.get('series');

      return {
        tags: urlTags.length ? urlTags : initialTags ? Array.from(initialTags) : [],
        sort: sortParam === 'oldest' || sortParam === 'newest' ? sortParam : 'newest',
        yearFilter: yearParam || '',
        seriesFilter: seriesParam || '',
      };
    },
    onParams: params => {
      if (params.tags.length) {
        setSelectedTags(new Set(params.tags));
      }
      setSort(params.sort);
      if (params.yearFilter) {
        setFilters(prev => ({ ...prev, year: params.yearFilter }));
      }
      if (params.seriesFilter) {
        setFilters(prev => ({ ...prev, series: params.seriesFilter }));
      }
    },
  });

  // Sync state to URL
  useUrlSync({
    query: q,
    sort,
    selectedTags,
    filters,
  });

  // Apply filters and sorting
  const { sorted } = useBlogFilters({
    posts,
    query: q,
    selectedTags,
    filters,
    sort,
  });

  // Pagination
  const {
    paginated: pagePosts,
    totalPages,
    currentPage,
    goToPage,
    setPerPage: setPaginationPerPage,
  } = usePagination({
    items: sorted,
    perPage,
    initialPage: 1,
  });

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

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPaginationPerPage(newPerPage);
  };

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
        onSortChange={value => setSort(value as BlogSort)}
        filteredResults={sorted.length}
        totalResults={posts.length}
        compact
      />
      <ul className="mt-2 grid w-full grid-cols-1 gap-5 py-3 md:mt-4 md:grid-cols-2 md:gap-8 md:py-4 2xl:grid-cols-3">
        {pagePosts.map((post: BlogPost, index: number) => (
          <BlogCard
            key={post.slug}
            post={post}
            allPosts={Array.from(posts)}
            className="reveal"
            style={{ transitionDelay: `${Math.min(index * 50, 400)}ms` }}
          />
        ))}
      </ul>
      <div className="mt-8 flex justify-center text-sm text-white/70 md:mt-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-gradient-to-r from-white/10 via-white/5 to-transparent px-4 py-1.5 text-[11px] font-semibold tracking-[0.38em] text-white/70 uppercase shadow-[0_12px_30px_-18px_rgba(15,23,42,0.9)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--accent,#6ac1ff)] shadow-[0_0_10px_rgba(106,193,255,0.7)]" />
          Field Notes elsewhere
        </span>
      </div>
      <div className="mt-4 flex flex-col items-center gap-2 text-center text-sm text-white/70 md:flex-row md:justify-center md:gap-3">
        <span className="text-white/60">Also publishing with the Typhoon team:</span>
        <a
          href="https://opentyphoon.ai/blog/en"
          className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-white/90 transition-transform duration-200 hover:scale-[1.02] hover:border-white/25 hover:text-white"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/80" />
          opentyphoon.ai/blog/en
        </a>
      </div>
      {totalPages > 1 && (
        <PageControls
          total={sorted.length}
          visible={pagePosts.length}
          perPage={perPage}
          onPerPageChange={handlePerPageChange}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}
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
