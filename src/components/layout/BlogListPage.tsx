import { memo, useEffect, useMemo, useState, type FC } from 'react';
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
  const [locale, setLocale] = useState<BlogTranslationLocale>(initialLocale);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<BlogSort>('newest');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isLocaleHydrated, setIsLocaleHydrated] = useState(false);

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
  const featuredPost = sorted[0];
  const gridPosts = sorted.slice(1);

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
      itemsWrapperElement="div"
      itemsWrapperClassName="blog-index__items"
      emptyState={
        <div className="blog-index__empty" role="status">
          <h2 className="blog-index__empty-title">No matching notes</h2>
          <p className="blog-index__empty-copy">
            Try a broader search or clear a filter to bring the field notes back into view.
          </p>
        </div>
      }
      footer={null}
    >
      {featuredPost ? (
        <ul className="blog-index__featured" aria-label="Featured blog post">
          <BlogCard
            key={featuredPost.id}
            post={featuredPost}
            featured
            presentation="featured"
            allPosts={localizedPosts}
            languageState={localizedStateById.get(featuredPost.id)}
            tone="editorial"
            className="[contain-intrinsic-size:620px] [content-visibility:auto]"
          />
        </ul>
      ) : null}

      {gridPosts.length > 0 ? (
        <ul className="blog-index__grid" aria-label="Blog posts">
          {gridPosts.map((post: BlogPost) => (
            <BlogCard
              key={post.id}
              post={post}
              allPosts={localizedPosts}
              languageState={localizedStateById.get(post.id)}
              tone="editorial"
              className="[contain-intrinsic-size:520px] [content-visibility:auto]"
            />
          ))}
        </ul>
      ) : null}
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
