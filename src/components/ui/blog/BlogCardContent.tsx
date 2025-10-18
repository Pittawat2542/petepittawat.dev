import BlogCardMeta from './BlogCardMeta';
import BlogCardTag from './BlogCardTag';
import type { FC } from 'react';
import { memo } from 'react';

interface BlogCardContentProps {
  readonly title: string;
  readonly excerpt: string;
  readonly pubDate: Date;
  readonly isPartOfSeries: boolean;
  readonly seriesTitle?: string;
  readonly partNumber: number;
  readonly totalParts: number;
  readonly fallbackTag: string;
}

const BlogCardContentComponent: FC<BlogCardContentProps> = ({
  title,
  excerpt,
  pubDate,
  isPartOfSeries,
  seriesTitle,
  partNumber,
  totalParts,
  fallbackTag,
}) => {
  return (
    <div className="flex flex-1 flex-col gap-3 md:gap-4">
      <div className="flex items-center gap-1.5 text-[11px] tracking-[0.15em] text-white/60 uppercase transition-all duration-300 group-hover:text-white/75 md:gap-2 md:text-xs">
        <BlogCardTag
          isPartOfSeries={isPartOfSeries}
          {...(seriesTitle && { seriesTitle })}
          partNumber={partNumber}
          totalParts={totalParts}
          fallbackTag={fallbackTag}
        />
      </div>

      <div className="space-y-3 md:space-y-4">
        <h3 className="text-xl leading-snug font-semibold tracking-tight text-[color:var(--white)] transition-colors duration-300 group-hover:text-white md:text-2xl md:leading-tight lg:text-3xl">
          {title}
        </h3>

        <BlogCardMeta pubDate={pubDate} />

        <p className="line-clamp-3 text-left text-sm leading-6 text-[color:var(--white)]/78 transition-colors duration-300 group-hover:text-[color:var(--white,#ffffff)]/92 md:text-base md:leading-7">
          {excerpt}
        </p>
      </div>
    </div>
  );
};

// Memoize the component with custom comparison
export const BlogCardContent = memo(BlogCardContentComponent, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.excerpt === nextProps.excerpt &&
    prevProps.pubDate === nextProps.pubDate &&
    prevProps.isPartOfSeries === nextProps.isPartOfSeries &&
    prevProps.seriesTitle === nextProps.seriesTitle &&
    prevProps.partNumber === nextProps.partNumber &&
    prevProps.totalParts === nextProps.totalParts &&
    prevProps.fallbackTag === nextProps.fallbackTag
  );
});

BlogCardContent.displayName = 'BlogCardContent';
export default BlogCardContent;
