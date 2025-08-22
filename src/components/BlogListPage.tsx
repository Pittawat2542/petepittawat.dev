import { useCallback, useEffect, useMemo, useState } from 'react';

import BlogCard from './BlogCard';
import type { BlogPost } from '../types';
import FilterPanel from './ui/FilterPanel';

type BlogListPageProps = {
  posts: BlogPost[];
  tags: string[];
  initialTags?: string[]; // Optional: preselect tags when mounting (e.g., tag pages)
};

export default function BlogListPage({ posts, tags, initialTags }: Readonly<BlogListPageProps>) {
        const [q, setQ] = useState('');
        const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
        const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
        const [filters, setFilters] = useState<Record<string, string>>({});
        const [per] = useState<number>(12);
        const [page, setPage] = useState<number>(1);
        const [loadingMore, setLoadingMore] = useState(false);

        // Initialize from URL ?tag=foo&tag=bar or from initialTags
        useEffect(() => {
                try {
                        const params = new URLSearchParams(window.location.search);
                        const urlTags = params.getAll('tag');
                        if (urlTags.length) {
                                setSelectedTags(new Set(urlTags));
                        } else if (initialTags && initialTags.length) {
                                setSelectedTags(new Set(initialTags));
                        }
                        const qParam = params.get('q');
                        if (qParam) setQ(qParam);
                        const sParam = params.get('sort');
                        if (sParam === 'oldest' || sParam === 'newest') setSort(sParam);
                        const yearParam = params.get('year');
                        if (yearParam) setFilters((f) => ({ ...f, year: yearParam }));
                        // no per/page in URL for pure infinite scroll
                } catch {}
        }, []);

        // Keep URL in sync for shareability
        useEffect(() => {
                try {
                        const params = new URLSearchParams();
                        if (q.trim()) params.set('q', q.trim());
                        if (sort === 'oldest') params.set('sort', 'oldest');
                        if (selectedTags.size) {
                                for (const t of Array.from(selectedTags).sort()) params.append('tag', t);
                        }
                        if (filters.year && filters.year !== 'all') params.set('year', filters.year);
                        // omit per/page from URL
                        const query = params.toString();
                        const url = query ? `?${query}` : window.location.pathname;
                        window.history.replaceState({}, '', url);
                } catch {}
        }, [q, sort, selectedTags, filters]);

        // tag toggle handled inline in FilterPanel via onTagsChange

        const filteredPosts = useMemo(() => {
                const qLower = q.trim().toLowerCase();
                let list = posts.filter((post) => {
                        // Search
                        if (qLower) {
                                const hay = [post.data.title, post.data.excerpt, post.data.tags.join(' ')].join(' ').toLowerCase();
                                if (!hay.includes(qLower)) return false;
                        }
                        // Tag filter (any-match)
                        if (selectedTags.size > 0) {
                                const hasAny = post.data.tags.some((t) => selectedTags.has(t));
                                if (!hasAny) return false;
                        }
                        // Year filter
                        if (filters.year && filters.year !== 'all') {
                                const y = new Date(post.data.pubDate).getFullYear().toString();
                                if (y !== filters.year) return false;
                        }
                        return true;
                });
                // Sort
                list.sort((a, b) => {
                        const cmp = a.data.pubDate.valueOf() - b.data.pubDate.valueOf();
                        return sort === 'newest' ? -cmp : cmp;
                });
                return list;
        }, [posts, q, selectedTags, sort, filters]);

        // Reset page when filters/search/sort change
        useEffect(() => { setPage(1); }, [q, selectedTags, sort, filters]);

        const visibleCount = Math.min(filteredPosts.length, per * page);
        const pagePosts = useMemo(() => filteredPosts.slice(0, visibleCount), [filteredPosts, visibleCount]);

        const loadNext = useCallback(() => {
          if (loadingMore) return;
          if (visibleCount >= filteredPosts.length) return;
          setLoadingMore(true);
          // Small delay lets skeletons render for perceived smoothness
          setTimeout(() => {
            setPage((p) => p + 1);
            setLoadingMore(false);
          }, 250);
        }, [loadingMore, visibleCount, filteredPosts.length]);

        // Lazy load next page when sentinel enters view
        useEffect(() => {
          const el = (document.getElementById('blog-sentinel')) as HTMLDivElement | null;
          if (!el) return;
          const io = new IntersectionObserver((entries) => {
            for (const e of entries) {
              if (e.isIntersecting) {
                loadNext();
              }
            }
          }, { rootMargin: '800px 0px' });
          io.observe(el);
          return () => io.disconnect();
        }, [loadNext]);

        // Prepare tag counts
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

        // Prepare year filter options
        const yearOptions = useMemo(() => {
                const years = Array.from(new Set(posts.map(p => new Date(p.data.pubDate).getFullYear().toString()))).sort().reverse();
                return { year: years } as Record<string, string[]>;
        }, [posts]);

       return (
               <section className='flex w-full flex-col'>
                        <FilterPanel
                                searchValue={q}
                                onSearchChange={setQ}
                                searchPlaceholder='Search title, excerpt, or tags...'
                                filters={filters}
                                onFiltersChange={setFilters}
                                filterOptions={yearOptions}
                                availableTags={tags}
                                selectedTags={selectedTags}
                                onTagsChange={setSelectedTags}
                                tagCounts={tagCounts}
                                sortOptions={[
                                        { value: 'newest', label: 'Newest' },
                                        { value: 'oldest', label: 'Oldest' }
                                ]}
                                sortValue={sort}
                                onSortChange={(value) => setSort(value as 'newest' | 'oldest')}
                                filteredResults={filteredPosts.length}
                                compact={true}
                        />
                       <ul className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5 md:gap-8 py-3 md:py-4 mt-2 md:mt-4 w-full'>
                                {pagePosts.map((post, index) => (
                                  <div key={post.slug} className="stagger-fade-in" style={{ animationDelay: `${Math.min(index * 100, 800)}ms` }}>
                                    <BlogCard post={post} />
                                  </div>
                                ))}
                                {loadingMore && (
                                  Array.from({ length: Math.min(12, Math.max(0, filteredPosts.length - visibleCount)) }).map((_, i) => (
                                    <li key={`skeleton-${i}`} className="rounded-2xl border border-border bg-card glass-card p-6 animate-pulse">
                                      <div className="h-40 w-full bg-white/10 rounded-xl mb-4" />
                                      <div className="h-6 w-3/4 bg-white/10 rounded mb-2" />
                                      <div className="h-4 w-full bg-white/10 rounded mb-1" />
                                      <div className="h-4 w-5/6 bg-white/10 rounded" />
                                    </li>
                                  ))
                                )}
                        </ul>
                        <div id="blog-sentinel" className="h-6 w-full" aria-hidden="true" />
                </section>
        );
}
