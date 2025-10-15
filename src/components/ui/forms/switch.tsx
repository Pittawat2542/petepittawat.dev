import * as RadixSwitch from '@radix-ui/react-switch';
import { forwardRef, memo, type ComponentPropsWithoutRef, type ComponentRef } from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps extends ComponentPropsWithoutRef<typeof RadixSwitch.Root> {}

const SwitchComponent = forwardRef<ComponentRef<typeof RadixSwitch.Root>, SwitchProps>(
  ({ className, ...props }, ref) => (
    <RadixSwitch.Root
      ref={ref}
      className={cn(
        'peer inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted',
        className
      )}
      {...props}
    >
      <RadixSwitch.Thumb
        className={cn(
          'bg-background pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform',
          'data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0'
        )}
      />
    </RadixSwitch.Root>
  )
);
SwitchComponent.displayName = 'SwitchComponent';

// Memoize the switch component
export const Switch = memo(SwitchComponent);
Switch.displayName = 'Switch';
