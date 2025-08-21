import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import SelectionItem from './SelectionItem';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from './dropdown-menu';

export type SelectorOption = { value: string; label: string; count?: number; icon?: ReactNode };

type SelectorProps = {
  label?: string;
  value: string;
  options: SelectorOption[];
  onChange: (value: string) => void;
  className?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'bottom' | 'top' | 'right' | 'left';
};

export default function Selector({ label, value, options, onChange, className, align = 'start', side = 'bottom' }: SelectorProps) {
  const current = options.find((o) => o.value === value) || options[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'glass-surface rounded-lg px-3 py-2 text-sm bg-transparent border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 appearance-none pr-8 relative min-w-[12rem] max-w-[18rem] text-left',
            className
          )}
          aria-label={label}
          title={label}
        >
          <span className="block truncate inline-flex items-center gap-2">
            {current?.icon ? <span className="opacity-80 shrink-0">{current.icon}</span> : null}
            <span className="truncate">{current?.label}</span>
          </span>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-70 pointer-events-none" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side} className="min-w-[14rem] w-auto max-h-[60vh] overflow-y-auto p-1">
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map((opt) => (
            <DropdownMenuRadioItem key={opt.value} value={opt.value} className="cursor-pointer">
              <SelectionItem label={opt.label} selected={opt.value === value} count={opt.count} icon={opt.icon} />
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
