import React, { memo } from 'react';

import type { BlogPost } from '@/types';
import FormattedDate from './FormattedDate';

interface RelatedPostsProps {
  readonly posts: BlogPost[];
}

const RelatedPostsComponent: React.FC<RelatedPostsProps> = ({ posts }) => {
  if (!posts.length) return null;

  return (
    <section className="mx-auto mt-12 max-w-prose">
      <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">Related posts</h2>
      <ul className="grid grid-cols-1 gap-4">
        {posts.map(p => (
          <li
            key={p.slug}
            className="rounded-xl border border-[color:var(--white)]/10 p-3 transition-[border-color,transform,box-shadow] duration-150 ease-out will-change-transform hover:translate-y-[-2px] hover:border-[color:var(--accent)]/40"
          >
            <a href={`/blog/${String(p.slug)}`} className="flex items-start gap-3">
              <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-white/10">
                {p.data.coverImage ? (
                  <img
                    className="block h-full w-full object-cover object-center"
                    src={
                      typeof p.data.coverImage === 'string'
                        ? p.data.coverImage
                        : p.data.coverImage.src
                    }
                    alt=""
                    width={160}
                    height={112}
                    loading="lazy"
                  />
                ) : (
                  <img
                    className="block h-full w-full object-cover object-center"
                    src={`/og/blog/${p.slug}.png`}
                    width="160"
                    height="112"
                    alt=""
                    loading="lazy"
                  />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="line-clamp-2 leading-snug font-semibold">{p.data.title}</h3>
                <p className="text-sm italic opacity-80">
                  <FormattedDate date={p.data.pubDate} />
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

const RelatedPosts = memo(RelatedPostsComponent);
RelatedPosts.displayName = 'RelatedPosts';

export default RelatedPosts;
export { RelatedPosts };
