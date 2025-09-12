import { useId, useState } from 'react';
import { Search, X } from 'lucide-react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

export default function SearchInput({ 
  value, 
  onChange, 
  placeholder = 'Search…', 
  ariaLabel = 'Search', 
  className = '',
  size = 'md'
}: Props) {
  const id = useId();
  const [isFocused, setIsFocused] = useState(false);
  
  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base'
  };
  
  const paddingClasses = {
    sm: 'pl-8 pr-8',
    md: 'pl-9 pr-10',
    lg: 'pl-10 pr-12'
  };
  
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18
  };
  
  const clearValue = () => {
    onChange('');
  };
  
  return (
    <label className={`relative w-full md:max-w-md group ${className}`} htmlFor={id}>
      <span className="sr-only">{ariaLabel}</span>
      
      {/* Glass container */}
      <div className={`
        relative glass-input rounded-full transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out will-change-transform
        ${isFocused ? 'ring-2 ring-ring/40' : ''}
      `}>
        {/* Search icon */}
        <Search 
          className={`
            absolute left-3 top-1/2 -translate-y-1/2 transition-[color,opacity] duration-150 ease-out
            ${isFocused ? 'text-ring opacity-100' : 'text-muted-foreground opacity-70'}
          `} 
          size={iconSizes[size]} 
          aria-hidden="true" 
        />
        
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
          className={`
            w-full ${paddingClasses[size]} ${sizeClasses[size]}
            bg-transparent rounded-full border-0
            text-foreground placeholder:text-muted-foreground
            focus-visible:outline-none
            transition-[color,background-color] duration-150 ease-out
          `}
        />
        
        {/* Clear button */}
        {value && (
          <button
            type="button"
            onClick={clearValue}
            className={`
              absolute right-3 top-1/2 -translate-y-1/2
              p-1 rounded-full
              text-muted-foreground hover:text-foreground
              hover:bg-muted/30 transition-[background-color,color] duration-150 ease-out
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40
            `}
            aria-label="Clear search"
            title="Clear search"
          >
            <X size={iconSizes[size] - 2} />
          </button>
        )}
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      </div>
    </label>
  );
}
