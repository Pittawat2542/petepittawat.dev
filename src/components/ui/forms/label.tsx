import { forwardRef, memo, type LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

const LabelComponent = forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
));
LabelComponent.displayName = 'LabelComponent';

// Memoize the label component
export const Label = memo(LabelComponent);
Label.displayName = 'Label';
