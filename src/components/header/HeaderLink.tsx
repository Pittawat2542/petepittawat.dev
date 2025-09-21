import type { AnchorHTMLAttributes, FC, ReactNode } from 'react';

import { UI_CONFIG } from '@/lib/constants';
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
      tabIndex={isActive ? -1 : undefined}
      {...rest}
      className={`rounded-full px-4 py-2 text-sm font-medium inline-flex items-center gap-1.5 leading-none nav-pill nav-link
              text-[color:var(--white)]/85 hover:text-[color:var(--white)]
              transition-colors duration-${UI_CONFIG.ANIMATION.FAST} ease-out
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--white)]/30
              ${
                isActive 
                  ? 'bg-[color:var(--white)]/15 text-white shadow-lg pointer-events-none cursor-default' 
                  : 'cursor-pointer'
              }
              ${className}`}
    >
      {children}
    </a>
  );
};

// Memoized component for performance optimization
export const HeaderLink = memo(HeaderLinkComponent);
HeaderLink.displayName = 'HeaderLink';

// Default export for backward compatibility
export default HeaderLink;
