import React from 'react';
import { cn } from '../../lib/utils';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  as?: 'button' | 'a';
  href?: string;
  children: React.ReactNode;
}

const GlassButton = React.forwardRef<HTMLElement, GlassButtonProps>(
  ({ className, variant = 'primary', size = 'md', as, href, children, ...props }, ref) => {
    const Component = (as || (href ? 'a' : 'button')) as any;
    
    const baseClasses = 'glass-button rounded-xl font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 inline-flex items-center justify-center gap-2 relative overflow-hidden group';
    
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
    
    const componentProps = {
      className: combinedClassName,
      ...(href && { href }),
      ...props
    } as any;
    
    return (
      <Component ref={ref} {...componentProps}>
        {children}
      </Component>
    );
  }
);

GlassButton.displayName = 'GlassButton';

export { GlassButton };
export default GlassButton;
