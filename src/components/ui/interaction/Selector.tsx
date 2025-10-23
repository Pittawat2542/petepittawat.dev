import { memo, type FC, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/core/dropdown-menu';
import SelectionItem from './SelectionItem';
import { cn } from '@/lib/utils';
import { useGlassGlow } from '@/lib/hooks';

export interface SelectorOption {
  readonly value: string;
  readonly label: string;
  readonly count?: number | undefined;
  readonly icon?: ReactNode;
}

interface SelectorProps {
  readonly label?: string;
  readonly value: string;
  readonly options: readonly SelectorOption[];
  readonly onChange: (value: string) => void;
  readonly className?: string;
  readonly align?: 'start' | 'center' | 'end';
  readonly side?: 'bottom' | 'top' | 'right' | 'left';
}

const SelectorComponent: FC<SelectorProps> = ({
  label,
  value,
  options,
  onChange,
  className,
  align = 'start',
  side = 'bottom',
}) => {
  const current = options.find(o => o.value === value) || options[0];
  const { glowStyle, handleMouseMove, handleMouseLeave } = useGlassGlow<HTMLButtonElement>();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'glass-input shape-squircle-sm group relative w-full min-w-0 appearance-none text-left text-sm transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out sm:w-auto',
            'rounded-[1.15rem] px-4 py-2 sm:max-w-[18rem] sm:min-w-[12rem]',
            className
          )}
          aria-label={label}
          title={label}
          style={glowStyle}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <span className="relative z-10 flex w-full items-center gap-2 truncate text-[color:var(--white,#FFFFFF)]/85">
            {current?.icon ? (
              <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-white/6 p-1 text-[color:var(--white,#FFFFFF)]/80">
                {current.icon}
              </span>
            ) : null}
            <span className="truncate font-medium text-[color:var(--white,#FFFFFF)]">
              {current?.label}
            </span>
          </span>
          <span className="glass-input__sheen" aria-hidden="true" />
          <ChevronDown
            size={16}
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[color:var(--white,#FFFFFF)]/60 transition-transform duration-200 ease-out group-hover:translate-y-[1px]"
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        className="max-h-[60vh] w-auto min-w-[14rem] overflow-y-auto border-white/8 bg-[rgba(7,14,24,0.82)] p-1 backdrop-blur-xl"
      >
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map(opt => (
            <DropdownMenuRadioItem key={opt.value} value={opt.value} className="cursor-pointer">
              <SelectionItem
                label={opt.label}
                selected={opt.value === value}
                count={opt.count}
                icon={opt.icon}
              />
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Memoize the component with custom comparison
export const Selector = memo(SelectorComponent, (prevProps, nextProps) => {
  return (
    prevProps.label === nextProps.label &&
    prevProps.value === nextProps.value &&
    prevProps.options === nextProps.options &&
    prevProps.className === nextProps.className &&
    prevProps.align === nextProps.align &&
    prevProps.side === nextProps.side &&
    prevProps.onChange === nextProps.onChange
  );
});

Selector.displayName = 'Selector';
export default Selector;
