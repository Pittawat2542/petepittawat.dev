import { ArrowUpRight, Calendar, BookOpen } from 'lucide-react';

import type { BlogPost } from '../types';
import type React from 'react';
import { useGlassGlow } from '../lib/hooks';

type Props = {
  post: BlogPost;
  featured?: boolean;
  allPosts?: BlogPost[]; // To calculate series part number
  horizontalOnSingleColumn?: boolean; // Landing page: horizontal layout on 1-col
  className?: string;
  style?: React.CSSProperties;
};

export default function BlogCard({ post, featured = false, allPosts = [], horizontalOnSingleColumn = false, className = '', style }: Readonly<Props>) {
  // Check if post is part of a series
  const isPartOfSeries = post.data.seriesSlug && post.data.seriesTitle;
  let partNumber = post.data.seriesOrder || 0;
  let totalParts = 0;
  
  // Calculate total parts in series if allPosts is provided
  if (isPartOfSeries && allPosts.length > 0) {
    const seriesPosts = allPosts.filter(p => p.data.seriesSlug === post.data.seriesSlug);
    totalParts = seriesPosts.length;
    
    // If no explicit order, calculate based on date
    if (!partNumber) {
      const sortedPosts = [...seriesPosts].sort(
        (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf()
      );
      partNumber = sortedPosts.findIndex(p => p.slug === post.slug) + 1;
    }
  }
  const linkBase = horizontalOnSingleColumn
    ? 'flex gap-5 lg:flex-col p-4 md:p-6 h-full'
    : 'flex flex-col gap-5 p-4 md:p-6 h-full';

  const { glowStyle, handleMouseMove, handleMouseLeave } = useGlassGlow<HTMLAnchorElement>();

  return (
    <li style={style} className={`cursor-pointer rounded-3xl border border-border bg-card glass-card text-card-foreground shadow-sm group w-full h-full hyphens-auto blog-card overflow-hidden ${featured ? 'card-featured' : ''} ${className}`}>
      <a
        className={`${linkBase} text-[color:var(--white)] hover:text-[color:var(--white)] focus-visible:text-[color:var(--white)] relative`}
        href={`/blog/${post.slug}`}
        style={glowStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.06) 45%, transparent 100%)' }} />
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {/* Cover image */}
        {post.data.coverImage?.src ? (
          <div className={horizontalOnSingleColumn ? 'overflow-hidden rounded-2xl shrink-0 w-32 h-24 md:w-44 md:h-32 lg:w-full lg:h-auto' : 'overflow-hidden rounded-2xl'}>
            <img
              className={`${horizontalOnSingleColumn ? 'h-full w-full object-cover lg:h-auto lg:w-full' : 'w-full h-auto'} transition-transform duration-300 ease-out group-hover:scale-[1.04] will-change-transform`}
              src={post.data.coverImage.src}
              width={post.data.coverImage.width}
              height={post.data.coverImage.height}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              sizes={horizontalOnSingleColumn ? '(min-width: 1024px) 600px, 176px' : '(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw'}
              alt={`Cover image for article: ${post.data.title}`}
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(59,130,246,0.18),rgba(139,92,246,0.12))] p-6 text-xs uppercase tracking-[0.15em] text-white/70">
            Field Notes
          </div>
        )}

        {/* Right/content column */}
        <div className={horizontalOnSingleColumn ? 'flex min-w-0 flex-1 flex-col lg:justify-start' : 'flex min-w-0 flex-1 flex-col'}>
          {/* Series badge */}
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-white/60">
            {isPartOfSeries ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[color:var(--accent)]">
                <BookOpen size={12} />
                {post.data.seriesTitle}
                {totalParts > 0 && (
                  <span className="text-white/60">({partNumber}/{totalParts})</span>
                )}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 px-3 py-1 text-white/65">
                {post.data.tags?.[0] ?? 'Article'}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-[color:var(--white)] leading-tight">
                  {post.data.title}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm opacity-75">
                <div className="inline-flex items-center gap-1.5 uppercase tracking-wide">
                  <Calendar size={14} className="text-[color:var(--accent)]/70" aria-hidden="true" />
                  <time dateTime={post.data.pubDate.toISOString()}>
                    {post.data.pubDate.toLocaleDateString('en-us', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                </div>
              </div>
              <p className="text-left leading-7 text-[color:var(--white)]/80 line-clamp-3">
                {post.data.excerpt}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end text-sm text-[color:var(--white)]/70">
              <span className="inline-flex items-center gap-2 text-[color:var(--accent)]/85 font-medium tracking-tight transition-transform duration-200 group-hover:translate-x-1">
                Read article
                <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </div>
          </div>

          {/* No expansion overlay */}
        </div>
      </a>
    </li>
  );
}
