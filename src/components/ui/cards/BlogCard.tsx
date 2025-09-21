

import type { CSSProperties, FC } from 'react';

import { BlogCardContent } from '@/components/ui/blog/BlogCardContent';
import { BlogCardFooter } from '@/components/ui/blog/BlogCardFooter';
import { BlogCardImage } from '@/components/ui/blog/BlogCardImage';
import { BlogCardOverlays } from '@/components/ui/blog/BlogCardOverlays';
import type { BlogPost } from '@/types';
import { memo } from 'react';
import { useBlogCardSeries } from '@/lib/useBlogCardSeries';
import { useGlassGlow } from '@/lib/hooks';

/**
 * Blog post card component properties
 */
interface BlogCardProps {
  /** The blog post data to display */
  readonly post: BlogPost;
  /** Whether this card should be displayed with featured styling */
  readonly featured?: boolean | undefined;
  /** Array of all posts used to calculate series information */
  readonly allPosts?: readonly BlogPost[] | undefined;
  /** Whether to use horizontal layout on single column displays */
  readonly horizontalOnSingleColumn?: boolean | undefined;
  /** Additional CSS classes to apply */
  readonly className?: string | undefined;
  /** Inline styles to apply */
  readonly style?: CSSProperties | undefined;
}

/**
 * A responsive blog post card component with glass morphism effects.
 * 
 * Features:
 * - Glass morphism design with hover effects
 * - Responsive layout (horizontal on single column displays)
 * - Series detection and display
 * - Optimized with React.memo for performance
 * - Accessible with proper ARIA labels
 * 
 * @param props - The component props
 * @returns A memoized blog card component
 */
const BlogCardComponent: FC<BlogCardProps> = ({ 
  post, 
  featured = false, 
  allPosts = [], 
  horizontalOnSingleColumn = false, 
  className = '', 
  style 
}) => {
  const { isPartOfSeries, partNumber, totalParts, seriesTitle } = useBlogCardSeries(post, Array.from(allPosts));
  const fallbackTag = post.data.tags?.[0] ?? 'Article';
  const { glowStyle, handleMouseMove, handleMouseLeave } = useGlassGlow<HTMLAnchorElement>();

  const contentLayout = horizontalOnSingleColumn ? 'flex gap-5 lg:flex-col' : 'flex flex-col gap-5';
  const paddingClasses = horizontalOnSingleColumn
    ? 'px-4 pt-4 pb-6 md:px-6 md:pt-6 md:pb-7'
    : 'px-5 pt-5 pb-6 md:px-7 md:pt-7 md:pb-8';
  const barPadding = horizontalOnSingleColumn ? 'px-4 md:px-5' : 'px-5 md:px-6';

  return (
    <li 
      style={style} 
      className={`cursor-pointer rounded-3xl border border-border bg-card glass-card text-card-foreground shadow-sm group w-full h-full hyphens-auto blog-card overflow-hidden ${
        featured ? 'card-featured' : ''
      } ${className}`}
    >
      <a
        className="relative flex h-full flex-col overflow-hidden rounded-[inherit] text-[color:var(--white)] focus-visible:text-[color:var(--white)] transition-[transform,box-shadow] duration-500 ease-out group-hover:-translate-y-[2px] group-hover:shadow-[0_22px_48px_-30px_rgba(0,15,40,0.95)]"
        href={`/blog/${String(post.slug)}`}
        aria-label={`Read blog post: ${post.data.title}`}
        style={glowStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <BlogCardOverlays />

        <div className="relative z-10 flex flex-1 flex-col">
          <div className={paddingClasses}>
            <div className={`${contentLayout} transition-transform duration-500 ease-out group-hover:translate-y-[-2px]`}>
              <BlogCardImage 
                post={post} 
                horizontalOnSingleColumn={horizontalOnSingleColumn} 
              />

              <div className={horizontalOnSingleColumn ? 'flex min-w-0 flex-1 flex-col lg:justify-start' : 'flex min-w-0 flex-1 flex-col'}>
                <BlogCardContent 
                  title={post.data.title}
                  excerpt={post.data.excerpt}
                  pubDate={post.data.pubDate}
                  isPartOfSeries={isPartOfSeries}
                  seriesTitle={seriesTitle || ''}
                  partNumber={partNumber}
                  totalParts={totalParts}
                  fallbackTag={fallbackTag}
                />
              </div>
            </div>
          </div>

          <BlogCardFooter 
            pubDate={post.data.pubDate} 
            barPadding={barPadding} 
          />
        </div>
      </a>
    </li>
  );
};

/**
 * Memoized blog card component for optimal performance.
 * 
 * The component is memoized with a custom comparison function that checks:
 * - Post slug (primary identifier)
 * - Featured status
 * - Layout preferences
 * - CSS classes and all posts reference
 * 
 * This prevents unnecessary re-renders when parent components update
 * but the card's essential props remain unchanged.
 */
export const BlogCard = memo(BlogCardComponent, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.post.slug === nextProps.post.slug &&
    prevProps.featured === nextProps.featured &&
    prevProps.horizontalOnSingleColumn === nextProps.horizontalOnSingleColumn &&
    prevProps.className === nextProps.className &&
    prevProps.allPosts === nextProps.allPosts
  );
});
BlogCard.displayName = 'BlogCard';

/**
 * Default export for backward compatibility with existing imports.
 * 
 * @deprecated Consider using the named export `BlogCard` instead
 */
export default BlogCard;
