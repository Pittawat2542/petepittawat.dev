import { ArrowRight, Calendar } from 'lucide-react';

import type { BlogPost } from '../types';

type Props = {
  post: BlogPost;
  featured?: boolean;
};

export default function BlogCard({ post, featured = false }: Readonly<Props>) {
  return (
    <li className={`cursor-pointer rounded-2xl border border-border bg-card glass-card text-card-foreground shadow-sm group w-full h-full hyphens-auto blog-card ${featured ? 'card-featured' : ''}`}>
      <a
        className="flex flex-col align-middle p-6 h-full text-[color:var(--white)] hover:text-[color:var(--white)] focus-visible:text-[color:var(--white)]"
        href={`/blog/${post.slug}/`}
      >
        {post.data.coverImage?.src ? (
          <div className="mb-6 overflow-hidden rounded-xl">
            <img
              className="w-full h-auto transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"
              src={post.data.coverImage.src}
              width={post.data.coverImage.width}
              height={post.data.coverImage.height}
              loading="lazy"
              decoding="async"
              alt={post.data.title}
            />
          </div>
        ) : null}
        <div className="flex items-start gap-3 mb-2">
          <h4 className="text-2xl md:text-3xl font-bold tracking-tight text-[color:var(--accent)] flex-1">
            {post.data.title}
          </h4>
        </div>
        <div className="flex items-center gap-4 text-sm opacity-80 mb-2">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-[color:var(--accent)]/70 icon-bounce" aria-hidden="true" />
            <time dateTime={post.data.pubDate.toISOString()} className="italic">
              {post.data.pubDate.toLocaleDateString('en-us', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          </div>
        </div>
        <p className="text-justify leading-6 text-[color:var(--white)]/80">
          {post.data.excerpt}
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-[color:var(--accent)]/80 group/cta">
          <span className="font-medium">Read more</span>
          <ArrowRight size={14} className="icon-bounce transition-transform group-hover/cta:translate-x-1" aria-hidden="true" />
        </div>
      </a>
    </li>
  );
}
