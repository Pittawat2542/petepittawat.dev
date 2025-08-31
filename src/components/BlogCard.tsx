import { ArrowRight, Calendar, BookOpen } from 'lucide-react';

import type { BlogPost } from '../types';

type Props = {
  post: BlogPost;
  featured?: boolean;
  allPosts?: BlogPost[]; // To calculate series part number
};

export default function BlogCard({ post, featured = false, allPosts = [] }: Readonly<Props>) {
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
  return (
    <li className={`cursor-pointer rounded-2xl border border-border bg-card glass-card text-card-foreground shadow-sm group w-full h-full hyphens-auto blog-card ${featured ? 'card-featured' : ''}`}>
      <a
        className="flex flex-col align-middle p-4 md:p-6 h-full text-[color:var(--white)] hover:text-[color:var(--white)] focus-visible:text-[color:var(--white)]"
        href={`/blog/${post.slug}`}
      >
        {post.data.coverImage?.src ? (
          <div className="mb-4 md:mb-6 overflow-hidden rounded-xl">
            <img
              className="w-full h-auto transition-transform duration-200 ease-out group-hover:scale-[1.02] will-change-transform"
              src={post.data.coverImage.src}
              width={post.data.coverImage.width}
              height={post.data.coverImage.height}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
              alt={`Cover image for article: ${post.data.title}`}
            />
          </div>
        ) : null}
        
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
        
        <div className="flex items-start gap-3 mb-2">
          <h4 className="text-xl md:text-3xl font-bold tracking-tight text-[color:var(--accent)] flex-1">
            {post.data.title}
          </h4>
        </div>
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
        <p className="text-left md:text-justify leading-6 md:leading-7 text-[color:var(--white)]/80">
          {post.data.excerpt}
        </p>
        <div className="mt-3 md:mt-4 flex items-center gap-2 text-sm text-[color:var(--accent)]/80 group/cta mt-auto pt-2">
          <span className="font-medium">Read more</span>
          <ArrowRight size={14} className="icon-bounce transition-transform group-hover/cta:translate-x-1" aria-hidden="true" />
        </div>
      </a>
    </li>
  );
}
