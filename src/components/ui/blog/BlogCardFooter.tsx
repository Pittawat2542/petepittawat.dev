import { ArrowUpRight } from 'lucide-react';
import { memo, type FC } from 'react';
import { cn } from '@/lib/utils';

interface BlogCardFooterProps {
  readonly pubDate: Date;
  readonly barPadding: string;
}

const BlogCardFooterComponent: FC<BlogCardFooterProps> = ({ pubDate, barPadding }) => {
  const yearLabel = pubDate.toLocaleDateString('en-us', { year: 'numeric' });

  return (
    <div className="relative mt-auto">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--card-accent,rgba(255,255,255,0.4))]/45 to-transparent opacity-35 transition-opacity duration-300 group-hover:opacity-80" />
      <div
        className={cn(
          'aurora-card__footer flex items-center justify-between gap-4 py-3 text-[13px] text-[color:var(--white)]/78 md:py-4 md:text-sm',
          barPadding
        )}
      >
        <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.28em] text-[color:var(--card-accent)]/65 uppercase transition-colors duration-300 group-hover:text-[color:var(--card-accent)] md:text-xs">
          {yearLabel}
        </span>
        <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-white/90 transition-colors duration-300 group-hover:text-[color:var(--card-accent)] md:text-[15px]">
          Continue reading
          <span className="aurora-chip aurora-chip--icon inline-flex h-8 w-8 items-center justify-center bg-[color:var(--card-accent)]/15 text-[color:var(--card-accent)] shadow-[0_10px_24px_rgba(15,35,75,0.28)] backdrop-blur-sm transition-[transform,background-color,color] duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[2px] group-hover:bg-[color:var(--card-accent)]/25 md:h-9 md:w-9">
            <ArrowUpRight
              size={17}
              strokeWidth={2}
              aria-hidden="true"
              className="h-[16px] w-[16px] md:h-[18px] md:w-[18px]"
            />
          </span>
        </span>
      </div>
    </div>
  );
};

// Memoize the component with custom comparison
export const BlogCardFooter = memo(BlogCardFooterComponent, (prevProps, nextProps) => {
  return prevProps.pubDate === nextProps.pubDate && prevProps.barPadding === nextProps.barPadding;
});

BlogCardFooter.displayName = 'BlogCardFooter';
export default BlogCardFooter;
