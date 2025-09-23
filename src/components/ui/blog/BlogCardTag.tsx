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
      <span className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[color:var(--accent)] shadow-[0_6px_18px_rgba(9,14,24,0.25)] transition-all duration-300 group-hover:border-white/25 group-hover:bg-white/16 group-hover:text-[color:var(--accent)]/90">
        <BookOpen size={12} />
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
    <span className="inline-flex items-center gap-2 rounded-full border border-white/12 px-3 py-1 text-white/65 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/8 group-hover:text-white/85">
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
