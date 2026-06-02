import { memo, type ElementType, type FC, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { getCardAccentTint } from './cardTone';

interface CardKickerProps {
  readonly label: string;
  readonly className?: string | undefined;
}

const CardKickerComponent: FC<CardKickerProps> = ({ label, className }) => (
  <div
    className={cn(
      'type-micro inline-flex items-center gap-2 font-semibold tracking-[0.28em] text-white/48 uppercase',
      className
    )}
  >
    <span
      className="inline-block h-2 w-2 rounded-full"
      style={{
        background: 'color-mix(in oklab, var(--card-accent) 72%, white)',
        boxShadow: `0 0 0 6px ${getCardAccentTint(12)}`,
      }}
    />
    {label}
  </div>
);

interface CardMetaRowProps {
  readonly children: ReactNode;
  readonly className?: string | undefined;
  readonly viewportSafe?: boolean | undefined;
}

const CardMetaRowComponent: FC<CardMetaRowProps> = ({ children, className, viewportSafe }) => (
  <div
    className={cn(
      '-my-1 flex max-w-full min-w-0 flex-wrap items-center gap-2 overflow-visible py-1',
      viewportSafe && 'max-w-[calc(100vw-5rem)]',
      className
    )}
  >
    {children}
  </div>
);

interface CardMetaChipProps {
  readonly children: ReactNode;
  readonly icon?: ElementType | undefined;
  readonly className?: string | undefined;
  readonly title?: string | undefined;
}

const CardMetaChipComponent: FC<CardMetaChipProps> = ({
  children,
  icon: Icon,
  className,
  title,
}) => (
  <span
    className={cn(
      'type-caption inline-flex max-w-full shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 font-medium text-[color:var(--card-accent)]/76 uppercase md:text-xs',
      className
    )}
    style={{
      borderColor: getCardAccentTint(28),
      background: `linear-gradient(180deg, ${getCardAccentTint(10)}, ${getCardAccentTint(5)})`,
      boxShadow: `inset 0 1px 0 ${getCardAccentTint(10)}`,
    }}
    title={title}
  >
    {Icon ? <Icon size={12} aria-hidden="true" className="icon-bounce shrink-0" /> : null}
    <span className="min-w-0 truncate leading-tight">{children}</span>
  </span>
);

export const CardMetaRow = memo(CardMetaRowComponent);
export const CardMetaChip = memo(CardMetaChipComponent);
export const CardKicker = memo(CardKickerComponent);

CardMetaRow.displayName = 'CardMetaRow';
CardMetaChip.displayName = 'CardMetaChip';
CardKicker.displayName = 'CardKicker';
