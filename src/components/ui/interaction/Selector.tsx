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
  readonly tone?: 'default' | 'editorial' | undefined;
}

const SelectorComponent: FC<SelectorProps> = ({
  label,
  value,
  options,
  onChange,
  className,
  align = 'start',
  side = 'bottom',
  tone = 'default',
}) => {
  const current = options.find(o => o.value === value) ?? options[0];
  const { glowStyle, handleMouseMove, handleMouseLeave } = useGlassGlow<HTMLButtonElement>();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'shape-squircle-sm group relative w-full min-w-0 appearance-none text-left text-sm transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out sm:w-auto',
            tone === 'editorial'
              ? 'border border-white/10 bg-[rgba(15,23,42,0.36)] shadow-[0_18px_34px_-30px_rgba(3,7,18,0.85)] backdrop-blur-xl'
              : 'glass-input',
            'rounded-[1.15rem] px-4 py-2 sm:max-w-[18rem] sm:min-w-[12rem]',
            className
          )}
          aria-label={label}
          title={label}
          style={tone === 'editorial' ? undefined : glowStyle}
          onMouseMove={tone === 'editorial' ? undefined : handleMouseMove}
          onMouseLeave={tone === 'editorial' ? undefined : handleMouseLeave}
        >
          <span
            className={cn(
              'relative z-10 flex w-full items-center gap-2 truncate',
              tone === 'editorial' ? 'text-white/75' : 'text-[color:var(--white,#FFFFFF)]/85'
            )}
          >
            {current?.icon ? (
              <span
                className={cn(
                  'inline-flex shrink-0 items-center justify-center rounded-full p-1',
                  tone === 'editorial'
                    ? 'bg-white/[0.06] text-white/56'
                    : 'bg-white/6 text-[color:var(--white,#FFFFFF)]/80'
                )}
              >
                {current.icon}
              </span>
            ) : null}
            <span
              className={cn(
                'truncate font-medium',
                tone === 'editorial' ? 'text-white' : 'text-[color:var(--white,#FFFFFF)]'
              )}
            >
              {current?.label}
            </span>
          </span>
          {tone === 'default' && <span className="glass-input__sheen" aria-hidden="true" />}
          <ChevronDown
            size={16}
            className={cn(
              'pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transition-transform duration-200 ease-out group-hover:translate-y-[1px]',
              tone === 'editorial' ? 'text-white/38' : 'text-[color:var(--white,#FFFFFF)]/60'
            )}
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        className={cn(
          'max-h-[60vh] w-auto min-w-[14rem] overflow-y-auto p-1',
          tone === 'editorial'
            ? 'border-white/10 bg-[rgba(8,14,28,0.96)] text-white shadow-[0_26px_44px_-28px_rgba(3,7,18,0.82)] backdrop-blur-xl'
            : 'border-white/8 bg-[rgba(7,14,24,0.82)] backdrop-blur-xl'
        )}
      >
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map(opt => (
            <DropdownMenuRadioItem key={opt.value} value={opt.value} className="cursor-pointer">
              <SelectionItem
                label={opt.label}
                selected={opt.value === value}
                count={opt.count}
                icon={opt.icon}
                tone={tone}
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
    prevProps.tone === nextProps.tone &&
    prevProps.onChange === nextProps.onChange
  );
});

Selector.displayName = 'Selector';
export default Selector;
