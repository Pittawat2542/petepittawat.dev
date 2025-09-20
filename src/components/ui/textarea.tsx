import * as React from 'react';
import { cn } from '../../lib/utils';
import { useGlassGlow } from '../../lib/hooks';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  wrapperClassName?: string;
  autoGrow?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, wrapperClassName, autoGrow = false, disabled, onInput, ...props }, ref) => {
    const { glowStyle, handleMouseMove, handleMouseLeave } = useGlassGlow<HTMLDivElement>();

    const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
      if (autoGrow) {
        const element = event.currentTarget;
        element.style.height = 'auto';
        element.style.height = `${Math.max(element.scrollHeight, 96)}px`;
      }
      onInput?.(event);
    };

    return (
      <div
        className={cn(
          'glass-input group w-full overflow-hidden rounded-[1.75rem] px-4 py-3 transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out',
          disabled && 'cursor-not-allowed opacity-70',
          wrapperClassName
        )}
        data-size="lg"
        data-disabled={disabled ? 'true' : undefined}
        style={glowStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={(event) => {
          if (disabled) return;
          const textarea = event.currentTarget.querySelector('textarea');
          if (!textarea) return;
          if (event.target instanceof HTMLElement && textarea.contains(event.target) && event.target !== event.currentTarget) return;
          textarea.focus({ preventScroll: true });
        }}
      >
        <textarea
          className={cn(
            'relative z-10 min-h-[96px] w-full resize-y bg-transparent text-sm leading-7 text-foreground placeholder:text-muted-foreground focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-60',
            className
          )}
          ref={ref}
          disabled={disabled}
          onInput={handleInput}
          {...props}
        />
        <span className="glass-input__sheen" aria-hidden="true" />
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
