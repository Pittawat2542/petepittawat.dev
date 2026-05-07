import BlogCardMeta from './BlogCardMeta';
import BlogCardTag from './BlogCardTag';
import type { FC } from 'react';
import { memo } from 'react';

interface BlogCardContentProps {
  readonly title: string;
  readonly excerpt: string;
  readonly pubDate: Date;
  readonly lang: 'en' | 'th';
  readonly languageBadgeLabel?: string;
  readonly isPartOfSeries: boolean;
  readonly seriesTitle?: string;
  readonly partNumber: number;
  readonly totalParts: number;
  readonly fallbackTag: string;
  readonly tone?: 'default' | 'editorial' | undefined;
}

const BlogCardContentComponent: FC<BlogCardContentProps> = ({
  title,
  excerpt,
  pubDate,
  lang,
  languageBadgeLabel,
  isPartOfSeries,
  seriesTitle,
  partNumber,
  totalParts,
  fallbackTag,
  tone = 'default',
}) => {
  return (
    <div className="flex flex-1 flex-col gap-3 md:gap-4">
      <div
        className={
          tone === 'editorial'
            ? 'flex items-center gap-1.5 text-[11px] tracking-[0.15em] text-white/48 uppercase transition-all duration-300 group-hover:text-white/72 md:gap-2 md:text-xs'
            : 'flex items-center gap-1.5 text-[11px] tracking-[0.15em] text-white/60 uppercase transition-all duration-300 group-hover:text-white/75 md:gap-2 md:text-xs'
        }
      >
        <BlogCardTag
          isPartOfSeries={isPartOfSeries}
          {...(seriesTitle && { seriesTitle })}
          partNumber={partNumber}
          totalParts={totalParts}
          fallbackTag={fallbackTag}
          tone={tone}
        />
      </div>

      <div className="space-y-3 md:space-y-4">
        <h3
          className={
            tone === 'editorial'
              ? 'text-xl leading-snug font-semibold tracking-[-0.03em] text-white transition-colors duration-300 group-hover:text-[color:var(--card-accent,var(--accent))] md:text-[1.8rem] md:leading-tight lg:text-[2.15rem]'
              : 'text-xl leading-snug font-semibold tracking-tight text-[color:var(--white)] transition-colors duration-300 group-hover:text-white md:text-2xl md:leading-tight lg:text-3xl'
          }
        >
          {title}
        </h3>

        <BlogCardMeta
          pubDate={pubDate}
          lang={lang}
          languageBadgeLabel={languageBadgeLabel}
          tone={tone}
        />

        <p
          className={
            tone === 'editorial'
              ? 'line-clamp-3 text-left text-sm leading-6 text-white/68 transition-colors duration-300 group-hover:text-white/84 md:text-base md:leading-7'
              : 'line-clamp-3 text-left text-sm leading-6 text-[color:var(--white)]/78 transition-colors duration-300 group-hover:text-[color:var(--white,#ffffff)]/92 md:text-base md:leading-7'
          }
        >
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
    prevProps.lang === nextProps.lang &&
    prevProps.languageBadgeLabel === nextProps.languageBadgeLabel &&
    prevProps.isPartOfSeries === nextProps.isPartOfSeries &&
    prevProps.seriesTitle === nextProps.seriesTitle &&
    prevProps.partNumber === nextProps.partNumber &&
    prevProps.totalParts === nextProps.totalParts &&
    prevProps.fallbackTag === nextProps.fallbackTag &&
    prevProps.tone === nextProps.tone
  );
});

BlogCardContent.displayName = 'BlogCardContent';
export default BlogCardContent;
