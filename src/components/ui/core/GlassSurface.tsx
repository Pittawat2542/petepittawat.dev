import React, { type HTMLAttributes, type ReactNode, memo, createElement } from 'react';
import { cn } from '@/lib/utils';

interface GlassSurfaceProps extends HTMLAttributes<HTMLElement> {
  readonly children: ReactNode;
  readonly className?: string;
  readonly variant?: 'default' | 'elevated' | 'premium';
  readonly rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  readonly padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  readonly as?: 'div' | 'section' | 'article' | 'aside' | 'nav';
}

const GlassSurfaceComponent: React.FC<GlassSurfaceProps> = ({
  children,
  className,
  variant = 'default',
  rounded = 'lg',
  padding = 'md',
  as = 'div',
  ...rest
}) => {
  const getClasses = (
    variant: 'default' | 'elevated' | 'premium',
    rounded: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full',
    padding: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  ) => {
    const baseClasses =
      'transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out will-change-transform';

    const variantClasses = {
      default: 'glass-surface',
      elevated: 'glass-surface-elevated',
      premium: 'glass-surface-premium',
    } as const;

    const roundedClasses = {
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      full: 'rounded-full',
    } as const;

    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-4 md:p-6',
      lg: 'p-6 md:p-8',
      xl: 'p-8 md:p-12',
    } as const;

    return `${baseClasses} ${variantClasses[variant]} ${roundedClasses[rounded]} ${paddingClasses[padding]}`;
  };

  return createElement(
    as,
    {
      className: cn(getClasses(variant, rounded, padding), className),
      ...rest,
    },
    children
  );
};

const GlassSurface = memo(GlassSurfaceComponent);
GlassSurface.displayName = 'GlassSurface';

export default GlassSurface;
export { GlassSurface };
