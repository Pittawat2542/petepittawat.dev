import { memo, useEffect, useMemo, useRef, useState, type FC } from 'react';
import { languages } from '@/i18n/ui';
import {
  getPreferredBlogPostStates,
  groupBlogPostsByTranslation,
  type BlogPostLanguageState,
  type BlogTranslationLocale,
} from '@/lib/blog-translations';
import {
  getStoredBlogLocalePreference,
  resolveBlogLocalePreference,
  setStoredBlogLocalePreference,
} from '@/lib/blog-locale-preference';
import { usePagination } from '@/lib/hooks/usePagination';
import { useQueryParamSync } from '@/lib/hooks/useQueryParamSync';
import { useBlogFilters, type BlogSort } from '@/lib/hooks/useBlogFilters';
import { useUrlSync } from '@/lib/hooks/useUrlSync';
import { useUrlParams } from '@/lib/hooks/useUrlParams';

import { BlogCard } from '@/components/ui/cards/BlogCard';
import BlogLanguageSwitcher from '@/components/ui/blog/BlogLanguageSwitcher';
import EditorialListingShell from '@/components/explorers/EditorialListingShell';
import type { BlogPost } from '@/types';

interface BlogListPageProps {
  readonly posts: readonly BlogPost[];
  readonly initialLocale?: BlogTranslationLocale | undefined;
  readonly initialTags?: readonly string[] | undefined;
}

interface UrlParams {
  locale: BlogTranslationLocale;
  tags: string[];
  sort: BlogSort;
  yearFilter: string;
  seriesFilter: string;
}

const BLOG_SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
] as const;

function sortPostsDescending<T extends BlogPostLanguageState<BlogPost>>(states: readonly T[]) {
  return [...states].sort(
    (a, b) => b.current.data.pubDate.valueOf() - a.current.data.pubDate.valueOf()
  );
}

function buildTags(posts: readonly BlogPost[]) {
  return [
    'All',
    ...new Set(
      posts
        .flatMap(post => post.data.tags)
        .flat()
        .sort()
    ),
  ];
}

const BlogListPageComponent: FC<BlogListPageProps> = ({
  posts,
  initialLocale = 'en',
  initialTags,
}) => {
  const [q, setQ] = useState('');
  const [locale, setLocale] = useState<BlogTranslationLocale>(() =>
    resolveBlogLocalePreference({
      searchParams: typeof window !== 'undefined' ? window.location.search : undefined,
      storedLocale: typeof window !== 'undefined' ? getStoredBlogLocalePreference() : undefined,
      fallbackLocale: initialLocale,
    })
  );
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<BlogSort>('newest');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [perPage, setPerPage] = useState(12);
  const [isLocaleHydrated, setIsLocaleHydrated] = useState(false);
  const previousLocaleRef = useRef<BlogTranslationLocale>(initialLocale);

  useQueryParamSync('q', q, setQ);

  useUrlParams<UrlParams>({
    parser: params => {
      const urlTags = params.getAll('tag');
      const sortParam = params.get('sort') as BlogSort | null;
      const yearParam = params.get('year');
      const seriesParam = params.get('series');

      return {
        locale: resolveBlogLocalePreference({
          searchParams: params,
          storedLocale: getStoredBlogLocalePreference(),
          fallbackLocale: initialLocale,
        }),
        tags: urlTags.length ? urlTags : initialTags ? Array.from(initialTags) : [],
        sort: sortParam === 'oldest' || sortParam === 'newest' ? sortParam : 'newest',
        yearFilter: yearParam ?? '',
        seriesFilter: seriesParam ?? '',
      };
    },
    onParams: params => {
      setLocale(params.locale);
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
      setIsLocaleHydrated(true);
    },
  });

  useUrlSync({
    enabled: isLocaleHydrated,
    query: q,
    sort,
    selectedTags,
    filters,
    ...(isLocaleHydrated ? { lang: locale } : {}),
  });

  useEffect(() => {
    if (!isLocaleHydrated) return;
    setStoredBlogLocalePreference(locale);
  }, [isLocaleHydrated, locale]);

  const groupedPosts = useMemo(() => groupBlogPostsByTranslation(posts as BlogPost[]), [posts]);

  const localizedStates = useMemo(
    () => sortPostsDescending(getPreferredBlogPostStates(groupedPosts, locale)),
    [groupedPosts, locale]
  );

  const localizedPosts = useMemo(
    () => localizedStates.map(state => state.current),
    [localizedStates]
  );

  const localizedStateById = useMemo(
    () => new Map(localizedStates.map(state => [state.current.id, state])),
    [localizedStates]
  );

  const tags = useMemo(() => buildTags(localizedPosts), [localizedPosts]);

  const { sorted } = useBlogFilters({
    posts: localizedPosts,
    query: q,
    selectedTags,
    filters,
    sort,
  });

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

  useEffect(() => {
    if (!isLocaleHydrated) return;
    if (previousLocaleRef.current !== locale) {
      goToPage(1);
      previousLocaleRef.current = locale;
    }
  }, [goToPage, isLocaleHydrated, locale]);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tags.forEach(tag => {
      if (tag === 'All') {
        counts[tag] = localizedPosts.length;
      } else {
        counts[tag] = localizedPosts.filter(post => post.data.tags.includes(tag)).length;
      }
    });
    return counts;
  }, [localizedPosts, tags]);

  const filterOptions = useMemo(() => {
    const years = Array.from(
      new Set(localizedPosts.map(post => new Date(post.data.pubDate).getFullYear().toString()))
    )
      .sort()
      .reverse();
    return { year: years } as Record<string, string[]>;
  }, [localizedPosts]);

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPaginationPerPage(newPerPage);
  };

  const languageSwitcher = (
    <BlogLanguageSwitcher
      ariaLabel="Select blog language"
      label=""
      variant="toolbar"
      tone="editorial"
      onSelect={setLocale}
      options={[
        {
          locale: 'en',
          label: languages.en,
          shortLabel: 'EN',
          available: true,
          isActive: locale === 'en',
          screenReaderLabel: 'Show English-first blog posts',
        },
        {
          locale: 'th',
          label: languages.th,
          shortLabel: 'TH',
          available: true,
          isActive: locale === 'th',
          screenReaderLabel: 'Show Thai-first blog posts',
        },
      ]}
    />
  );

  return (
    <EditorialListingShell
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
      sortOptions={BLOG_SORT_OPTIONS}
      sortValue={sort}
      onSortChange={value => {
        setSort(value as BlogSort);
      }}
      filteredResults={sorted.length}
      totalResults={localizedPosts.length}
      toolbarAccessory={languageSwitcher}
      itemsWrapperElement="ul"
      footer={
        <>
          <div className="mt-8 flex justify-center text-sm text-white/52 md:mt-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[11px] font-semibold tracking-[0.32em] text-white/52 uppercase shadow-[0_20px_40px_-30px_rgba(3,7,18,0.82)]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--accent,#6ac1ff)] shadow-[0_0_0_5px_rgba(96,165,250,0.18)]" />
              Field Notes elsewhere
            </span>
          </div>
          <div className="mt-4 flex flex-col items-center gap-2 text-center text-sm text-white/52 md:flex-row md:justify-center md:gap-3">
            <span className="text-white/48">Also publishing with the Typhoon team:</span>
            <a
              href="https://opentyphoon.ai/blog/en"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-white/82 transition-[transform,border-color,color,box-shadow,background-color] duration-200 hover:scale-[1.02] hover:border-white/18 hover:bg-white/[0.07] hover:text-white hover:shadow-[0_18px_30px_-24px_rgba(3,7,18,0.82)]"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--accent,#6ac1ff)]" />
              opentyphoon.ai/blog/en
            </a>
          </div>
        </>
      }
      pagination={{
        total: sorted.length,
        visible: pagePosts.length,
        perPage,
        onPerPageChange: handlePerPageChange,
        currentPage,
        totalPages,
        onPageChange: goToPage,
      }}
    >
      {pagePosts.map((post: BlogPost, index: number) => (
        <BlogCard
          key={post.id}
          post={post}
          allPosts={localizedPosts}
          languageState={localizedStateById.get(post.id)}
          tone="editorial"
          className="reveal"
          style={{ transitionDelay: `${Math.min(index * 50, 400)}ms` }}
        />
      ))}
    </EditorialListingShell>
  );
};

export const BlogListPage = memo(BlogListPageComponent, (prevProps, nextProps) => {
  return (
    prevProps.posts === nextProps.posts &&
    prevProps.initialLocale === nextProps.initialLocale &&
    prevProps.initialTags === nextProps.initialTags
  );
});

BlogListPage.displayName = 'BlogListPage';
export default BlogListPage;
