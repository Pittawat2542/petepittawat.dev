import React from 'react';
import { cn } from '../../lib/utils';

type IconName = 'external' | 'arrow-right' | 'chevron-right' | 'search' | 'download' | 'plus' | 'mail';

type CommonProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode | IconName;
  iconPosition?: 'left' | 'right';
  iconOnly?: boolean;
  autoIcon?: boolean;
};

type AnchorLikeProps = CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  as?: 'a';
  href: string;
};

type ButtonLikeProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: 'button';
  href?: never;
};

type GlassButtonProps = AnchorLikeProps | ButtonLikeProps;

const GlassButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, GlassButtonProps>(
  ({ className, variant = 'primary', size = 'md', as, children, icon, iconPosition = 'right', iconOnly = false, autoIcon = true, ...props }, ref) => {
    const isAnchor = as === 'a' || ('href' in (props as AnchorLikeProps));

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

    const combinedClassName = cn(
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      className
    );

    const href = (props as AnchorLikeProps).href;
    const target = (props as any)?.target as string | undefined;
    const download = (props as any)?.download as any;

    const isExternal = (u?: string) => !!u && /^(https?:)?\/\//i.test(u);
    const pickAutoIcon = (): IconName | undefined => {
      if (!autoIcon) return undefined;
      if (isAnchor && href) {
        if (download || /\.(pdf|zip|dmg|pkg|exe|apk|ipa|csv|xlsx?)$/i.test(href)) return 'download';
        if (target === '_blank' || isExternal(href)) return 'external';
      }
      return undefined;
    };

    const finalIcon: React.ReactNode | undefined = ((): React.ReactNode | undefined => {
      if (icon && typeof icon !== 'string') return icon;
      const name = (icon as IconName | undefined) ?? pickAutoIcon();
      if (!name) return undefined;
      const c = 'w-4 h-4';
      switch (name) {
        case 'external':
          return (<svg aria-hidden="true" className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>);
        case 'arrow-right':
          return (<svg aria-hidden="true" className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>);
        case 'chevron-right':
          return (<svg aria-hidden="true" className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>);
        case 'search':
          return (<svg aria-hidden="true" className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
        case 'download':
          return (<svg aria-hidden="true" className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>);
        case 'plus':
          return (<svg aria-hidden="true" className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
        case 'mail':
        default:
          return (<svg aria-hidden="true" className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z" fill="none"/><polyline points="22,6 12,13 2,6"/></svg>);
      }
    })();

    if (isAnchor) {
      const { className: _ignored, ...rest } = props as AnchorLikeProps;
      return (
        <a ref={ref as React.Ref<HTMLAnchorElement>} data-variant={variant} className={combinedClassName} {...rest}>
          {iconPosition === 'left' && finalIcon}
          {!iconOnly && children}
          {iconPosition === 'right' && finalIcon}
        </a>
      );
    }

    const { className: _ignored2, ...restBtn } = props as ButtonLikeProps;
    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} data-variant={variant} className={combinedClassName} {...restBtn}>
        {iconPosition === 'left' && finalIcon}
        {!iconOnly && children}
        {iconPosition === 'right' && finalIcon}
      </button>
    );
  }
);

GlassButton.displayName = 'GlassButton';

export { GlassButton };
export default GlassButton;
