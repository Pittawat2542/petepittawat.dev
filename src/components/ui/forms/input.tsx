import { forwardRef, isValidElement, memo, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useGlassGlow } from '@/lib/hooks';

type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly fieldSize?: InputSize;
  readonly wrapperClassName?: string;
  readonly leadingIcon?: ReactNode;
  readonly trailingIcon?: ReactNode;
}

const sizeMap: Record<InputSize, { wrapper: string; input: string; icon: string }> = {
  sm: {
    wrapper: 'gap-2 px-3 py-1.5',
    input: 'text-xs leading-[1.2rem] py-0.5',
    icon: 'h-4 w-4',
  },
  md: {
    wrapper: 'gap-3 px-4 py-2',
    input: 'text-sm leading-[1.35rem] py-0.5',
    icon: 'h-[18px] w-[18px]',
  },
  lg: {
    wrapper: 'gap-3 px-5 py-2.5',
    input: 'text-base leading-[1.5rem] py-1',
    icon: 'h-5 w-5',
  },
};

const InputComponent = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      wrapperClassName,
      fieldSize = 'md',
      type = 'text',
      leadingIcon,
      trailingIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const { glowStyle, handleMouseMove, handleMouseLeave } = useGlassGlow<HTMLDivElement>();
    const sizeClasses = sizeMap[fieldSize];

    const renderIcon = (icon: ReactNode, position: 'leading' | 'trailing') => {
      if (!icon) return null;
      let isInteractive = false;
      if (isValidElement(icon)) {
        const iconProps = icon.props as Record<string, unknown>;
        const role =
          typeof (iconProps as any)['role'] === 'string'
            ? ((iconProps as any)['role'] as string)
            : undefined;
        const tabIndex = (iconProps as any)['tabIndex'];

        isInteractive =
          typeof (iconProps as any)['onClick'] === 'function' ||
          typeof (iconProps as any)['href'] === 'string' ||
          role === 'button' ||
          typeof tabIndex === 'number';
      }

      return (
        <span
          aria-hidden={isInteractive ? undefined : 'true'}
          className={cn(
            'relative z-10 inline-flex shrink-0 items-center justify-center rounded-full bg-white/4 text-[color:var(--white,#FFFFFF)]/80 backdrop-blur-sm transition-[background-color,box-shadow] duration-150 ease-out',
            !isInteractive && 'pointer-events-none',
            isInteractive &&
              'focus-within:ring-ring/40 cursor-pointer focus-within:ring-2 focus-within:outline-none hover:bg-white/8',
            position === 'leading' ? 'pr-2.5 pl-2' : 'pr-2 pl-2.5',
            fieldSize === 'sm'
              ? 'min-h-[1.5rem]'
              : fieldSize === 'lg'
                ? 'min-h-[2rem]'
                : 'min-h-[1.75rem]'
          )}
        >
          <span className={cn('flex items-center justify-center', sizeClasses.icon)}>{icon}</span>
        </span>
      );
    };

    return (
      <div
        data-size={fieldSize}
        data-disabled={disabled ? 'true' : undefined}
        className={cn(
          'glass-input group w-full cursor-text overflow-hidden rounded-full transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out',
          sizeClasses.wrapper,
          disabled && 'cursor-not-allowed opacity-70',
          wrapperClassName
        )}
        style={glowStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={event => {
          if (disabled) return;
          const input = event.currentTarget.querySelector('input');
          if (!input) return;
          if (
            event.target instanceof HTMLElement &&
            input.contains(event.target) &&
            event.target !== event.currentTarget
          )
            return;
          input.focus({ preventScroll: true });
        }}
      >
        {renderIcon(leadingIcon, 'leading')}
        <input
          type={type}
          className={cn(
            'text-foreground placeholder:text-muted-foreground relative z-10 w-full flex-1 bg-transparent focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-60',
            sizeClasses.input,
            !leadingIcon && 'pl-1',
            !trailingIcon && 'pr-1',
            className
          )}
          ref={ref}
          disabled={disabled}
          {...props}
        />
        {renderIcon(trailingIcon, 'trailing')}
        <span className="glass-input__sheen" aria-hidden="true" />
      </div>
    );
  }
);
InputComponent.displayName = 'InputComponent';

// Memoize the input component
export const Input = memo(InputComponent);
Input.displayName = 'Input';
