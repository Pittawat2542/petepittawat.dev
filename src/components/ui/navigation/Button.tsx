import './button.css';
import { forwardRef, memo, type ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva('site-button', {
  variants: {
    variant: {
      default: 'site-button--primary',
      secondary: 'site-button--secondary',
      outline: 'site-button--outline',
      ghost: 'site-button--ghost',
      link: 'site-button--link',
      destructive: 'site-button--destructive',
    },
    size: {
      default: '',
      sm: 'site-button--sm',
      lg: 'site-button--lg',
      icon: 'site-button--icon',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  readonly asChild?: boolean;
}

const ButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
ButtonComponent.displayName = 'ButtonComponent';

// Memoize the button component
export const Button = memo(ButtonComponent);
Button.displayName = 'Button';

export { buttonVariants };
