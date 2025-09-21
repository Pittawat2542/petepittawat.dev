import type { FC, ReactNode } from 'react';
import React, { memo } from 'react';

interface TooltipProps {
  readonly content: ReactNode;
  readonly children: ReactNode;
  readonly side?: 'top' | 'bottom';
}

const TooltipComponent: FC<TooltipProps> = ({ content, children, side = 'top' }) => {
  const id = React.useId();
  const position = side === 'top'
    ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
    : 'top-full mt-2 left-1/2 -translate-x-1/2';

  return (
    <span className="relative inline-flex group/tt" aria-describedby={id}>
      {children}
      <span
        role="tooltip"
        id={id}
        className={[
          'pointer-events-none absolute z-[2000] whitespace-nowrap rounded-md px-2 py-1 text-xs',
          'bg-[color:var(--black)] text-[color:var(--white)] shadow-lg ring-1 ring-[color:var(--white)]/10',
          'backdrop-blur-lg md:backdrop-blur-xl saturate-150',
          'opacity-0 transition-opacity duration-150',
          'group-hover/tt:opacity-100 group-focus-within/tt:opacity-100',
          position,
        ].join(' ')}
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
