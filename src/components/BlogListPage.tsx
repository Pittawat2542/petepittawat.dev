import { useState } from 'react';
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
        const [selectedTag, setSelectedTag] = useState('All');
        const filteredPosts =
                selectedTag === 'All'
                        ? posts
                        : posts.filter((post) => post.data.tags.includes(selectedTag));

       return (
               <section className='flex w-full flex-col'>
                        <p className='italic text-end opacity-80'>{filteredPosts.length} entries</p>
                        <hr className='block h-px border-0 border-t mt-2 p-0 border-[color:var(--white)]/10' />
                       <div className='mt-4 flex flex-wrap gap-2 justify-center'>
                                {tags.map((tag) => (
                                  <Button
                                    key={tag}
                                    variant="pill"
                                    onClick={() => setSelectedTag(tag)}
                                    disabled={selectedTag === tag}
                                    className={`mb-2 min-w-12 ${selectedTag === tag ? 'cursor-default ring-[color:var(--accent)] text-[color:var(--accent)]' : ''}`}
                                  >
                                    {tag}
                                  </Button>
                                ))}
                        </div>
                        <hr className='block h-px border-0 border-t mt-2 mb-4 p-0 border-[color:var(--white)]/10' />
                       <ul className='columns-1 lg:columns-2 2xl:columns-3 gap-6 md:gap-8 py-4 mt-4 w-full'>
                                {filteredPosts.map((post) => (
                                        <li
                                                key={post.data.title}
                                                className='mx-auto pointer rounded-3xl bg-[color:var(--black-nav)]/80 backdrop-blur-sm ring-1 ring-[color:var(--white)]/10 hover:ring-[color:var(--accent)] hover:-translate-y-1 shadow-sm mb-6 md:mb-8 break-inside-avoid-column transition-all duration-200 ease-in-out md:max-w-lg lg:max-w-md w-auto hyphens-auto'
                                        >
                                                <a
                                                        className='flex flex-col align-middle p-6 h-full'
                                                        href={`/blog/${post.slug}/`}
                                                >
                                                        <img
                                                                className='rounded-xl mb-6'
                                                                src={post.data.coverImage?.src}
                                                                alt={post.data.title}
                                                        />
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
                                                        <p className='mt-3 text-justify leading-6 text-[color:var(--white)]/80'>{post.data.excerpt}</p>
                                                </a>
                                        </li>
                                ))}
                        </ul>
                </section>
        );
}
