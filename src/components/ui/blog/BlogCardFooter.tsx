import { ArrowUpRight } from 'lucide-react';
import type { FC } from 'react';
import { memo } from 'react';

interface BlogCardFooterProps {
  readonly pubDate: Date;
  readonly barPadding: string;
}

const BlogCardFooterComponent: FC<BlogCardFooterProps> = ({ pubDate, barPadding }) => {
  const yearLabel = pubDate.toLocaleDateString('en-us', { year: 'numeric' });

  return (
    <div className="relative mt-auto">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-80" />
      <div
        className={`aurora-card__footer ${barPadding} flex items-center justify-between gap-4 py-3 text-sm text-[color:var(--white)]/78 md:py-4`}
      >
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.28em] text-white/55 uppercase transition-colors duration-300 group-hover:text-white/80">
          {yearLabel}
        </span>
        <span className="inline-flex items-center gap-2 text-[15px] font-semibold tracking-tight text-white/90 transition-colors duration-300 group-hover:text-white">
          Continue reading
          <span className="aurora-chip aurora-chip--icon inline-flex h-9 w-9 items-center justify-center bg-white/12 text-white shadow-[0_10px_24px_rgba(15,35,75,0.35)] backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[2px]">
            <ArrowUpRight
              size={17}
              strokeWidth={2}
              aria-hidden="true"
              className="h-[18px] w-[18px]"
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
