import React from 'react';
import { cn } from '../../lib/utils';
import Tooltip from './tooltip';

type SelectionItemProps = {
  label: string;
  selected?: boolean;
  count?: number;
  icon?: React.ReactNode;
  className?: string;
};

export default function SelectionItem({ label, selected = false, count, icon, className }: SelectionItemProps) {
  return (
    <div
      className={cn(
        'relative z-10 flex w-full items-center justify-between gap-3 rounded-full px-3 py-2 transition-[color,background-color] duration-150 ease-out',
        selected ? 'text-[color:var(--white,#FFFFFF)]' : 'text-[color:var(--white,#FFFFFF)]/80',
        className
      )}
      data-selected={selected ? 'true' : undefined}
    >
      <div className="flex items-center gap-2 min-w-0">
        {selected ? <span className="h-4 w-0.5 rounded-full bg-[color:var(--accent,#6AC1FF)]" aria-hidden /> : null}
        {icon ? <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/8 text-[color:var(--white,#FFFFFF)]/85">{icon}</span> : null}
        <Tooltip content={label}>
          <span
            className={cn(
              'text-sm leading-snug whitespace-normal break-words line-clamp-2',
              selected && 'font-medium text-[color:var(--white,#FFFFFF)]'
            )}
          >
            {label}
          </span>
        </Tooltip>
      </div>
      <div className="flex items-center gap-2">
        {typeof count === 'number' && (
          <span className="shrink-0 rounded-full bg-white/12 px-1.5 py-0.5 text-[10px] text-[color:var(--white,#FFFFFF)]/70 transition-colors duration-150 ease-out">
            {count}
          </span>
        )}
      </div>
    </div>
  );
}
