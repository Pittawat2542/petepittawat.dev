import { Calendar } from 'lucide-react';

type Props = {
  pubDate: Date;
};

export default function BlogCardMeta({ pubDate }: Readonly<Props>) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-white/60 transition-colors duration-300 group-hover:text-white/80">
      <div className="inline-flex items-center gap-1.5 uppercase tracking-wide">
        <Calendar size={14} className="text-[color:var(--accent)]/70" aria-hidden="true" />
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
}