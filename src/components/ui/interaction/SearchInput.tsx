import { Search, X, Tag } from 'lucide-react';
import { memo, useId, useState, type FC } from 'react';
import { cn } from '@/lib/utils';
import { useGlassGlow } from '@/lib/hooks';

const SIZE_CONFIG = {
  sm: {
    wrapper: 'gap-2 px-3 py-1.5',
    input: 'text-xs leading-5',
    icon: 14,
    button: 'h-6 w-6',
    iconWrapper: 'min-h-[1.5rem] w-[2rem]',
  },
  md: {
    wrapper: 'gap-3 px-4 py-2',
    input: 'text-sm leading-[1.35rem]',
    icon: 16,
    button: 'h-8 w-8',
    iconWrapper: 'min-h-[1.75rem] w-[2.25rem]',
  },
  lg: {
    wrapper: 'gap-3 px-5 py-2.5',
    input: 'text-base leading-[1.5rem]',
    icon: 18,
    button: 'h-9 w-9',
    iconWrapper: 'min-h-[2rem] w-[2.4rem]',
  },
} as const;

type SearchInputSize = keyof typeof SIZE_CONFIG;

interface SearchInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly ariaLabel?: string;
  readonly className?: string;
  readonly size?: SearchInputSize;
  readonly tone?: 'default' | 'editorial' | undefined;
}

const SearchInputComponent: FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search…',
  ariaLabel = 'Search',
  className,
  size = 'md',
  tone = 'default',
}) => {
  const id = useId();
  const [isFocused, setIsFocused] = useState(false);
  const { glowStyle, handleMouseMove, handleMouseLeave } = useGlassGlow<HTMLDivElement>();

  const clearValue = () => {
    onChange('');
  };

  const isTagSearch = value.startsWith('#');
  const sizeConfig = SIZE_CONFIG[size] ?? SIZE_CONFIG.md;

  const iconStateClass = isFocused
    ? tone === 'editorial'
      ? 'text-[color:var(--accent,#6AC1FF)] opacity-100'
      : 'text-[color:var(--accent,#6AC1FF)] opacity-100'
    : tone === 'editorial'
      ? 'text-white/60 opacity-90'
      : 'text-[color:var(--white,#FFFFFF)]/80 opacity-70';

  return (
    <label className={cn('relative w-full md:max-w-md', className)} htmlFor={id}>
      <span className="sr-only">{ariaLabel}</span>

      {/* Glass container */}
      <div
        className={cn(
          'shape-squircle-sm group relative flex w-full items-center overflow-hidden rounded-[1.2rem] transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out',
          tone === 'editorial'
            ? 'border border-white/10 bg-[rgba(15,23,42,0.36)] shadow-[0_18px_34px_-30px_rgba(3,7,18,0.85)] backdrop-blur-xl'
            : 'glass-input',
          sizeConfig.wrapper
        )}
        data-size={size}
        data-active={isFocused ? 'true' : undefined}
        style={tone === 'editorial' ? undefined : glowStyle}
        onMouseMove={tone === 'editorial' ? undefined : handleMouseMove}
        onMouseLeave={tone === 'editorial' ? undefined : handleMouseLeave}
      >
        {/* Search icon */}
        <span
          className={cn(
            'shape-squircle-sm relative z-10 inline-flex shrink-0 items-center justify-center rounded-[1.2rem] transition-[color,opacity,background-color] duration-150 ease-out',
            tone === 'editorial'
              ? 'bg-white/[0.06] text-white/60'
              : 'bg-white/4 text-[color:var(--white,#FFFFFF)]/80 backdrop-blur-sm',
            sizeConfig.iconWrapper
          )}
        >
          {isTagSearch ? (
            <Tag
              className={cn(iconStateClass, 'search-input-icon--tag')}
              size={sizeConfig.icon}
              aria-hidden="true"
            />
          ) : (
            <Search className={iconStateClass} size={sizeConfig.icon} aria-hidden="true" />
          )}
        </span>

        {/* Input */}
        <input
          type="search"
          value={value}
          onChange={e => {
            onChange(e.target.value);
          }}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          placeholder={placeholder}
          id={id}
          aria-label={ariaLabel}
          title={ariaLabel}
          className={cn(
            'relative z-10 w-full flex-1 bg-transparent focus-visible:outline-none',
            tone === 'editorial'
              ? 'text-white placeholder:text-white/38'
              : 'text-foreground placeholder:text-muted-foreground',
            sizeConfig.input
          )}
        />

        {/* Clear button */}
        {value && (
          <button
            type="button"
            onClick={clearValue}
            className={cn(
              'focus-visible:ring-ring/50 shape-squircle-sm relative z-10 inline-flex items-center justify-center rounded-[1.2rem] transition-all duration-150 ease-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              tone === 'editorial'
                ? 'bg-white/[0.06] text-white/52 hover:bg-white/[0.12] hover:text-white focus-visible:ring-offset-[rgba(5,10,20,0.92)]'
                : 'bg-white/6 text-[color:var(--white,#FFFFFF)]/70 hover:bg-white/14 hover:text-white focus-visible:ring-offset-[rgba(8,12,22,0.85)]',
              sizeConfig.button
            )}
            aria-label="Clear search"
            title="Clear search"
          >
            <X size={sizeConfig.icon - 2} />
          </button>
        )}

        {tone === 'default' && <span className="glass-input__sheen" aria-hidden="true" />}
      </div>
    </label>
  );
};

// Memoize the component with custom comparison
export const SearchInput = memo(SearchInputComponent, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.ariaLabel === nextProps.ariaLabel &&
    prevProps.className === nextProps.className &&
    prevProps.size === nextProps.size &&
    prevProps.tone === nextProps.tone &&
    prevProps.onChange === nextProps.onChange
  );
});

SearchInput.displayName = 'SearchInput';
export default SearchInput;
