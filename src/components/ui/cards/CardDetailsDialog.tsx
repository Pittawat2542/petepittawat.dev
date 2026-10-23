import '@/styles/components/dialog-surface.css';
import { X } from 'lucide-react';
import { memo, type CSSProperties, type FC, type ReactNode } from 'react';

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
  contentId,
  accent,
  eyebrow,
  title,
  description,
  sections,
}) => (
  <template data-details-template>
    <h2 className="sr-only">{title}</h2>
    <p className="sr-only">{description}</p>
    <div
      className="dialog-surface card-details-modal relative flex max-h-[86vh] flex-col"
      style={{ '--card-accent': accent } as CSSProperties}
    >
      <header className="relative z-10 flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
        <div className="min-w-0">
          <span className="type-micro font-semibold tracking-[0.26em] text-[color:var(--card-accent)]/76 uppercase">
            {eyebrow}
          </span>
          <h3
            id={contentId}
            className="type-card-title mt-2 leading-[1.05] font-semibold tracking-[-0.035em] text-white"
          >
            {title}
          </h3>
          <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-white/66">{description}</p>
        </div>
        <button
          type="button"
          data-close-details
          className="dialog-close"
          aria-label="Close details"
          title="Close"
        >
          <X size={16} aria-hidden="true" />
        </button>
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
  </template>
);

export const CardDetailsDialog = memo(CardDetailsDialogComponent);
CardDetailsDialog.displayName = 'CardDetailsDialog';
export default CardDetailsDialog;
