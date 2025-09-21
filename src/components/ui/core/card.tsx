import * as React from 'react';

import { cn } from '@/lib/utils';
import { memo } from 'react';

const CardComponent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Base shadcn card styling mapped to project aesthetics
        'rounded-2xl border border-border bg-card glass-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    />
  )
);
CardComponent.displayName = 'CardComponent';

const CardHeaderComponent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
);
CardHeaderComponent.displayName = 'CardHeaderComponent';

const CardTitleComponent = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
  )
);
CardTitleComponent.displayName = 'CardTitleComponent';

const CardDescriptionComponent = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
);
CardDescriptionComponent.displayName = 'CardDescriptionComponent';

const CardContentComponent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContentComponent.displayName = 'CardContentComponent';

const CardFooterComponent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
);
CardFooterComponent.displayName = 'CardFooterComponent';

// Memoize all card components
export const Card = memo(CardComponent);
Card.displayName = 'Card';

export const CardHeader = memo(CardHeaderComponent);
CardHeader.displayName = 'CardHeader';

export const CardTitle = memo(CardTitleComponent);
CardTitle.displayName = 'CardTitle';

export const CardDescription = memo(CardDescriptionComponent);
CardDescription.displayName = 'CardDescription';

export const CardContent = memo(CardContentComponent);
CardContent.displayName = 'CardContent';

export const CardFooter = memo(CardFooterComponent);
CardFooter.displayName = 'CardFooter';
