import type { FC, MouseEvent, ReactNode } from 'react';

import { X } from 'lucide-react';
import { memo } from 'react';
import { cn } from '@/lib/utils';

const SIZE_CLASSES = {
  sm: 'px-2.5 py-1 text-xs h-7',
  md: 'px-3 py-1.5 text-sm h-8',
  lg: 'px-4 py-2 text-base h-10',
} as const;

const BASE_CHIP_CLASSES =
  'glass-surface rounded-full transition-[transform,background-color,color,border-color,box-shadow] duration-150 ease-out backdrop-blur-md border will-change-transform';

const ACTIVE_VARIANT_CLASSES = {
  default: 'glass-surface-elevated border-ring/30 text-foreground shadow-ring/10',
  primary: 'bg-primary/30 text-primary-foreground border-primary/40 shadow-primary/20',
  accent: 'bg-ring/30 text-white border-ring/40 shadow-ring/20',
} as const;

const INACTIVE_CLASSES =
  'bg-muted/20 text-muted-foreground border-muted/30 hover:glass-surface-elevated hover:bg-muted/30 hover:text-foreground hover:border-muted/50';

export interface FilterChipProps {
  readonly children: ReactNode;
  readonly active?: boolean;
  readonly count?: number;
  readonly onClick?: () => void;
  readonly onRemove?: () => void;
  readonly variant?: 'default' | 'primary' | 'accent';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly removable?: boolean;
  readonly className?: string;
}

const getVariantClasses = (variant: NonNullable<FilterChipProps['variant']>, active: boolean) => {
  if (active) {
    return cn(BASE_CHIP_CLASSES, ACTIVE_VARIANT_CLASSES[variant]);
  }

  return cn(BASE_CHIP_CLASSES, INACTIVE_CLASSES);
};

const FilterChipComponent: FC<FilterChipProps> = ({
  children,
  active = false,
  count,
  onClick,
  onRemove,
  variant = 'default',
  size = 'md',
  removable = false,
  className,
}) => {
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    onClick?.();
  };

  const handleRemove = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onRemove?.();
  };

  const Component = onClick ? 'button' : 'span';

  const componentClassName = cn(
    'inline-flex items-center gap-1.5 font-medium whitespace-nowrap focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none',
    SIZE_CLASSES[size],
    getVariantClasses(variant, active),
    onClick ? 'cursor-pointer hover:scale-[1.03] active:scale-95' : 'cursor-default',
    className
  );

  return (
    <Component
      className={componentClassName}
      {...(onClick && { onClick: handleClick })}
      {...(onClick && { 'aria-pressed': active })}
      {...(onClick && { role: 'button' })}
    >
      <span className="truncate">{children}</span>

      {count !== undefined && (
        <span
          className={`min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-xs font-semibold ${
            active
              ? variant === 'accent'
                ? 'bg-white/25 font-bold text-white shadow-sm'
                : variant === 'primary'
                  ? 'bg-white/20 font-bold text-white shadow-sm'
                  : 'bg-white/20 font-bold text-white shadow-sm'
              : 'bg-muted/40 text-muted-foreground opacity-70'
          } transition-[background-color,color,border-color] duration-150`}
        >
          {count}
        </span>
      )}

      {removable && onRemove && (
        <button
          type="button"
          onClick={handleRemove}
          className={`rounded-full p-0.5 transition-[background-color,color] duration-150 ease-out ${
            active
              ? 'text-black/60 hover:bg-black/20 hover:text-black'
              : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
          } focus-visible:ring-ring/40 focus-visible:ring-1 focus-visible:outline-none`}
          aria-label={`Remove ${children} filter`}
          title="Remove filter"
        >
          <X size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} />
        </button>
      )}

      {/* Subtle inner glow for active state */}
      {active && (
        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-white/[0.05] via-transparent to-white/[0.05]" />
      )}
    </Component>
  );
};

// Memoize the component with custom comparison
export const FilterChip = memo(FilterChipComponent, (prevProps, nextProps) => {
  return (
    prevProps.children === nextProps.children &&
    prevProps.active === nextProps.active &&
    prevProps.count === nextProps.count &&
    prevProps.variant === nextProps.variant &&
    prevProps.size === nextProps.size &&
    prevProps.removable === nextProps.removable &&
    prevProps.className === nextProps.className &&
    prevProps.onClick === nextProps.onClick &&
    prevProps.onRemove === nextProps.onRemove
  );
});

FilterChip.displayName = 'FilterChip';

// Default export for backward compatibility
export default FilterChip;
