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
        'group flex items-center justify-between gap-3 rounded-lg px-3 py-2 ring-1 ring-transparent',
        selected ? 'bg-white/10 ring-white/20 text-foreground' : 'hover:bg-white/5 hover:ring-white/10',
        className
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        {selected ? <span className="h-4 w-0.5 rounded-full bg-ring" aria-hidden /> : null}
        {icon ? <span className="shrink-0 opacity-80">{icon}</span> : null}
        <Tooltip content={label}>
          <span
            className={cn(
              'text-sm leading-snug whitespace-normal break-words line-clamp-2',
              selected && 'font-medium'
            )}
          >
            {label}
          </span>
        </Tooltip>
      </div>
      <div className="flex items-center gap-2">
        {typeof count === 'number' && (
          <span className="shrink-0 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] text-muted-foreground">{count}</span>
        )}
      </div>
    </div>
  );
}
