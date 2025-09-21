import React, { memo } from 'react';

import type { BlogPost } from '@/types';
import FormattedDate from './FormattedDate';

interface RelatedPostsProps {
  readonly posts: BlogPost[];
}

const RelatedPostsComponent: React.FC<RelatedPostsProps> = ({ posts }) => {
  if (!posts.length) return null;

  return (
    <section className="mt-12 max-w-prose mx-auto">
      <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-4">Related posts</h2>
      <ul className="grid grid-cols-1 gap-4">
        {posts.map((p) => (
          <li 
            key={p.slug}
            className="rounded-xl border border-[color:var(--white)]/10 p-3 hover:border-[color:var(--accent)]/40 transition-[border-color,transform,box-shadow] duration-150 ease-out hover:translate-y-[-2px] will-change-transform"
          >
            <a href={`/blog/${String(p.slug)}`} className="flex items-start gap-3">
              <div className="shrink-0 w-20 h-14 overflow-hidden rounded-lg bg-white/10">
                {p.data.coverImage ? (
                  <img 
                    className="block h-full w-full object-cover object-center" 
                    src={typeof p.data.coverImage === 'string' ? p.data.coverImage : p.data.coverImage.src} 
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
                <h3 className="font-semibold leading-snug line-clamp-2">{p.data.title}</h3>
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