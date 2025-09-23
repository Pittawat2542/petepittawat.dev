import React, { type HTMLAttributes, type ReactNode, memo } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLAttributes<HTMLElement> {
  readonly children: ReactNode;
  readonly className?: string;
  readonly variant?: 'default' | 'elevated' | 'premium' | 'glow';
  readonly animated?: boolean;
}

const GlassCardComponent: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = 'default',
  animated = false,
  ...rest
}) => {
  const getVariantClasses = (
    variant: 'default' | 'elevated' | 'premium' | 'glow',
    animated: boolean
  ) => {
    const baseClasses =
      'rounded-2xl text-card-foreground transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out p-6 md:p-8 will-change-transform';

    const variantClasses = {
      default: 'glass-card',
      elevated: 'glass-surface-elevated',
      premium: 'glass-surface-premium',
      glow: 'glass-card glass-glow',
    } as const;

    const animatedClass = animated ? 'glass-border-animated' : '';

    return `${baseClasses} ${variantClasses[variant]} ${animatedClass}`;
  };

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
