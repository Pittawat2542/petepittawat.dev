import { Calendar } from 'lucide-react';
import type { FC } from 'react';
import { memo } from 'react';

interface BlogCardMetaProps {
  readonly pubDate: Date;
  readonly lang: 'en' | 'th';
}

const BlogCardMetaComponent: FC<BlogCardMetaProps> = ({ pubDate, lang }) => {
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
      {lang === 'th' && (
        <span className="rounded-full border border-white/10 bg-white/8 px-2 py-0.5 text-[10px] font-semibold tracking-[0.18em] text-white/85 uppercase">
          TH
        </span>
      )}
    </div>
  );
};

// Memoize the component
export const BlogCardMeta = memo(BlogCardMetaComponent, (prevProps, nextProps) => {
  return prevProps.pubDate === nextProps.pubDate && prevProps.lang === nextProps.lang;
});

BlogCardMeta.displayName = 'BlogCardMeta';
export default BlogCardMeta;
