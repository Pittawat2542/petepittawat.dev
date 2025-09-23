import type { FC, ReactNode } from 'react';
import { memo } from 'react';

import { cn } from '@/lib/utils';

interface ChipProps {
  readonly children: ReactNode;
  readonly variant?: 'default' | 'primary' | 'secondary';
  readonly className?: string;
}

const ChipComponent: FC<ChipProps> = ({ children, variant = 'default', className }) => {
  const baseClasses =
    'inline-flex items-center rounded-full border border-border bg-secondary text-secondary-foreground px-2.5 py-0.5 text-xs font-medium whitespace-nowrap';

  const variantClasses = {
    default: '',
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
  };

  return <span className={cn(baseClasses, variantClasses[variant], className)}>{children}</span>;
};

export const Chip = memo(ChipComponent);
Chip.displayName = 'Chip';
export default Chip;
