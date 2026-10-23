import './filter-chip.css';
import { memo, type FC, type MouseEvent, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const SIZE_CLASSES = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
} as const;

const BASE_CHIP_CLASSES = 'filter-chip relative';
const ACTIVE_VARIANT_CLASSES = {
  default: 'filter-chip--active',
  primary: 'filter-chip--active',
  accent: 'filter-chip--active',
} as const;
const INACTIVE_CLASSES = '';
const ACTIVE_COUNT_CLASSES = {
  default: 'text-foreground',
  primary: 'text-foreground',
  accent: 'text-foreground',
} as const;
const INACTIVE_COUNT_CLASSES = 'text-muted-foreground';

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
    onClick ? 'cursor-pointer' : 'cursor-default',
    className
  );

  return (
    <Component
      className={componentClassName}
      {...(onClick && { onClick: handleClick })}
      {...(onClick && { 'aria-pressed': active })}
      {...(onClick && { role: 'button' })}
    >
      <span className="filter-chip__label truncate">{children}</span>

      {count !== undefined && (
        <span
          className={cn(
            'filter-chip__count min-w-[1.25rem] rounded-[var(--radius-control)] px-1.5 py-0.5 text-center text-xs font-semibold transition-[background-color,color,border-color] duration-150',
            active ? ACTIVE_COUNT_CLASSES[variant] : INACTIVE_COUNT_CLASSES
          )}
        >
          {count}
        </span>
      )}

      {removable && onRemove && (
        <button
          type="button"
          onClick={handleRemove}
          className={cn(
            'focus-visible:ring-ring/40 rounded-[var(--radius-control)] p-0.5 transition-[background-color,color] duration-150 ease-out focus-visible:ring-1 focus-visible:outline-none',
            active
              ? 'text-foreground hover:bg-white/10'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          )}
          aria-label={`Remove ${children} filter`}
          title="Remove filter"
        >
          <X size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} />
        </button>
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
