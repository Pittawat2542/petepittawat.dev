import React from 'react';
import { X } from 'lucide-react';

type FilterChipProps = {
  children: React.ReactNode;
  active?: boolean;
  count?: number;
  onClick?: () => void;
  onRemove?: () => void;
  variant?: 'default' | 'primary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  className?: string;
};

export default function FilterChip({
  children,
  active = false,
  count,
  onClick,
  onRemove,
  variant = 'default',
  size = 'md',
  removable = false,
  className = ''
}: FilterChipProps) {
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs h-7',
    md: 'px-3 py-1.5 text-sm h-8',
    lg: 'px-4 py-2 text-base h-10'
  };

  const getVariantClasses = (variant: string, active: boolean) => {
    const baseClasses = 'glass-surface rounded-full transition-all duration-200 ease-out backdrop-blur-md border';
    
    if (active) {
      switch (variant) {
        case 'primary':
          return `${baseClasses} bg-primary/30 text-primary-foreground border-primary/40 shadow-primary/20`;
        case 'accent':
          return `${baseClasses} bg-ring/30 text-white border-ring/40 shadow-ring/20`;
        default:
          return `${baseClasses} glass-surface-elevated border-ring/30 text-foreground shadow-ring/10`;
      }
    } else {
      return `${baseClasses} bg-muted/20 text-muted-foreground border-muted/30 hover:glass-surface-elevated hover:bg-muted/30 hover:text-foreground hover:border-muted/50`;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onRemove?.();
  };

  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      className={`
        inline-flex items-center gap-1.5 font-medium whitespace-nowrap
        ${sizeClasses[size]}
        ${getVariantClasses(variant, active)}
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
        ${onClick ? 'hover:scale-105 active:scale-95' : ''}
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-1
        ${className}
      `}
      {...(onClick && { onClick: handleClick })}
      {...(onClick && { 'aria-pressed': active })}
      {...(onClick && { role: 'button' })}
    >
      <span className="truncate">{children}</span>
      
      {count !== undefined && (
        <span className={`
          text-xs font-semibold rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center
          ${active 
            ? variant === 'accent' 
              ? 'bg-white/25 text-white font-bold shadow-sm' 
              : variant === 'primary'
                ? 'bg-white/20 text-white font-bold shadow-sm'
                : 'bg-white/20 text-white font-bold shadow-sm'
            : 'bg-muted/40 text-muted-foreground opacity-70'
          }
          transition-all duration-200
        `}>
          {count}
        </span>
      )}
      
      {removable && onRemove && (
        <button
          type="button"
          onClick={handleRemove}
          className={`
            p-0.5 rounded-full transition-all duration-200
            ${active 
              ? 'hover:bg-black/20 text-black/60 hover:text-black' 
              : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
            }
            focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40
          `}
          aria-label={`Remove ${children} filter`}
          title="Remove filter"
        >
          <X size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} />
        </button>
      )}
      
      {/* Subtle inner glow for active state */}
      {active && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/[0.05] via-transparent to-white/[0.05] pointer-events-none" />
      )}
    </Component>
  );
}
