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
 * - Responsive layout with consistent vertical presentation
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
  className = '',
  style,
}) => {
  const { isPartOfSeries, partNumber, totalParts, seriesTitle } = useBlogCardSeries(
    post,
    Array.from(allPosts)
  );
  const fallbackTag = post.data.tags?.[0] ?? 'Article';
  const { glowStyle, handleMouseMove, handleMouseLeave } = useGlassGlow<HTMLAnchorElement>();

  const contentLayout = 'flex flex-col gap-5';
  const paddingClasses = 'px-6 pt-6 pb-7 md:px-7 md:pt-8 md:pb-9';
  const barPadding = 'px-6 md:px-7';

  return (
    <li
      style={style}
      className={`group blog-card flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[color:var(--black-nav)]/45 text-[color:var(--white)] shadow-lg shadow-black/20 backdrop-blur-sm transition-transform duration-300 ease-out hover:-translate-y-1 hover:border-[color:var(--accent)]/35 ${
        featured ? 'card-featured' : ''
      } ${className}`}
    >
      <a
        className="relative flex h-full flex-col overflow-hidden rounded-[inherit] text-[color:var(--white)] transition-[transform,box-shadow] duration-400 ease-out focus-visible:text-[color:var(--white)]"
        href={`/blog/${String(post.slug)}`}
        aria-label={`Read blog post: ${post.data.title}`}
        style={glowStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <BlogCardOverlays />

        <div className="relative z-10 flex flex-1 flex-col">
          <div className={paddingClasses}>
            <div
              className={`${contentLayout} transition-transform duration-400 ease-out group-hover:translate-y-[-4px]`}
            >
              <BlogCardImage post={post} />

              <div className="flex min-w-0 flex-1 flex-col">
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

          <BlogCardFooter pubDate={post.data.pubDate} barPadding={barPadding} />
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
