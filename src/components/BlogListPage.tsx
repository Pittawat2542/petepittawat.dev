import { useEffect, useMemo, useState } from 'react';

import BlogCard from './BlogCard';
import type { BlogPost } from '../types';
import FilterPanel from './ui/FilterPanel';

type BlogListPageProps = {
  posts: BlogPost[];
  tags: string[];
};

export default function BlogListPage({ posts, tags }: Readonly<BlogListPageProps>) {
        const [q, setQ] = useState('');
        const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
        const [sort, setSort] = useState<'newest' | 'oldest'>('newest');

        // Initialize from URL ?tag=foo&tag=bar
        useEffect(() => {
                try {
                        const params = new URLSearchParams(window.location.search);
                        const urlTags = params.getAll('tag');
                        if (urlTags.length) {
                                setSelectedTags(new Set(urlTags));
                        }
                        const qParam = params.get('q');
                        if (qParam) setQ(qParam);
                        const sParam = params.get('sort');
                        if (sParam === 'oldest' || sParam === 'newest') setSort(sParam);
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
                        const query = params.toString();
                        const url = query ? `?${query}` : window.location.pathname;
                        window.history.replaceState({}, '', url);
                } catch {}
        }, [q, sort, selectedTags]);

        function toggleTag(tag: string) {
                if (tag === 'All') {
                        setSelectedTags(new Set());
                        return;
                }
                setSelectedTags((prev) => {
                        const next = new Set(prev);
                        if (next.has(tag)) next.delete(tag);
                        else next.add(tag);
                        return next;
                });
        }

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
                        return true;
                });
                // Sort
                list.sort((a, b) => {
                        const cmp = a.data.pubDate.valueOf() - b.data.pubDate.valueOf();
                        return sort === 'newest' ? -cmp : cmp;
                });
                return list;
        }, [posts, q, selectedTags, sort]);

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

       return (
               <section className='flex w-full flex-col'>
                        <FilterPanel
                                searchValue={q}
                                onSearchChange={setQ}
                                searchPlaceholder='Search title, excerpt, or tags...'
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
                                compact={false}
                        />
                       <ul className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 md:gap-8 py-4 mt-4 w-full'>
                                {filteredPosts.map((post, index) => (
                                  <div key={post.slug} className="stagger-fade-in" style={{ animationDelay: `${Math.min(index * 100, 800)}ms` }}>
                                    <BlogCard post={post} />
                                  </div>
                                ))}
                        </ul>
                </section>
        );
}
