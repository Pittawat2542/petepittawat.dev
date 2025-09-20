import React from 'react';
import { cn } from '../../lib/utils';
import { useGlassGlow } from '../../lib/hooks';

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

    const { glowStyle, handleMouseMove: glowMouseMove, handleMouseLeave: glowMouseLeave } = useGlassGlow<HTMLElement>();

    const baseClasses = [
      'glass-button group relative inline-flex items-center justify-center gap-2',
      'rounded-full font-medium tracking-tight transition-all duration-200 ease-out',
      'border backdrop-blur-sm supports-[backdrop-filter]:backdrop-blur-sm',
      'shadow-[0_10px_30px_-18px_rgba(15,15,35,0.45)] hover:shadow-[0_16px_34px_-16px_rgba(15,15,35,0.55)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--black-nav,#05070f)] focus-visible:ring-[color:var(--accent,#6AC1FF)]',
      'active:scale-[0.985] motion-reduce:transition-none motion-reduce:active:scale-100'
    ];

    const sizeClasses = {
      sm: iconOnly ? 'h-9 w-9 text-sm' : 'min-h-[2.25rem] px-3.5 py-2 text-sm',
      md: iconOnly ? 'h-[2.75rem] w-[2.75rem] text-sm' : 'min-h-[2.75rem] px-[1.125rem] py-2.5 text-sm',
      lg: iconOnly ? 'h-12 w-12 text-base' : 'min-h-[3rem] px-6 py-3 text-base'
    } as const;

    const variantClasses = {
      primary: 'text-[color:var(--white,#FFFFFF)] bg-[rgba(106,193,255,0.18)] border-[rgba(106,193,255,0.45)] hover:bg-[rgba(106,193,255,0.26)] hover:border-[rgba(106,193,255,0.6)]',
      secondary: 'text-[color:var(--white,#FFFFFF)]/85 bg-[rgba(8,12,22,0.55)] border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.18)]',
      ghost: 'text-[color:var(--white,#FFFFFF)]/70 bg-transparent border-transparent hover:text-[color:var(--white,#FFFFFF)]/85 hover:bg-[rgba(255,255,255,0.08)]'
    } as const;

    const combinedClassName = cn(baseClasses, sizeClasses[size], variantClasses[variant], iconOnly && 'px-0', className);

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
      const { className: _ignored, onMouseMove: userMouseMove, onMouseLeave: userMouseLeave, style: userStyle, ...rest } = props as AnchorLikeProps;
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          data-variant={variant}
          className={combinedClassName}
          style={{ ...glowStyle, ...userStyle }}
          onMouseMove={(event) => {
            glowMouseMove(event);
            userMouseMove?.(event);
          }}
          onMouseLeave={(event) => {
            glowMouseLeave(event);
            userMouseLeave?.(event);
          }}
          {...rest}
        >
          {iconPosition === 'left' && finalIcon}
          {!iconOnly && children}
          {iconPosition === 'right' && finalIcon}
        </a>
      );
    }

    const { className: _ignored2, type, onMouseMove: userMouseMove, onMouseLeave: userMouseLeave, style: userStyle, ...restBtn } = props as ButtonLikeProps;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        data-variant={variant}
        className={combinedClassName}
        type={type ?? 'button'}
        style={{ ...glowStyle, ...userStyle }}
        onMouseMove={(event) => {
          glowMouseMove(event);
          userMouseMove?.(event);
        }}
        onMouseLeave={(event) => {
          glowMouseLeave(event);
          userMouseLeave?.(event);
        }}
        {...restBtn}
      >
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
