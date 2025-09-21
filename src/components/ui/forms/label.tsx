import * as React from 'react';

import { cn } from '@/lib/utils';
import { memo } from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const LabelComponent = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
));
LabelComponent.displayName = 'LabelComponent';

// Memoize the label component
export const Label = memo(LabelComponent);
Label.displayName = 'Label';

