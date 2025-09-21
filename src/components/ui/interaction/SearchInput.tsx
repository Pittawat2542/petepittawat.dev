import { Search, X } from 'lucide-react';
import { memo, useId, useState } from 'react';

import type { FC } from 'react';
import { useGlassGlow } from '../../../lib/hooks';

interface SearchInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly ariaLabel?: string;
  readonly className?: string;
  readonly size?: 'sm' | 'md' | 'lg';
}

const SearchInputComponent: FC<SearchInputProps> = ({ 
  value, 
  onChange, 
  placeholder = 'Search…', 
  ariaLabel = 'Search', 
  className = '',
  size = 'md'
}) => {
  const id = useId();
  const [isFocused, setIsFocused] = useState(false);
  const { glowStyle, handleMouseMove, handleMouseLeave } = useGlassGlow<HTMLDivElement>();
  
  const sizeConfig = {
    sm: {
      wrapper: 'gap-2 px-3 py-1.5',
      input: 'text-xs leading-5',
      icon: 14,
      button: 'h-6 w-6',
    },
    md: {
      wrapper: 'gap-3 px-4 py-2',
      input: 'text-sm leading-[1.35rem]',
      icon: 16,
      button: 'h-8 w-8',
    },
    lg: {
      wrapper: 'gap-3 px-5 py-2.5',
      input: 'text-base leading-[1.5rem]',
      icon: 18,
      button: 'h-9 w-9',
    },
  } as const;
  
  const clearValue = () => {
    onChange('');
  };
  
  return (
    <label className={`relative w-full md:max-w-md ${className}`} htmlFor={id}>
      <span className="sr-only">{ariaLabel}</span>
      
      {/* Glass container */}
      <div
        className={`glass-input group relative flex items-center w-full overflow-hidden rounded-full transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out ${sizeConfig[size].wrapper}`}
        data-size={size}
        data-active={isFocused ? 'true' : undefined}
        style={glowStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Search icon */}
        <span
          className={`relative z-10 inline-flex shrink-0 items-center justify-center rounded-full bg-white/4 text-[color:var(--white,#FFFFFF)]/80 backdrop-blur-sm transition-[color,opacity,background-color] duration-150 ease-out ${size === 'sm' ? 'min-h-[1.5rem] w-[2rem]' : size === 'lg' ? 'min-h-[2rem] w-[2.4rem]' : 'min-h-[1.75rem] w-[2.25rem]'}`}
        >
          <Search
            className={`${isFocused ? 'text-[color:var(--accent,#6AC1FF)] opacity-100' : 'opacity-70 text-[color:var(--white,#FFFFFF)]/80'}`}
            size={sizeConfig[size].icon}
            aria-hidden="true"
          />
        </span>
        
        {/* Input */}
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          id={id}
          aria-label={ariaLabel}
          title={ariaLabel}
          className={`relative z-10 w-full flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:outline-none ${sizeConfig[size].input}`}
        />
        
        {/* Clear button */}
        {value && (
          <button
            type="button"
            onClick={clearValue}
            className={`relative z-10 inline-flex items-center justify-center rounded-full bg-white/6 text-[color:var(--white,#FFFFFF)]/70 transition-all duration-150 ease-out hover:bg-white/14 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(8,12,22,0.85)] ${sizeConfig[size].button}`}
            aria-label="Clear search"
            title="Clear search"
          >
            <X size={sizeConfig[size].icon - 2} />
          </button>
        )}
        
        <span className="glass-input__sheen" aria-hidden="true" />
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
    prevProps.onChange === nextProps.onChange
  );
});

SearchInput.displayName = 'SearchInput';
export default SearchInput;
