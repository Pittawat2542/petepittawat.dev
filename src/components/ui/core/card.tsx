import { forwardRef, memo, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const CardComponent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('bg-card text-card-foreground rounded-lg border shadow-sm', className)}
      {...props}
    />
  )
);
CardComponent.displayName = 'Card';

const CardHeaderComponent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
);
CardHeaderComponent.displayName = 'CardHeader';

const CardTitleComponent = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl leading-none font-semibold tracking-tight', className)}
      {...props}
    />
  )
);
CardTitleComponent.displayName = 'CardTitle';

const CardDescriptionComponent = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-muted-foreground text-sm', className)} {...props} />
));
CardDescriptionComponent.displayName = 'CardDescription';

const CardContentComponent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContentComponent.displayName = 'CardContent';

const CardFooterComponent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
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
