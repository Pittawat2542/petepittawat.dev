import { memo, type CSSProperties, type FC, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { getCardAccentTint } from './cardTone';

interface CardInfoPanelProps {
  readonly children: ReactNode;
  readonly className?: string | undefined;
  readonly style?: CSSProperties | undefined;
}

const CardInfoPanelComponent: FC<CardInfoPanelProps> = ({ children, className, style }) => (
  <div
    className={cn('rounded-[1.2rem] border px-4 py-4', className)}
    style={{
      borderColor: getCardAccentTint(18),
      background: `linear-gradient(180deg, ${getCardAccentTint(8)}, transparent)`,
      ...style,
    }}
  >
    {children}
  </div>
);

interface CardDividerProps {
  readonly className?: string | undefined;
}

const CardDividerComponent: FC<CardDividerProps> = ({ className }) => (
  <div
    className={cn('h-px w-full', className)}
    style={{
      background: `linear-gradient(90deg, ${getCardAccentTint(32)}, transparent 85%)`,
    }}
  />
);

export const CardInfoPanel = memo(CardInfoPanelComponent);
export const CardDivider = memo(CardDividerComponent);

CardInfoPanel.displayName = 'CardInfoPanel';
CardDivider.displayName = 'CardDivider';
