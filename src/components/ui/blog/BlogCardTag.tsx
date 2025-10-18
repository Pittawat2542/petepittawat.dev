import { BookOpen } from 'lucide-react';
import type { FC } from 'react';
import { memo } from 'react';

interface BlogCardTagProps {
  readonly isPartOfSeries: boolean;
  readonly seriesTitle?: string;
  readonly partNumber: number;
  readonly totalParts: number;
  readonly fallbackTag: string;
}

const BlogCardTagComponent: FC<BlogCardTagProps> = ({
  isPartOfSeries,
  seriesTitle,
  partNumber,
  totalParts,
  fallbackTag,
}) => {
  if (isPartOfSeries && seriesTitle) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full border border-white/14 bg-white/10 px-2.5 py-1 text-[11px] text-[color:var(--card-accent,var(--accent))] shadow-[0_6px_18px_rgba(9,14,24,0.25)] transition-all duration-300 group-hover:border-white/25 group-hover:bg-white/16 group-hover:text-[color:var(--card-accent,var(--accent))]/90 md:gap-2 md:px-3 md:text-xs"
        style={{
          borderColor:
            'color-mix(in oklab, var(--card-accent,var(--accent)) 35%, rgba(255,255,255,0.18))',
          background:
            'color-mix(in oklab, var(--card-accent,var(--accent)) 18%, rgba(15,23,42,0.35))',
        }}
      >
        <BookOpen size={12} className="text-[color:var(--card-accent,var(--accent))]/90" />
        {seriesTitle}
        {totalParts > 0 && (
          <span className="text-white/70 transition-colors duration-300 group-hover:text-white/85">
            ({partNumber}/{totalParts})
          </span>
        )}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 px-2.5 py-1 text-[11px] text-white/65 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/8 group-hover:text-white/85 md:gap-2 md:px-3 md:text-xs">
      {fallbackTag}
    </span>
  );
};

// Memoize the component with custom comparison
export const BlogCardTag = memo(BlogCardTagComponent, (prevProps, nextProps) => {
  return (
    prevProps.isPartOfSeries === nextProps.isPartOfSeries &&
    prevProps.seriesTitle === nextProps.seriesTitle &&
    prevProps.partNumber === nextProps.partNumber &&
    prevProps.totalParts === nextProps.totalParts &&
    prevProps.fallbackTag === nextProps.fallbackTag
  );
});

BlogCardTag.displayName = 'BlogCardTag';
export default BlogCardTag;
