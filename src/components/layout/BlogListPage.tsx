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
  readonly posts: readonly { id: string; collection: 'blog'; data: BlogPost['data'] }[];
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

  const groupedPosts = useMemo(() => groupBlogPostsByTranslation(posts), [posts]);

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
      footer={null}
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
