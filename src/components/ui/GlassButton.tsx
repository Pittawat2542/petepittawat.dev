import React from 'react';
import { cn } from '../../lib/utils';

type CommonProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
};

type AnchorLikeProps = CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  as?: 'a';
  href: string;
};

type ButtonLikeProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: 'button';
  href?: never;
};

type GlassButtonProps = AnchorLikeProps | ButtonLikeProps;

const GlassButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, GlassButtonProps>(
  ({ className, variant = 'primary', size = 'md', as, children, ...props }, ref) => {
    const isAnchor = as === 'a' || ('href' in (props as AnchorLikeProps));

    const baseClasses = 'glass-button rounded-xl font-medium transition-[transform,box-shadow,background-color,color,border-color] duration-150 ease-out will-change-transform active:scale-[0.98] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 inline-flex items-center justify-center gap-2 relative overflow-hidden group';

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm h-8',
      md: 'px-4 py-2.5 text-sm h-10',
      lg: 'px-6 py-3 text-base h-12'
    } as const;

    const variantClasses = {
      primary: 'text-white bg-primary/20 border-primary/40 hover:bg-primary/30 hover:text-white hover:border-primary/60 shadow-primary/20',
      secondary: 'text-foreground bg-muted/30 border-muted/50 hover:bg-muted/40 hover:border-muted/70 hover:text-foreground',
      ghost: 'text-muted-foreground bg-transparent border-transparent hover:bg-accent/30 hover:text-foreground hover:border-accent/20'
    } as const;

    const combinedClassName = cn(
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      className
    );

    if (isAnchor) {
      const { className: _ignored, ...rest } = props as AnchorLikeProps;
      return (
        <a ref={ref as React.Ref<HTMLAnchorElement>} className={combinedClassName} {...rest}>
          {children}
        </a>
      );
    }

    const { className: _ignored2, ...restBtn } = props as ButtonLikeProps;
    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} className={combinedClassName} {...restBtn}>
        {children}
      </button>
    );
  }
);

GlassButton.displayName = 'GlassButton';

export { GlassButton };
export default GlassButton;
