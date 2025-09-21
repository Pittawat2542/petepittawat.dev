import type { FC, ReactNode } from 'react';
import { memo } from 'react';

import { cn } from '@/lib/utils';

interface ContainerProps {
  readonly children: ReactNode;
  readonly className?: string | undefined;
}

const ContainerComponent: FC<ContainerProps> = ({ children, className }) => {
  return (
    <section className={cn('mx-auto max-w-6xl', className)}>
      {children}
    </section>
  );
};

export const Container = memo(ContainerComponent);
Container.displayName = 'Container';
export default Container;