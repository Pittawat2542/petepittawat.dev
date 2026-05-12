import type { CSSProperties, FC } from 'react';
import { memo, useMemo } from 'react';
import { ExternalLink } from 'lucide-react';

import { BlogCardContent } from '@/components/ui/blog/BlogCardContent';
import { BlogCardFooter } from '@/components/ui/blog/BlogCardFooter';
import { BlogCardImage } from '@/components/ui/blog/BlogCardImage';
import { BlogCardOverlays } from '@/components/ui/blog/BlogCardOverlays';
import { getBlogCoverCssVariables, resolveBlogCoverSpec } from '@/lib/blog-cover';
import {
  getBlogExclusiveLocaleLabel,
  getBlogPostRouteSlug,
  getBlogPostPath,
  type BlogPostLanguageState,
} from '@/lib/blog-translations';
import type { BlogPost } from '@/types';
import { cn } from '@/lib/utils';
import { useBlogCardSeries } from '@/lib/useBlogCardSeries';
import { useGlassGlow } from '@/lib/hooks';

const CARD_CONTENT_LAYOUT = 'flex flex-col gap-5 md:gap-4 lg:gap-6';
const CARD_PADDING = 'px-5 pt-5 pb-5 md:px-6 md:pt-6 md:pb-6 lg:px-8 lg:pt-8 lg:pb-8';
const CARD_BAR_PADDING = 'px-5 md:px-6 lg:px-8';
const CARD_ANIMATION_CLASS =
  'transition-transform duration-400 ease-out group-hover:translate-y-[-4px]';

/**
 * Blog post card component properties
 */
interface BlogCardProps {
  /** The blog post data to display */
  readonly post: { id: string; collection: 'blog'; data: BlogPost['data'] };
  /** Whether this card should be displayed with featured styling */
  readonly featured?: boolean | undefined;
  /** Array of all posts used to calculate series information */
  readonly allPosts?:
    | readonly { id: string; collection: 'blog'; data: BlogPost['data'] }[]
    | undefined;
  /** Locale-aware translation state for this card */
  readonly languageState?:
    | BlogPostLanguageState<{ id: string; collection: 'blog'; data: BlogPost['data'] }>
    | undefined;
  /** Additional CSS classes to apply */
  readonly className?: string | undefined;
  /** Inline styles to apply */
  readonly style?: CSSProperties | undefined;
  /** Presentational tone for page-specific styling */
  readonly tone?: 'default' | 'editorial' | undefined;
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
  languageState,
  className,
  style,
  tone = 'default',
}) => {
  const { isPartOfSeries, partNumber, totalParts, seriesTitle } = useBlogCardSeries(
    post,
    Array.from(allPosts)
  );
  const fallbackTag = post.data.tags?.[0] ?? 'Article';
  const { glowStyle, handleMouseMove, handleMouseLeave } = useGlassGlow<HTMLAnchorElement>();
  const coverSpec = useMemo(
    () =>
      resolveBlogCoverSpec({
        title: post.data.title,
        excerpt: post.data.excerpt,
        lang: post.data.lang,
        routeSlug: getBlogPostRouteSlug(post),
        tags: post.data.tags,
        pubDate: post.data.pubDate,
      }),
    [post]
  );
  const mergedStyle: CSSProperties = {
    ...getBlogCoverCssVariables(coverSpec.theme),
    ...style,
  } as CSSProperties;

  const listClassName = cn(
    tone === 'editorial'
      ? 'group blog-card blog-card--editorial flex h-full w-full flex-col overflow-hidden rounded-[1.8rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.14),transparent_26%),linear-gradient(180deg,rgba(11,20,38,0.95),rgba(8,15,29,0.97))] text-white shadow-[0_30px_70px_-42px_rgba(3,7,18,0.82)] transition-[transform,box-shadow,border-color] duration-300 ease-out'
      : 'group blog-card aurora-card flex h-full w-full flex-col text-[color:var(--white)] transition-transform duration-300 ease-out',
    featured && 'aurora-card--featured',
    className
  );

  return (
    <li style={mergedStyle} className={listClassName}>
      {tone === 'default' && <div className="aurora-card__wrapper" />}
      <a
        className={cn(
          'relative flex h-full flex-col overflow-hidden rounded-[inherit] transition-[transform,box-shadow] duration-400 ease-out will-change-transform',
          tone === 'editorial'
            ? 'text-white focus-visible:text-white'
            : 'text-[color:var(--white)] focus-visible:text-[color:var(--white)]'
        )}
        href={post.data.externalUrl ?? getBlogPostPath(post)}
        target={post.data.externalUrl ? '_blank' : undefined}
        rel={post.data.externalUrl ? 'noopener noreferrer' : undefined}
        aria-label={`Read ${post.data.externalUrl ? 'external' : ''} blog post: ${post.data.title}`}
        style={tone === 'editorial' ? undefined : glowStyle}
        onMouseMove={tone === 'editorial' ? undefined : handleMouseMove}
        onMouseLeave={tone === 'editorial' ? undefined : handleMouseLeave}
      >
        {tone === 'default' && <BlogCardOverlays />}

        {post.data.externalUrl && (
          <div
            className={cn(
              'absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
              tone === 'editorial'
                ? 'border border-white/10 bg-[rgba(15,23,42,0.72)] text-white/82 shadow-[0_12px_24px_-20px_rgba(3,7,18,0.72)]'
                : 'border border-white/10 bg-black/50 text-white backdrop-blur-md'
            )}
          >
            <ExternalLink className="h-3 w-3" />
            <span>External</span>
          </div>
        )}

        <div
          className={cn(
            tone === 'editorial' ? 'flex flex-1 flex-col' : 'aurora-card__body flex flex-1 flex-col'
          )}
        >
          <div className={CARD_PADDING}>
            <div className={cn(CARD_CONTENT_LAYOUT, CARD_ANIMATION_CLASS)}>
              <BlogCardImage post={post} tone={tone} />

              <div className="flex min-w-0 flex-1 flex-col">
                <BlogCardContent
                  title={post.data.title}
                  excerpt={post.data.excerpt}
                  pubDate={post.data.pubDate}
                  lang={post.data.lang}
                  tone={tone}
                  {...(languageState?.isFallback
                    ? { languageBadgeLabel: getBlogExclusiveLocaleLabel(post.data.lang) }
                    : {})}
                  isPartOfSeries={isPartOfSeries}
                  seriesTitle={seriesTitle ?? ''}
                  partNumber={partNumber}
                  totalParts={totalParts}
                  fallbackTag={fallbackTag}
                />
              </div>
            </div>
          </div>

          <BlogCardFooter pubDate={post.data.pubDate} barPadding={CARD_BAR_PADDING} tone={tone} />
        </div>
      </a>
    </li>
  );
};

/**
 * Memoized blog card component for optimal performance.
 *
 * The component is memoized with a custom comparison function that checks:
 * - Post id (primary identifier)
 * - Featured status
 * - CSS classes and all posts reference
 *
 * This prevents unnecessary re-renders when parent components update
 * but the card's essential props remain unchanged.
 */
export const BlogCard = memo(BlogCardComponent, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.post.id === nextProps.post.id &&
    prevProps.featured === nextProps.featured &&
    prevProps.languageState === nextProps.languageState &&
    prevProps.className === nextProps.className &&
    prevProps.allPosts === nextProps.allPosts &&
    prevProps.tone === nextProps.tone
  );
});
BlogCard.displayName = 'BlogCard';

/**
 * Default export for backward compatibility with existing imports.
 *
 * @deprecated Consider using the named export `BlogCard` instead
 */
export default BlogCard;
