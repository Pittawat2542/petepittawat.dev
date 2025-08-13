import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useMemo, useState } from 'react';

import BlogCard from './BlogCard';
import type { BlogPost } from '../types';
import { ChevronDown } from 'lucide-react';
import SearchInput from './ui/SearchInput';

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
                          <SearchInput
                            value={q}
                            onChange={setQ}
                            placeholder='Search title, excerpt, or tags...'
                            ariaLabel='Search blog posts'
                          />
                        </div>
                        <div className='flex items-center gap-4'>
                          <DropdownMenu>
                            Sort:
                            <DropdownMenuTrigger className='inline-flex items-center gap-1.5 rounded-md border border-input bg-transparent px-2.5 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors'>
                              {sort === 'newest' ? 'Newest' : 'Oldest'}
                              <ChevronDown size={14} className='opacity-80' />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='min-w-[10rem]'>
                              <DropdownMenuItem onClick={() => setSort('newest')}>Newest</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setSort('oldest')}>Oldest</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        </div>
                        <p className='italic text-end opacity-80 mt-2' role='status' aria-live='polite'>
                          {filteredPosts.length} entries
                        </p>
                        <hr className='block h-px border-0 border-t mt-2 p-0 border-[color:var(--white)]/10' />
                        
                        {/* Improved Tag Selection Pane */}
                        <div className='mt-6 mb-4'>
                          <div className='flex items-center justify-between mb-3'>
                            <h3 id='tag-filter-heading' className='font-medium text-sm opacity-80'>Filter by tags</h3>
                            {selectedTags.size > 0 && (
                              <button 
                                onClick={() => setSelectedTags(new Set())}
                                className='text-xs opacity-70 hover:opacity-100 transition-opacity'
                              >
                                Clear all
                              </button>
                            )}
                          </div>
                          <div className='flex flex-wrap gap-2' role='group' aria-labelledby='tag-filter-heading'>
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
