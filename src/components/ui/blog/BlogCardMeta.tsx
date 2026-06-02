import { Calendar } from 'lucide-react';
import type { FC } from 'react';
import { memo } from 'react';

interface BlogCardMetaProps {
  readonly pubDate: Date;
  readonly lang: 'en' | 'th';
  readonly readingTimeMin?: number | undefined;
  readonly languageBadgeLabel?: string | undefined;
  readonly tone?: 'default' | 'editorial' | undefined;
}

const BlogCardMetaComponent: FC<BlogCardMetaProps> = ({
  pubDate,
  lang,
  readingTimeMin,
  languageBadgeLabel,
  tone = 'default',
}) => {
  return (
    <div
      className={
        tone === 'editorial'
          ? 'type-caption flex flex-wrap items-center gap-2 text-white/52 transition-colors duration-300 group-hover:text-white/72 md:text-xs lg:text-sm'
          : 'type-caption flex flex-wrap items-center gap-2 text-white/60 transition-colors duration-300 group-hover:text-white/80 md:text-xs lg:text-sm'
      }
    >
      <div className="inline-flex items-center gap-1.5 tracking-wide uppercase md:gap-2">
        <Calendar
          size={14}
          className={
            tone === 'editorial'
              ? 'text-[color:var(--card-accent,var(--accent))]/62'
              : 'text-[color:var(--card-accent,var(--accent))]/70'
          }
          aria-hidden="true"
        />
        <time dateTime={pubDate.toISOString()}>
          {pubDate.toLocaleDateString('en-us', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>
      </div>
      {typeof readingTimeMin === 'number' ? (
        <>
          <span aria-hidden="true">·</span>
          <span>{readingTimeMin} min read</span>
        </>
      ) : null}
      {(languageBadgeLabel ?? (lang === 'th' ? 'TH' : undefined)) && (
        <span
          className={`type-micro rounded-full px-2 py-0.5 font-semibold ${
            tone === 'editorial'
              ? 'border border-white/10 bg-white/[0.06] text-white/72'
              : 'border border-white/10 bg-white/8 text-white/85'
          } ${languageBadgeLabel ? 'tracking-[0.04em]' : 'tracking-[0.18em] uppercase'}`}
        >
          {languageBadgeLabel ?? 'TH'}
        </span>
      )}
    </div>
  );
};

// Memoize the component
export const BlogCardMeta = memo(BlogCardMetaComponent, (prevProps, nextProps) => {
  return (
    prevProps.pubDate === nextProps.pubDate &&
    prevProps.lang === nextProps.lang &&
    prevProps.readingTimeMin === nextProps.readingTimeMin &&
    prevProps.languageBadgeLabel === nextProps.languageBadgeLabel &&
    prevProps.tone === nextProps.tone
  );
});

BlogCardMeta.displayName = 'BlogCardMeta';
export default BlogCardMeta;
