import BlogCardMeta from './BlogCardMeta';
import BlogCardTag from './BlogCardTag';

type Props = {
  title: string;
  excerpt: string;
  pubDate: Date;
  isPartOfSeries: boolean;
  seriesTitle?: string;
  partNumber: number;
  totalParts: number;
  fallbackTag: string;
};

export default function BlogCardContent({ 
  title, 
  excerpt, 
  pubDate, 
  isPartOfSeries, 
  seriesTitle, 
  partNumber, 
  totalParts, 
  fallbackTag 
}: Readonly<Props>) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-white/60 transition-all duration-300 group-hover:text-white/75">
        <BlogCardTag 
          isPartOfSeries={isPartOfSeries}
          seriesTitle={seriesTitle}
          partNumber={partNumber}
          totalParts={totalParts}
          fallbackTag={fallbackTag}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-[color:var(--white)] leading-tight transition-colors duration-300 group-hover:text-white">
          {title}
        </h3>

        <BlogCardMeta pubDate={pubDate} />

        <p className="text-left leading-7 text-[color:var(--white)]/78 transition-colors duration-300 group-hover:text-[color:var(--white,#ffffff)]/92 line-clamp-3">
          {excerpt}
        </p>
      </div>
    </div>
  );
}