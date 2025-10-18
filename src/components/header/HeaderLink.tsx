import type { AnchorHTMLAttributes, FC, ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { memo } from 'react';

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
        'nav-link-root shape-squircle-sm relative inline-flex items-center gap-2 rounded-[1.2rem] px-3.5 py-2 text-sm font-medium text-white/80 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-white focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:outline-none lg:px-4 lg:py-2.5',
        isActive && 'nav-link--active text-white',
        className
      )}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span
        className="nav-link__overlay shape-squircle-sm pointer-events-none absolute inset-0 rounded-[1.2rem] opacity-0 transition-transform duration-300 ease-out"
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
