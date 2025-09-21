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
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-45 transition-opacity duration-300 group-hover:opacity-80" />
      <div className={`relative flex items-center justify-between gap-3 border-t border-white/12 bg-white/[0.032] ${barPadding} py-3 md:py-4 text-sm text-white/75 backdrop-blur-[18px] transition-all duration-300 ease-out group-hover:border-white/18 group-hover:bg-white/[0.085] group-hover:text-white`}>
        <span className="inline-flex items-center gap-1.5 font-medium tracking-tight text-[15px]">
          Continue reading{` `}
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] text-white/80 transition-all duration-300 ease-out group-hover:bg-[color:var(--accent,#6AC1FF)]/42 group-hover:text-white group-hover:shadow-[0_10px_22px_rgba(18,42,70,0.45)]">
            <ArrowUpRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[2px]" />
          </span>
        </span>
        <span className="hidden text-xs uppercase tracking-[0.3em] text-white/45 transition-opacity duration-300 md:inline-flex group-hover:text-white/75">
          {pubDate.toLocaleDateString('en-us', { year: 'numeric' })}
        </span>
      </div>
    </div>
  );
};

// Memoize the component with custom comparison
export const BlogCardFooter = memo(BlogCardFooterComponent, (prevProps, nextProps) => {
  return (
    prevProps.pubDate === nextProps.pubDate &&
    prevProps.barPadding === nextProps.barPadding
  );
});

BlogCardFooter.displayName = 'BlogCardFooter';
export default BlogCardFooter;