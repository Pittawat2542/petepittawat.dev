import { X } from 'lucide-react';
import { memo, type CSSProperties, type FC, type ReactNode } from 'react';
import { BlogCardOverlays } from '@/components/ui/blog/BlogCardOverlays';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/core/dialog';

export interface CardDetailsDialogSection {
  readonly title: string;
  readonly content: ReactNode;
}

interface CardDetailsDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly contentId?: string | undefined;
  readonly accent: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly sections: readonly CardDetailsDialogSection[];
}

const CardDetailsDialogComponent: FC<CardDetailsDialogProps> = ({
  open,
  onOpenChange,
  contentId,
  accent,
  eyebrow,
  title,
  description,
  sections,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      id={contentId}
      className="w-[min(46rem,94vw)] max-w-none overflow-hidden border-none bg-transparent p-0 shadow-none"
    >
      <DialogTitle className="sr-only">{title}</DialogTitle>
      <DialogDescription className="sr-only">{description}</DialogDescription>
      <div
        className="aurora-modal card-details-modal relative flex max-h-[86vh] flex-col overflow-hidden rounded-[1.65rem] border border-white/10 bg-[rgba(7,14,28,0.92)] shadow-[0_36px_92px_-50px_rgba(3,7,18,0.98)]"
        style={{ '--card-accent': accent } as CSSProperties}
      >
        <BlogCardOverlays accent={accent} intensity="subtle" />

        <header className="relative z-10 flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
          <div className="min-w-0">
            <span className="type-micro font-semibold tracking-[0.26em] text-[color:var(--card-accent)]/76 uppercase">
              {eyebrow}
            </span>
            <h3 className="type-card-title mt-2 leading-[1.05] font-semibold tracking-[-0.035em] text-white">
              {title}
            </h3>
            <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-white/66">{description}</p>
          </div>
          <DialogClose
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-white/72 transition-[border-color,background-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-[color:var(--card-accent)]/35 hover:bg-[color:var(--card-accent)]/12 hover:text-white focus-visible:ring-2 focus-visible:ring-[color:var(--card-accent)]/45 focus-visible:outline-none"
            aria-label="Close details"
            title="Close"
          >
            <X size={16} aria-hidden="true" />
          </DialogClose>
        </header>

        <div className="relative z-10 grid gap-5 overflow-y-auto px-5 py-5 sm:px-6">
          {sections.map(section => (
            <section key={section.title} className="grid gap-3">
              <h4 className="type-micro font-semibold tracking-[0.22em] text-white/46 uppercase">
                {section.title}
              </h4>
              {section.content}
            </section>
          ))}
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export const CardDetailsDialog = memo(CardDetailsDialogComponent);
CardDetailsDialog.displayName = 'CardDetailsDialog';
export default CardDetailsDialog;
