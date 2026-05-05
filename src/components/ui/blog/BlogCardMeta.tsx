import { Calendar } from 'lucide-react';
import type { FC } from 'react';
import { memo } from 'react';

interface BlogCardMetaProps {
  readonly pubDate: Date;
  readonly lang: 'en' | 'th';
  readonly languageBadgeLabel?: string | undefined;
}

const BlogCardMetaComponent: FC<BlogCardMetaProps> = ({ pubDate, lang, languageBadgeLabel }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/60 transition-colors duration-300 group-hover:text-white/80 md:text-xs lg:text-sm">
      <div className="inline-flex items-center gap-1.5 tracking-wide uppercase md:gap-2">
        <Calendar
          size={14}
          className="text-[color:var(--card-accent,var(--accent))]/70"
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
      {(languageBadgeLabel ?? (lang === 'th' ? 'TH' : undefined)) && (
        <span
          className={`rounded-full border border-white/10 bg-white/8 px-2 py-0.5 text-[10px] font-semibold text-white/85 ${
            languageBadgeLabel ? 'tracking-[0.04em]' : 'tracking-[0.18em] uppercase'
          }`}
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
    prevProps.languageBadgeLabel === nextProps.languageBadgeLabel
  );
});

BlogCardMeta.displayName = 'BlogCardMeta';
export default BlogCardMeta;
