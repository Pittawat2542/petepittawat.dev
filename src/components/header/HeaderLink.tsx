import type { AnchorHTMLAttributes, FC, ReactNode } from 'react';
import { memo } from 'react';

import { cn } from '@/lib/utils';

interface HeaderLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  readonly href: string;
  readonly isActive?: boolean;
  readonly ariaLabel?: string;
  readonly children: ReactNode;
}

const HeaderLinkComponent: FC<HeaderLinkProps> = ({
  href,
  className = '',
  isActive = false,
  ariaLabel,
  children,
  ...rest
}) => {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      aria-current={isActive ? 'page' : undefined}
      data-active={isActive ? 'true' : undefined}
      {...rest}
      className={cn(
        'nav-link-root navlink relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm leading-none font-medium text-[color:var(--white)]/80 transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-[color:var(--white)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--black-nav,#020617)] focus-visible:outline-none',
        isActive
          ? 'nav-link--active text-[color:var(--white)]'
          : 'nav-link--idle hover:-translate-y-0.5 hover:text-[color:var(--white)]',
        className
      )}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span
        className="nav-link__overlay pointer-events-none absolute inset-0 rounded-full opacity-0 transition-transform duration-300 ease-out"
        aria-hidden="true"
      ></span>
    </a>
  );
};

// Memoized component for performance optimization
export const HeaderLink = memo(HeaderLinkComponent);
HeaderLink.displayName = 'HeaderLink';

// Default export for backward compatibility
export default HeaderLink;
