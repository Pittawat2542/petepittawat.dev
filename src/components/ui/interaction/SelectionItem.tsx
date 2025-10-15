import { memo, type FC, type ReactNode } from 'react';
import Tooltip from '../core/tooltip';
import { cn } from '@/lib/utils';

interface SelectionItemProps {
  readonly label: string;
  readonly selected?: boolean;
  readonly count?: number | undefined;
  readonly icon?: ReactNode;
  readonly className?: string;
}

const SelectionItemComponent: FC<SelectionItemProps> = ({
  label,
  selected = false,
  count,
  icon,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative z-10 flex w-full items-center justify-between gap-3 rounded-full px-3 py-2 transition-[color,background-color] duration-150 ease-out',
        selected ? 'text-[color:var(--white,#FFFFFF)]' : 'text-[color:var(--white,#FFFFFF)]/80',
        className
      )}
      data-selected={selected ? 'true' : undefined}
    >
      <div className="flex min-w-0 items-center gap-2">
        {selected ? (
          <span className="h-4 w-0.5 rounded-full bg-[color:var(--accent,#6AC1FF)]" aria-hidden />
        ) : null}
        {icon ? (
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/8 text-[color:var(--white,#FFFFFF)]/85">
            {icon}
          </span>
        ) : null}
        <Tooltip content={label}>
          <span
            className={cn(
              'line-clamp-2 text-sm leading-snug break-words whitespace-normal',
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
};

// Memoize the component with custom comparison
export const SelectionItem = memo(SelectionItemComponent, (prevProps, nextProps) => {
  return (
    prevProps.label === nextProps.label &&
    prevProps.selected === nextProps.selected &&
    prevProps.count === nextProps.count &&
    prevProps.icon === nextProps.icon &&
    prevProps.className === nextProps.className
  );
});

SelectionItem.displayName = 'SelectionItem';
export default SelectionItem;
