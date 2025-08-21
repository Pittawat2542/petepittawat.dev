import * as React from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';
import { cn } from '../../lib/utils';

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof RadixSwitch.Root> {}

const Switch = React.forwardRef<React.ComponentRef<typeof RadixSwitch.Root>, SwitchProps>(
  ({ className, ...props }, ref) => (
    <RadixSwitch.Root
      ref={ref}
      className={cn(
        'peer inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted',
        className
      )}
      {...props}
    >
      <RadixSwitch.Thumb
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
          'data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0'
        )}
      />
    </RadixSwitch.Root>
  )
);
Switch.displayName = 'Switch';

export { Switch };
