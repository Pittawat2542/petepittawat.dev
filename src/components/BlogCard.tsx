import { ArrowRight, Calendar, BookOpen } from 'lucide-react';

import type { BlogPost } from '../types';
import type React from 'react';

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
    ? 'flex gap-4 lg:flex-col align-middle p-4 md:p-6 h-full'
    : 'flex flex-col align-middle p-4 md:p-6 h-full';

  return (
    <li style={style} className={`cursor-pointer rounded-2xl border border-border bg-card glass-card text-card-foreground shadow-sm group w-full h-full hyphens-auto blog-card ${featured ? 'card-featured' : ''} ${className}`}>
      <a
        className={`${linkBase} text-[color:var(--white)] hover:text-[color:var(--white)] focus-visible:text-[color:var(--white)]`}
        href={`/blog/${post.slug}`}
      >
        {/* Cover image */}
        {post.data.coverImage?.src ? (
          <div
            className={horizontalOnSingleColumn ?
              'overflow-hidden rounded-xl shrink-0 w-32 h-24 md:w-44 md:h-32 lg:w-full lg:h-auto lg:mb-6' :
              'mb-4 md:mb-6 overflow-hidden rounded-xl'
            }
          >
            <img
              className={`${horizontalOnSingleColumn ? 'h-full w-full object-cover lg:h-auto lg:w-full' : 'w-full h-auto'} transition-transform duration-200 ease-out group-hover:scale-[1.02] will-change-transform`}
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
        ) : null}

        {/* Right/content column */}
        <div className={horizontalOnSingleColumn ? 'flex min-w-0 flex-1 flex-col justify-between lg:justify-start' : ''}>
          {/* Series badge */}
          {isPartOfSeries && (
            <div className="mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color:var(--accent)]/15 border border-[color:var(--accent)]/30 text-xs font-medium">
                <BookOpen size={12} className="text-[color:var(--accent)]" />
                <span className="text-[color:var(--accent)]">
                  {post.data.seriesTitle}
                  {totalParts > 0 && (
                    <span className="ml-1 text-[color:var(--accent)]/70">
                      ({partNumber}/{totalParts})
                    </span>
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Title */}
          <div className="flex items-start gap-3 mb-2">
            <h3 className="text-xl md:text-3xl font-bold tracking-tight text-[color:var(--accent)] flex-1 line-clamp-2">
              {post.data.title}
            </h3>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs md:text-sm opacity-80 mb-2">
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

          {/* Excerpt + CTA */}
          <div className={horizontalOnSingleColumn ? 'mt-auto' : ''}>
            <p className="text-left md:text-justify leading-6 md:leading-7 text-[color:var(--white)]/80 clamp-fade-3">
              {post.data.excerpt}
            </p>
            <div className="mt-3 md:mt-4 flex items-center gap-2 group/cta pt-2">
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium
                           text-[color:var(--accent)] ring-1 ring-[color:var(--accent)]/40 bg-[color:var(--accent)]/10
                           transition-[background-color,color,border-color,transform,box-shadow] duration-150 ease-out
                           hover:bg-[color:var(--accent)]/20 hover:ring-[color:var(--accent)]/60 active:translate-y-px
                           shadow-[0_6px_18px_-12px_color-mix(in_oklab,var(--accent)_80%,transparent)]">
                <span>Read more</span>
                <ArrowRight
                  size={14}
                  className="transition-transform duration-150 group-hover/cta:translate-x-1.5"
                  aria-hidden="true"
                />
              </span>
            </div>
          </div>

          {/* No expansion overlay */}
        </div>
      </a>
    </li>
  );
}
