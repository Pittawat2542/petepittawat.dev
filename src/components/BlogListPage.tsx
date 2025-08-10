import { useMemo, useState } from 'react';
import type { BlogPost } from '../types';
import BlogCard from './BlogCard';

type BlogListPageProps = {
  posts: BlogPost[];
  tags: string[];
};

export default function BlogListPage({ posts, tags }: Readonly<BlogListPageProps>) {
        const [q, setQ] = useState('');
        const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
        const [sort, setSort] = useState<'newest' | 'oldest'>('newest');

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

       return (
               <section className='flex w-full flex-col'>
                        <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                        <div className='flex items-center gap-2 md:gap-3 w-full'>
                          <label className='relative w-full md:max-w-md' aria-label='Search blog posts'>
                            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='absolute left-3 top-1/2 -translate-y-1/2 opacity-70' aria-hidden='true'>
                              <circle cx='11' cy='11' r='8'></circle>
                              <path d='m21 21-4.3-4.3'></path>
                            </svg>
                            <input
                              type='search'
                              value={q}
                              onChange={(e) => setQ(e.target.value)}
                              placeholder='Search title, excerpt, or tags...'
                              className='input-glass w-full pl-9 pr-3 py-2 text-sm bg-transparent'
                            />
                          </label>
                        </div>
                        <div className='flex items-center gap-2'>
                          <label htmlFor='blog-sort' className='text-sm opacity-80'>Sort</label>
                          <div className='relative'>
                            <select
                              id='blog-sort'
                              value={sort}
                              onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')}
                              className='select-glass bg-transparent px-2 py-2 text-sm'
                            >
                              <option value='newest'>Newest</option>
                              <option value='oldest'>Oldest</option>
                            </select>
                            <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 opacity-70' aria-hidden='true'>
                              <path d='m7 10 5 5 5-5'></path>
                            </svg>
                          </div>
                        </div>
                        </div>
                        <p className='italic text-end opacity-80 mt-2'>{filteredPosts.length} entries</p>
                        <hr className='block h-px border-0 border-t mt-2 p-0 border-[color:var(--white)]/10' />
                        
                        {/* Improved Tag Selection Pane */}
                        <div className='mt-6 mb-4'>
                          <div className='flex items-center justify-between mb-3'>
                            <h3 className='font-medium text-sm opacity-80'>Filter by tags</h3>
                            {selectedTags.size > 0 && (
                              <button 
                                onClick={() => setSelectedTags(new Set())}
                                className='text-xs opacity-70 hover:opacity-100 transition-opacity'
                              >
                                Clear all
                              </button>
                            )}
                          </div>
                          <div className='flex flex-wrap gap-2'>
                            {tags.map((tag) => {
                              const active = tag === 'All' ? selectedTags.size === 0 : selectedTags.has(tag);
                              const tagCount = tag === 'All' 
                                ? posts.length 
                                : posts.filter(post => post.data.tags.includes(tag)).length;
                              
                              return (
                                <button
                                  key={tag}
                                  onClick={() => toggleTag(tag)}
                                  aria-pressed={active}
                                  className={`
                                    flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all duration-200
                                    ${active 
                                      ? 'bg-[color:var(--accent)] text-black font-medium' 
                                      : 'bg-[color:var(--black-nav)]/80 text-[color:var(--white)] ring-1 ring-[color:var(--white)]/10 hover:ring-[color:var(--accent)] hover:text-[color:var(--accent)]'}
                                    ${tag === 'All' ? 'font-medium' : ''}
                                  `}
                                >
                                  <span>{tag}</span>
                                  <span className={`text-xs ${active ? 'text-black/80' : 'opacity-70'}`}>
                                    {tagCount}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        
                        <hr className='block h-px border-0 border-t mt-2 mb-4 p-0 border-[color:var(--white)]/10' />
                       <ul className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 md:gap-8 py-4 mt-4 w-full'>
                                {filteredPosts.map((post) => (
                                  <BlogCard key={post.slug} post={post} />
                                ))}
                        </ul>
                </section>
        );
}
