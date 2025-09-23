import * as React from 'react';

import { cn } from '@/lib/utils';
import { memo } from 'react';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly orientation?: 'horizontal' | 'vertical';
}

const SeparatorComponent = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'bg-border shrink-0',
        orientation === 'vertical' ? 'h-full w-px' : 'h-px w-full',
        className
      )}
      {...props}
    />
  )
);
SeparatorComponent.displayName = 'SeparatorComponent';

// Memoize the separator component
export const Separator = memo(SeparatorComponent);
Separator.displayName = 'Separator';
