import { ArrowUpRight } from 'lucide-react';
import { memo, type FC } from 'react';
import { cn } from '@/lib/utils';

interface BlogCardFooterProps {
  readonly pubDate: Date;
  readonly barPadding: string;
  readonly tone?: 'default' | 'editorial' | undefined;
}

const BlogCardFooterComponent: FC<BlogCardFooterProps> = ({
  pubDate,
  barPadding,
  tone = 'default',
}) => {
  const yearLabel = pubDate.toLocaleDateString('en-us', { year: 'numeric' });

  return (
    <div className="relative mt-auto">
      <div
        className={
          tone === 'editorial'
            ? 'pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent opacity-100'
            : 'pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--card-accent,rgba(255,255,255,0.4))]/45 to-transparent opacity-35 transition-opacity duration-300 group-hover:opacity-80'
        }
      />
      <div
        className={cn(
          tone === 'editorial'
            ? 'flex items-center justify-between gap-4 border-t border-white/8 bg-[rgba(8,14,28,0.5)] py-3 text-[13px] text-white/66 backdrop-blur-xl md:py-4 md:text-sm'
            : 'aurora-card__footer flex items-center justify-between gap-4 py-3 text-[13px] text-[color:var(--white)]/78 md:py-4 md:text-sm',
          barPadding
        )}
      >
        <span
          className={
            tone === 'editorial'
              ? 'inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.28em] text-white/42 uppercase transition-colors duration-300 group-hover:text-white/68 md:text-xs'
              : 'inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.28em] text-[color:var(--card-accent)]/65 uppercase transition-colors duration-300 group-hover:text-[color:var(--card-accent)] md:text-xs'
          }
        >
          {yearLabel}
        </span>
        <span
          className={
            tone === 'editorial'
              ? 'inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-white transition-colors duration-300 group-hover:text-[color:var(--card-accent,var(--accent))] md:text-[15px]'
              : 'inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-white/90 transition-colors duration-300 group-hover:text-[color:var(--card-accent)] md:text-[15px]'
          }
        >
          Continue reading
          <span
            className={
              tone === 'editorial'
                ? 'inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/82 transition-[transform,background-color,color,border-color] duration-300 group-hover:translate-x-[3px] group-hover:border-[color:var(--card-accent,var(--accent))]/28 group-hover:bg-[color:var(--card-accent,var(--accent))] group-hover:text-slate-950 md:h-9 md:w-9'
                : 'aurora-chip aurora-chip--icon inline-flex h-8 w-8 items-center justify-center bg-[color:var(--card-accent)]/15 text-[color:var(--card-accent)] shadow-[0_10px_24px_rgba(15,35,75,0.28)] backdrop-blur-sm transition-[transform,background-color,color] duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[2px] group-hover:bg-[color:var(--card-accent)]/25 md:h-9 md:w-9'
            }
          >
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
  return (
    prevProps.pubDate === nextProps.pubDate &&
    prevProps.barPadding === nextProps.barPadding &&
    prevProps.tone === nextProps.tone
  );
});

BlogCardFooter.displayName = 'BlogCardFooter';
export default BlogCardFooter;
