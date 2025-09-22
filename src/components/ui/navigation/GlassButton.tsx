import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Mail,
  Plus,
  Search
} from 'lucide-react';
import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { memo } from 'react';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly children?: ReactNode;
  readonly href?: string;
  readonly variant?: 'primary' | 'secondary' | 'ghost';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly as?: 'button' | 'a';
  readonly icon?: 'external' | 'arrow-right' | 'chevron-right' | 'chevron-left' | 'search' | 'download' | 'plus' | 'mail';
  readonly iconPosition?: 'left' | 'right';
  readonly iconOnly?: boolean;
  readonly autoIcon?: boolean;
  readonly target?: string;
  readonly download?: string;
}

const GlassButtonComponent: FC<GlassButtonProps> = ({
  children,
  className,
  href,
  variant = 'primary',
  size = 'md',
  as = href ? 'a' : 'button',
  icon,
  iconPosition = 'right',
  iconOnly = false,
  autoIcon = true,
  target,
  download,
  ...rest
}) => {
  const getVariantClasses = (variant: 'primary' | 'secondary' | 'ghost', size: 'sm' | 'md' | 'lg') => {
    const baseClasses = 'glass-button rounded-full font-medium transition-[transform,box-shadow,background-color,color,border-color] duration-150 ease-out will-change-transform active:scale-[0.98] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 inline-flex items-center justify-center gap-2 relative overflow-hidden group';
    
    const sizeClasses = {
      sm: iconOnly ? 'h-8 w-8 text-sm' : 'px-3 py-2 text-sm h-8',
      md: iconOnly ? 'h-10 w-10 text-sm' : 'px-4 py-2.5 text-sm h-10',
      lg: iconOnly ? 'h-12 w-12 text-base' : 'px-6 py-3 text-base h-12'
    } as const;
    
    const variantClasses = {
      primary: 'text-white bg-primary/20 border-primary/40 hover:bg-primary/30 hover:text-white hover:border-primary/60 shadow-primary/20',
      secondary: 'text-foreground bg-muted/30 border-muted/50 hover:bg-muted/40 hover:border-muted/70 hover:text-foreground',
      ghost: 'text-muted-foreground bg-transparent border-transparent hover:bg-accent/30 hover:text-foreground hover:border-accent/20'
    } as const;
    
    return cn(baseClasses, sizeClasses[size], variantClasses[variant]);
  };

  const isExternalHref = (u?: string) => !!u && /^(https?:)?\/\//i.test(u);

  const pickAutoIcon = (): GlassButtonProps['icon'] | undefined => {
    if (!autoIcon) return undefined;
    if (as === 'a' && href) {
      if (download || /\.(pdf|zip|dmg|pkg|exe|apk|ipa|csv|xlsx?)$/i.test(href)) return 'download';
      if (target === '_blank' || isExternalHref(href)) return 'external';
    }
    return undefined;
  };

  const finalIcon = icon ?? pickAutoIcon();

  const IconComponent = {
    external: ExternalLink,
    'arrow-right': ArrowRight,
    'chevron-right': ChevronRight,
    'chevron-left': ChevronLeft,
    search: Search,
    download: Download,
    plus: Plus,
    mail: Mail,
  }[finalIcon!];

  const commonProps = {
    className: cn(getVariantClasses(variant, size), className),
    'data-variant': variant,
  };

  const iconElement = IconComponent && (
    <IconComponent aria-hidden="true" className="w-4 h-4" />
  );

  const content = (
    <>
      {iconPosition === 'left' && iconElement}
      {!iconOnly && children}
      {iconPosition === 'right' && iconElement}
    </>
  );

  if (as === 'a') {
    return (
      <a href={href} target={target} download={download} {...commonProps}>
        {content}
      </a>
    );
  }

  return (
    <button {...commonProps} {...rest}>
      {content}
    </button>
  );
};

export const GlassButton = memo(GlassButtonComponent);
GlassButton.displayName = 'GlassButton';
export default GlassButton;