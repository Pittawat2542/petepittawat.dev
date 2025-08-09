import { useMemo, useState } from 'react';
import Button from './ui/Button';

type BlogListPageProps = {
        posts: {
                id: string;
                body: string;
                slug: string;
                collection: string;
                data: {
                        title: string;
                        excerpt: string;
                        tags: string[];
                        pubDate: Date;
                        coverImage?: {
                                src: string;
                                width: number;
                                height: number;
                                format: string;
                        };
                };
        }[];
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
                            <input
                              type='search'
                              value={q}
                              onChange={(e) => setQ(e.target.value)}
                              placeholder='Search title, excerpt, or tags...'
                              className='w-full rounded-md border border-[color:var(--white)]/15 bg-transparent px-3 py-2 text-sm'
                              aria-label='Search blog posts'
                            />
                          </div>
                          <div className='flex items-center gap-2'>
                            <label htmlFor='blog-sort' className='text-sm opacity-80'>Sort</label>
                            <select
                              id='blog-sort'
                              value={sort}
                              onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')}
                              className='rounded-md border border-[color:var(--white)]/15 bg-transparent px-2 py-2 text-sm'
                            >
                              <option value='newest'>Newest</option>
                              <option value='oldest'>Oldest</option>
                            </select>
                          </div>
                        </div>
                        <p className='italic text-end opacity-80 mt-2'>{filteredPosts.length} entries</p>
                        <hr className='block h-px border-0 border-t mt-2 p-0 border-[color:var(--white)]/10' />
                       <div className='mt-4 flex flex-wrap gap-2 justify-center'>
                                {tags.map((tag) => {
                                  const active = tag === 'All' ? selectedTags.size === 0 : selectedTags.has(tag);
                                  return (
                                    <Button
                                      key={tag}
                                      variant="pill"
                                      onClick={() => toggleTag(tag)}
                                      className={`mb-2 min-w-12 ${active ? 'ring-[color:var(--accent)] text-[color:var(--accent)]' : ''}`}
                                    >
                                      {tag}
                                    </Button>
                                  );
                                })}
                        </div>
                        <hr className='block h-px border-0 border-t mt-2 mb-4 p-0 border-[color:var(--white)]/10' />
                       <ul className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 md:gap-8 py-4 mt-4 w-full'>
                                {filteredPosts.map((post) => (
                                        <li
                                                key={post.data.title}
                                                className='cursor-pointer glass-card group w-full h-full hyphens-auto'
                                        >
                                                <a
                                                        className='flex flex-col align-middle p-6 h-full'
                                                        href={`/blog/${post.slug}/`}
                                                >
                                                        {post.data.coverImage?.src ? (
                                                          <div className='mb-6 overflow-hidden rounded-xl'>
                                                            <img
                                                              className='w-full h-auto transition-transform duration-300 ease-in-out group-hover:scale-[1.03]'
                                                              src={post.data.coverImage.src}
                                                              alt={post.data.title}
                                                            />
                                                          </div>
                                                        ) : null}
                                                        <h4 className='text-2xl md:text-3xl font-bold tracking-tight mb-2'>
                                                                {post.data.title}
                                                        </h4>
                                                        <p className='italic opacity-80'>
                                                                Published on{' '}
                                                                <time dateTime={post.data.pubDate.toISOString()}>
                                                                        {post.data.pubDate.toLocaleDateString('en-us', {
                                                                                year: 'numeric',
                                                                                month: 'short',
                                                                                day: 'numeric',
                                                                        })}
                                                                </time>
                                                        </p>
                                                        <p className='mt-3 text-justify leading-6 text-[color:var(--white)]/80'>
                                                          {post.data.excerpt}
                                                        </p>
                                                </a>
                                        </li>
                                ))}
                        </ul>
                </section>
        );
}
