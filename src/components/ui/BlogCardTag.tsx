import { BookOpen } from 'lucide-react';

type Props = {
  isPartOfSeries: boolean;
  seriesTitle?: string;
  partNumber: number;
  totalParts: number;
  fallbackTag: string;
};

export default function BlogCardTag({ isPartOfSeries, seriesTitle, partNumber, totalParts, fallbackTag }: Readonly<Props>) {
  if (isPartOfSeries && seriesTitle) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[color:var(--accent)] shadow-[0_6px_18px_rgba(9,14,24,0.25)] transition-all duration-300 group-hover:border-white/25 group-hover:bg-white/16 group-hover:text-[color:var(--accent)]/90">
        <BookOpen size={12} />
        {seriesTitle}
        {totalParts > 0 && (
          <span className="text-white/70 transition-colors duration-300 group-hover:text-white/85">({partNumber}/{totalParts})</span>
        )}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/12 px-3 py-1 text-white/65 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/8 group-hover:text-white/85">
      {fallbackTag}
    </span>
  );
}