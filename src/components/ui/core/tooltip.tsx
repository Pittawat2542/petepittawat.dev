import { memo, useId, type FC, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  readonly content: ReactNode;
  readonly children: ReactNode;
  readonly side?: 'top' | 'bottom';
}

const TooltipComponent: FC<TooltipProps> = ({ content, children, side = 'top' }) => {
  const id = useId();
  const position =
    side === 'top'
      ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
      : 'top-full mt-2 left-1/2 -translate-x-1/2';

  return (
    <span className="group/tt relative inline-flex" aria-describedby={id}>
      {children}
      <span
        role="tooltip"
        id={id}
        className={cn(
          'pointer-events-none absolute z-[2000] rounded-md px-2 py-1 text-xs whitespace-nowrap',
          'bg-[color:var(--black)] text-[color:var(--white)] shadow-lg ring-1 ring-[color:var(--white)]/10',
          'saturate-150 backdrop-blur-lg md:backdrop-blur-xl',
          'opacity-0 transition-opacity duration-150',
          'group-focus-within/tt:opacity-100 group-hover/tt:opacity-100',
          position
        )}
      >
        {content}
      </span>
    </span>
  );
};

// Memoize the tooltip component
export const Tooltip = memo(TooltipComponent);
Tooltip.displayName = 'Tooltip';
export default Tooltip;
