import { memo, useEffect, useState, type FC, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedWrapperProps {
  readonly children: ReactNode;
}

const AnimatedWrapperComponent: FC<AnimatedWrapperProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={cn(
        'ease-[var(--motion-ease-decelerate, ease-out)] transform-gpu transition-[opacity,transform] duration-500',
        mounted ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'
      )}
    >
      {children}
    </div>
  );
};

const AnimatedWrapper = memo(AnimatedWrapperComponent);
AnimatedWrapper.displayName = 'AnimatedWrapper';

export default AnimatedWrapper;
export { AnimatedWrapper };
