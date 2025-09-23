import * as React from 'react';
import { memo } from 'react';
import { cn } from '@/lib/utils';

const CardComponent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('bg-card text-card-foreground rounded-lg border shadow-sm', className)}
      {...props}
    />
  )
);
CardComponent.displayName = 'Card';

const CardHeaderComponent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
);
CardHeaderComponent.displayName = 'CardHeader';

const CardTitleComponent = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl leading-none font-semibold tracking-tight', className)}
    {...props}
  />
));
CardTitleComponent.displayName = 'CardTitle';

const CardDescriptionComponent = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-muted-foreground text-sm', className)} {...props} />
));
CardDescriptionComponent.displayName = 'CardDescription';

const CardContentComponent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContentComponent.displayName = 'CardContent';

const CardFooterComponent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
);
CardFooterComponent.displayName = 'CardFooter';

// Memoize all components
const Card = memo(CardComponent);
const CardHeader = memo(CardHeaderComponent);
const CardTitle = memo(CardTitleComponent);
const CardDescription = memo(CardDescriptionComponent);
const CardContent = memo(CardContentComponent);
const CardFooter = memo(CardFooterComponent);

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
