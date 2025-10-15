import { createElement, memo, type FC, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassSurfaceProps extends HTMLAttributes<HTMLElement> {
  readonly children: ReactNode;
  readonly className?: string;
  readonly variant?: 'default' | 'elevated' | 'premium';
  readonly rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  readonly padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  readonly as?: 'div' | 'section' | 'article' | 'aside' | 'nav';
}

const BASE_CLASSES =
  'transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out will-change-transform';

const VARIANT_CLASSES = {
  default: 'glass-surface',
  elevated: 'glass-surface-elevated',
  premium: 'glass-surface-premium',
} as const;

const ROUNDED_CLASSES = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
} as const;

const PADDING_CLASSES = {
  none: '',
  sm: 'p-3',
  md: 'p-4 md:p-6',
  lg: 'p-6 md:p-8',
  xl: 'p-8 md:p-12',
} as const;

const getClasses = (
  variant: NonNullable<GlassSurfaceProps['variant']>,
  rounded: NonNullable<GlassSurfaceProps['rounded']>,
  padding: NonNullable<GlassSurfaceProps['padding']>
) => cn(BASE_CLASSES, VARIANT_CLASSES[variant], ROUNDED_CLASSES[rounded], PADDING_CLASSES[padding]);

const GlassSurfaceComponent: FC<GlassSurfaceProps> = ({
  children,
  className,
  variant = 'default',
  rounded = 'lg',
  padding = 'md',
  as = 'div',
  ...rest
}) => {
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
