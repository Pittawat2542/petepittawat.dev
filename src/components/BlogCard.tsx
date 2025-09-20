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
  const { glowStyle, handleMouseMove, handleMouseLeave } = useGlassGlow<HTMLAnchorElement>();

  const contentLayout = horizontalOnSingleColumn ? 'flex gap-5 lg:flex-col' : 'flex flex-col gap-5';
  const paddingClasses = horizontalOnSingleColumn
    ? 'px-4 pt-4 pb-6 md:px-6 md:pt-6 md:pb-7'
    : 'px-5 pt-5 pb-6 md:px-7 md:pt-7 md:pb-8';
  const barPadding = horizontalOnSingleColumn ? 'px-4 md:px-5' : 'px-5 md:px-6';

  return (
    <li style={style} className={`cursor-pointer rounded-3xl border border-border bg-card glass-card text-card-foreground shadow-sm group w-full h-full hyphens-auto blog-card overflow-hidden ${featured ? 'card-featured' : ''} ${className}`}>
      <a
        className="relative flex h-full flex-col overflow-hidden rounded-[inherit] text-[color:var(--white)] focus-visible:text-[color:var(--white)] transition-[transform,box-shadow] duration-500 ease-out group-hover:-translate-y-[2px] group-hover:shadow-[0_22px_48px_-30px_rgba(0,15,40,0.95)]"
        href={`/blog/${post.slug}`}
        style={glowStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.14) 0%, rgba(139,92,246,0.08) 40%, transparent 100%)' }}
        />
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(120%_120%_at_80%_-10%,rgba(255,255,255,0.16),transparent)] opacity-0 transition-opacity duration-[650ms] group-hover:opacity-90" />

        <div className="relative z-10 flex flex-1 flex-col">
          <div className={paddingClasses}>
            <div className={`${contentLayout} transition-transform duration-500 ease-out group-hover:translate-y-[-2px]`}>
              {/* Cover image */}
              {post.data.coverImage?.src ? (
                <div className={horizontalOnSingleColumn ? 'overflow-hidden rounded-2xl shrink-0 w-32 h-24 md:w-44 md:h-32 lg:w-full lg:h-auto' : 'overflow-hidden rounded-2xl'}>
                  <img
                    className={`${horizontalOnSingleColumn ? 'h-full w-full object-cover lg:h-auto lg:w-full' : 'w-full h-auto'} transition-transform duration-[650ms] ease-out group-hover:scale-[1.05] group-hover:rotate-[0.35deg] will-change-transform`}
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

              {/* Content column */}
              <div className={horizontalOnSingleColumn ? 'flex min-w-0 flex-1 flex-col lg:justify-start' : 'flex min-w-0 flex-1 flex-col'}>
                <div className="flex flex-1 flex-col gap-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-white/60 transition-all duration-300 group-hover:text-white/75">
                    {isPartOfSeries ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[color:var(--accent)] shadow-[0_6px_18px_rgba(9,14,24,0.25)] transition-all duration-300 group-hover:border-white/25 group-hover:bg-white/16 group-hover:text-[color:var(--accent)]/90">
                        <BookOpen size={12} />
                        {post.data.seriesTitle}
                        {totalParts > 0 && (
                          <span className="text-white/70 transition-colors duration-300 group-hover:text-white/85">({partNumber}/{totalParts})</span>
                        )}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/12 px-3 py-1 text-white/65 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/8 group-hover:text-white/85">
                        {post.data.tags?.[0] ?? 'Article'}
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-[color:var(--white)] leading-tight transition-colors duration-300 group-hover:text-white">
                      {post.data.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-white/60 transition-colors duration-300 group-hover:text-white/80">
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

                    <p className="text-left leading-7 text-[color:var(--white)]/78 transition-colors duration-300 group-hover:text-[color:var(--white,#ffffff)]/92 line-clamp-3">
                      {post.data.excerpt}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-auto">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-45 transition-opacity duration-300 group-hover:opacity-80" />
            <div className={`relative flex items-center justify-between gap-3 border-t border-white/12 bg-white/[0.032] ${barPadding} py-3 md:py-4 text-sm text-white/75 backdrop-blur-[18px] transition-all duration-300 ease-out group-hover:border-white/18 group-hover:bg-white/[0.085] group-hover:text-white`}>
              <span className="inline-flex items-center gap-1.5 font-medium tracking-tight text-[15px]">
                Continue reading
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] text-white/80 transition-all duration-300 ease-out group-hover:bg-[color:var(--accent,#6AC1FF)]/42 group-hover:text-white group-hover:shadow-[0_10px_22px_rgba(18,42,70,0.45)]">
                  <ArrowUpRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[2px]" />
                </span>
              </span>
            </div>
          </div>
        </div>
      </a>
    </li>
  );
}
