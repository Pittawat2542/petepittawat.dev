import React, { type HTMLAttributes, type ReactNode, memo } from 'react';
import { cn } from '@/lib/utils';

interface ProseProps extends HTMLAttributes<HTMLDivElement> {
  readonly children: ReactNode;
  readonly className?: string;
}

const ProseComponent: React.FC<ProseProps> = ({ children, className, ...rest }) => {
  return (
    <div 
      {...rest} 
      className={cn(
        'prose prose-invert md:prose-lg my-4 max-w-none',
        className
      )}
    >
      {children}
    </div>
  );
};

const Prose = memo(ProseComponent);
Prose.displayName = 'Prose';

export default Prose;
export { Prose };