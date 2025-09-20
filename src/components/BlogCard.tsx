import '../styles/components/blog-card.css';

import BlogCardContent from './ui/BlogCardContent';
import BlogCardFooter from './ui/BlogCardFooter';
import BlogCardImage from './ui/BlogCardImage';
import BlogCardOverlays from './ui/BlogCardOverlays';
import type { BlogPost } from '../types';
import type React from 'react';
import { useBlogCardSeries } from '../lib/useBlogCardSeries';
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
  const { isPartOfSeries, partNumber, totalParts, seriesTitle } = useBlogCardSeries(post, allPosts);
  const fallbackTag = post.data.tags?.[0] ?? 'Article';
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
        aria-label={`Read blog post: ${post.data.title}`}
        style={glowStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <BlogCardOverlays />

        <div className="relative z-10 flex flex-1 flex-col">
          <div className={paddingClasses}>
            <div className={`${contentLayout} transition-transform duration-500 ease-out group-hover:translate-y-[-2px]`}>
              <BlogCardImage post={post} horizontalOnSingleColumn={horizontalOnSingleColumn} />

              <div className={horizontalOnSingleColumn ? 'flex min-w-0 flex-1 flex-col lg:justify-start' : 'flex min-w-0 flex-1 flex-col'}>
                <BlogCardContent 
                  title={post.data.title}
                  excerpt={post.data.excerpt}
                  pubDate={post.data.pubDate}
                  isPartOfSeries={isPartOfSeries}
                  seriesTitle={seriesTitle}
                  partNumber={partNumber}
                  totalParts={totalParts}
                  fallbackTag={fallbackTag}
                />
              </div>
            </div>
          </div>

          <BlogCardFooter pubDate={post.data.pubDate} barPadding={barPadding} />
        </div>
      </a>
    </li>
  );
}
