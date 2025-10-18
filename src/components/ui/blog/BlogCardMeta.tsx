import { Calendar } from 'lucide-react';
import type { FC } from 'react';
import { memo } from 'react';

interface BlogCardMetaProps {
  readonly pubDate: Date;
}

const BlogCardMetaComponent: FC<BlogCardMetaProps> = ({ pubDate }) => {
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
    </div>
  );
};

// Memoize the component
export const BlogCardMeta = memo(BlogCardMetaComponent, (prevProps, nextProps) => {
  return prevProps.pubDate === nextProps.pubDate;
});

BlogCardMeta.displayName = 'BlogCardMeta';
export default BlogCardMeta;
