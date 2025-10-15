import { memo, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-ring',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'text-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: {
      variant: 'secondary',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const BadgeComponent = ({ className, variant, ...props }: BadgeProps) => {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
};

// Memoize the badge component
export const Badge = memo(BadgeComponent);
Badge.displayName = 'Badge';

export { badgeVariants };
