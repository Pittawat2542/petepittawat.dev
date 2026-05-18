import type { CSSProperties, FC } from 'react';
import { memo, useMemo } from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';

import { BlogCardContent } from '@/components/ui/blog/BlogCardContent';
import { BlogCardImage } from '@/components/ui/blog/BlogCardImage';
import { BlogCardTag } from '@/components/ui/blog/BlogCardTag';
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
import MediaContentCard from './MediaContentCard';

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
  const languageLabel = languageState?.isFallback
    ? getBlogExclusiveLocaleLabel(post.data.lang)
    : post.data.lang === 'th'
      ? 'Thai edition'
      : 'English edition';
  const href = post.data.externalUrl ?? getBlogPostPath(post);

  return (
    <li className="flex h-full min-w-0">
      <MediaContentCard
        as="a"
        accent="var(--blog-cover-accent, var(--accent-blog))"
        featured={featured}
        className={cn('blog-card blog-card--editorial w-full', className)}
        style={mergedStyle}
        href={href}
        target={post.data.externalUrl ? '_blank' : undefined}
        rel={post.data.externalUrl ? 'noopener noreferrer' : undefined}
        aria-label={`Read ${post.data.externalUrl ? 'external ' : ''}blog post: ${post.data.title}`}
        media={<BlogCardImage post={post} tone={tone} />}
        mediaBadges={
          <>
            <BlogCardTag
              isPartOfSeries={isPartOfSeries}
              {...(seriesTitle && { seriesTitle })}
              partNumber={partNumber}
              totalParts={totalParts}
              fallbackTag={fallbackTag}
              tone="editorial"
            />
            <span className="type-caption inline-flex rounded-full border border-white/12 bg-slate-950/42 px-2.5 py-1 font-semibold tracking-[0.14em] text-white/76 uppercase backdrop-blur-md md:px-3 md:text-xs">
              {languageLabel}
            </span>
            {post.data.externalUrl ? (
              <span className="type-caption inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-slate-950/48 px-2.5 py-1 font-semibold text-white/82 backdrop-blur-md md:px-3 md:text-xs">
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
                External
              </span>
            ) : null}
          </>
        }
        footer={
          <div className="type-meta flex items-center justify-between gap-4 text-white/72 md:text-sm">
            <span className="type-micro font-semibold tracking-[0.28em] text-white/42 uppercase transition-colors duration-300 group-hover:text-white/68 md:text-xs">
              {post.data.pubDate.toLocaleDateString('en-us', { year: 'numeric' })}
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-white transition-colors duration-300 group-hover:text-[color:var(--card-accent,var(--accent))]">
              Continue reading
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/82 transition-[transform,background-color,color,border-color] duration-300 group-hover:translate-x-[3px] group-hover:border-[color:var(--card-accent,var(--accent))]/28 group-hover:bg-[color:var(--card-accent,var(--accent))] group-hover:text-slate-950 md:h-9 md:w-9">
                <ArrowUpRight size={17} strokeWidth={2} aria-hidden="true" />
              </span>
            </span>
          </div>
        }
      >
        <BlogCardContent
          title={post.data.title}
          excerpt={post.data.excerpt}
          pubDate={post.data.pubDate}
          lang={post.data.lang}
          tone="editorial"
          {...(languageState?.isFallback
            ? { languageBadgeLabel: getBlogExclusiveLocaleLabel(post.data.lang) }
            : {})}
          isPartOfSeries={isPartOfSeries}
          seriesTitle={seriesTitle ?? ''}
          partNumber={partNumber}
          totalParts={totalParts}
          fallbackTag={fallbackTag}
          showTag={false}
        />
      </MediaContentCard>
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
