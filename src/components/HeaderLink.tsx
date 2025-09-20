import React from 'react';

interface HeaderLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  isActive?: boolean;
  ariaLabel?: string;
  children: React.ReactNode;
}

export default function HeaderLink({ 
  href, 
  className = '', 
  isActive = false, 
  ariaLabel,
  children,
  ...rest
}: HeaderLinkProps) {
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
              transition-colors duration-150 ease-out
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--white)]/30
              ${isActive ? 'bg-[color:var(--white)]/15 text-white shadow-inner shadow-lg pointer-events-none cursor-default' : 'cursor-pointer'}
              ${className}`}
    >
      {children}
    </a>
  );
}
