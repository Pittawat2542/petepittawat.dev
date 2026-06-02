import BlogCardMeta from './BlogCardMeta';
import BlogCardTag from './BlogCardTag';
import type { FC } from 'react';
import { memo } from 'react';

interface BlogCardContentProps {
  readonly title: string;
  readonly excerpt: string;
  readonly pubDate: Date;
  readonly lang: 'en' | 'th';
  readonly readingTimeMin?: number | undefined;
  readonly languageBadgeLabel?: string;
  readonly isPartOfSeries: boolean;
  readonly seriesTitle?: string;
  readonly partNumber: number;
  readonly totalParts: number;
  readonly fallbackTag: string;
  readonly showTag?: boolean | undefined;
  readonly tone?: 'default' | 'editorial' | undefined;
  readonly presentation?: 'standard' | 'featured' | 'compact' | undefined;
}

const BlogCardContentComponent: FC<BlogCardContentProps> = ({
  title,
  excerpt,
  pubDate,
  lang,
  readingTimeMin,
  languageBadgeLabel,
  isPartOfSeries,
  seriesTitle,
  partNumber,
  totalParts,
  fallbackTag,
  showTag = true,
  tone = 'default',
  presentation = 'standard',
}) => {
  const titleClassName =
    tone === 'editorial'
      ? presentation === 'compact'
        ? 'line-clamp-3 text-lg leading-snug font-semibold text-white transition-colors duration-300 group-hover:text-[color:var(--card-accent,var(--accent))] md:text-xl md:leading-tight'
        : presentation === 'featured'
          ? 'text-2xl leading-tight font-semibold text-white transition-colors duration-300 group-hover:text-[color:var(--card-accent,var(--accent))] md:text-3xl'
          : 'text-xl leading-snug font-semibold text-white transition-colors duration-300 group-hover:text-[color:var(--card-accent,var(--accent))] md:text-2xl md:leading-tight'
      : 'text-xl leading-snug font-semibold tracking-tight text-[color:var(--white)] transition-colors duration-300 group-hover:text-white md:text-2xl md:leading-tight lg:text-3xl';
  const excerptClassName =
    tone === 'editorial'
      ? presentation === 'compact'
        ? 'line-clamp-2 text-left text-sm leading-6 text-white/66 transition-colors duration-300 group-hover:text-white/82'
        : 'line-clamp-3 text-left text-sm leading-6 text-white/68 transition-colors duration-300 group-hover:text-white/84 md:text-base md:leading-7'
      : 'line-clamp-3 text-left text-sm leading-6 text-[color:var(--white)]/78 transition-colors duration-300 group-hover:text-[color:var(--white,#ffffff)]/92 md:text-base md:leading-7';

  return (
    <div
      className={
        presentation === 'compact'
          ? 'flex flex-1 flex-col gap-2.5'
          : 'flex flex-1 flex-col gap-3 md:gap-4'
      }
    >
      {showTag ? (
        <div
          className={
            tone === 'editorial'
              ? 'type-caption flex items-center gap-1.5 tracking-[0.15em] text-white/48 uppercase transition-all duration-300 group-hover:text-white/72 md:gap-2 md:text-xs'
              : 'type-caption flex items-center gap-1.5 tracking-[0.15em] text-white/60 uppercase transition-all duration-300 group-hover:text-white/75 md:gap-2 md:text-xs'
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
      ) : null}

      <div className={presentation === 'compact' ? 'space-y-2.5' : 'space-y-3 md:space-y-4'}>
        <h3 className={titleClassName}>{title}</h3>

        <BlogCardMeta
          pubDate={pubDate}
          lang={lang}
          readingTimeMin={readingTimeMin}
          languageBadgeLabel={languageBadgeLabel}
          tone={tone}
        />

        <p className={excerptClassName}>{excerpt}</p>
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
    prevProps.readingTimeMin === nextProps.readingTimeMin &&
    prevProps.languageBadgeLabel === nextProps.languageBadgeLabel &&
    prevProps.isPartOfSeries === nextProps.isPartOfSeries &&
    prevProps.seriesTitle === nextProps.seriesTitle &&
    prevProps.partNumber === nextProps.partNumber &&
    prevProps.totalParts === nextProps.totalParts &&
    prevProps.fallbackTag === nextProps.fallbackTag &&
    prevProps.showTag === nextProps.showTag &&
    prevProps.tone === nextProps.tone &&
    prevProps.presentation === nextProps.presentation
  );
});

BlogCardContent.displayName = 'BlogCardContent';
export default BlogCardContent;
