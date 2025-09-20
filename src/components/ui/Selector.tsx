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
import { useGlassGlow } from '../../lib/hooks';

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
  const { glowStyle, handleMouseMove, handleMouseLeave } = useGlassGlow<HTMLButtonElement>();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'glass-input group relative w-full sm:w-auto min-w-0 appearance-none text-left text-sm transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out',
            'rounded-full px-4 py-2 sm:min-w-[12rem] sm:max-w-[18rem]',
            className
          )}
          aria-label={label}
          title={label}
          style={glowStyle}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <span className="relative z-10 flex w-full items-center gap-2 truncate text-[color:var(--white,#FFFFFF)]/85">
            {current?.icon ? <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-white/6 p-1 text-[color:var(--white,#FFFFFF)]/80">{current.icon}</span> : null}
            <span className="truncate font-medium text-[color:var(--white,#FFFFFF)]">{current?.label}</span>
          </span>
          <span className="glass-input__sheen" aria-hidden="true" />
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--white,#FFFFFF)]/60 transition-transform duration-200 ease-out group-hover:translate-y-[1px]"
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side} className="min-w-[14rem] w-auto max-h-[60vh] overflow-y-auto border-white/8 bg-[rgba(7,14,24,0.82)] p-1 backdrop-blur-xl">
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
