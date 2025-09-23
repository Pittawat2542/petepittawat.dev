import type { AnchorHTMLAttributes, FC, ReactNode } from 'react';

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
      className={`relative inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-sm leading-none font-medium text-white/75 backdrop-blur-sm transition-all duration-300 ease-out will-change-transform before:absolute before:inset-0 before:-z-10 before:scale-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%),radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.1),transparent_50%)] before:opacity-0 before:transition-[transform,opacity] before:duration-[350ms,250ms] before:ease-[cubic-bezier(0.4,0,0.2,1),ease-out] hover:-translate-y-0.5 hover:scale-102 hover:transform hover:text-white/95 hover:shadow-[0_8px_25px_-8px_rgba(59,130,246,0.3),0_0_0_1px_rgba(255,255,255,0.1)] hover:before:scale-110 hover:before:opacity-100 focus-visible:-translate-y-px focus-visible:scale-101 focus-visible:transform focus-visible:text-white/95 focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none ${
        isActive
          ? `pointer-events-none -translate-y-px transform cursor-default border border-white/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.15),rgba(255,255,255,0.08)),radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.2),transparent_60%)] text-white/95 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15),0_0_0_1px_rgba(59,130,246,0.3)] before:scale-100 before:bg-[linear-gradient(135deg,rgba(59,130,246,0.2),rgba(139,92,246,0.15)),radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_60%)] before:opacity-80`
          : `cursor-pointer hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05)),radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_70%)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-lg hover:shadow-black/10 active:translate-y-0 active:scale-98`
      } ${className} `}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-cyan-400/20 opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />

      {/* Content */}
      <span className="relative z-10">{children}</span>

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 -translate-x-full rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
    </a>
  );
};

// Memoized component for performance optimization
export const HeaderLink = memo(HeaderLinkComponent);
HeaderLink.displayName = 'HeaderLink';

// Default export for backward compatibility
export default HeaderLink;
