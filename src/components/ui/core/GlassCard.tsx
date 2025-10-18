import { memo, type FC, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLAttributes<HTMLElement> {
  readonly children: ReactNode;
  readonly className?: string;
  readonly variant?: 'default' | 'elevated' | 'premium' | 'glow';
  readonly animated?: boolean;
}

const BASE_CARD_CLASSES =
  'shape-squircle rounded-[1.75rem] text-card-foreground transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out p-6 md:p-8 will-change-transform';

const VARIANT_CARD_CLASSES = {
  default: 'glass-card',
  elevated: 'glass-surface-elevated',
  premium: 'glass-surface-premium',
  glow: 'glass-card glass-glow',
} as const;

const getVariantClasses = (
  variant: NonNullable<GlassCardProps['variant']>,
  animated: NonNullable<GlassCardProps['animated']>
) => cn(BASE_CARD_CLASSES, VARIANT_CARD_CLASSES[variant], animated && 'glass-border-animated');

const GlassCardComponent: FC<GlassCardProps> = ({
  children,
  className,
  variant = 'default',
  animated = false,
  ...rest
}) => {
  return (
    <section {...rest} className={cn(getVariantClasses(variant, animated), className)}>
      {children}
    </section>
  );
};

const GlassCard = memo(GlassCardComponent);
GlassCard.displayName = 'GlassCard';

export default GlassCard;
export { GlassCard };
