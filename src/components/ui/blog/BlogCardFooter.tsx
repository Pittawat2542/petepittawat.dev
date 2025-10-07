import { ArrowUpRight } from 'lucide-react';
import type { FC } from 'react';
import { memo } from 'react';

interface BlogCardFooterProps {
  readonly pubDate: Date;
  readonly barPadding: string;
}

const BlogCardFooterComponent: FC<BlogCardFooterProps> = ({ pubDate, barPadding }) => {
  return (
    <div className="relative mt-auto">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-80" />
      <div
        className={`aurora-card__footer ${barPadding} py-3 text-sm text-[color:var(--white)]/78 md:py-4`}
      >
        <span className="inline-flex items-center gap-1.5 text-[15px] font-medium tracking-tight">
          Continue reading
          <span className="aurora-chip inline-flex h-8 w-8 items-center justify-center">
            <ArrowUpRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[2px]"
            />
          </span>
        </span>
        <span className="hidden text-xs tracking-[0.3em] text-white/45 uppercase transition-opacity duration-300 group-hover:text-white/75 md:inline-flex">
          {pubDate.toLocaleDateString('en-us', { year: 'numeric' })}
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
