import type { ComponentType, FC } from 'react';

import HeaderLink from '../../header/HeaderLink';
import { memo } from 'react';

interface NavigationLink {
  readonly href: string;
  readonly label: string;
  readonly icon: ComponentType<any>;
}

interface NavigationLinksProps {
  readonly links: readonly NavigationLink[];
  readonly isActive: (href: string) => boolean;
}

const NavigationLinksComponent: FC<NavigationLinksProps> = ({ links, isActive }) => {
  return (
    <div className="relative hidden flex-1 items-center justify-center md:flex">
      <nav role="navigation" aria-label="Main navigation">
        <ul
          id="nav-list"
          className="relative flex items-center gap-2 text-sm font-medium text-white/75"
        >
          {links.map(({ href, label, icon: Icon }, index) => {
            const isCurrentPage = isActive(href);
            const animationDelay = `${50 + index * 50}ms`;
            return (
              <li
                key={href}
                className="relative animate-[nav-item-in_400ms_cubic-bezier(0.4,0,0.2,1)_both]"
                style={{ animationDelay }}
              >
                <HeaderLink
                  href={href}
                  isActive={isCurrentPage}
                  ariaLabel={`Navigate to ${label}`}
                  className="group relative overflow-hidden"
                >
                  <span className="relative flex items-center gap-2.5 transition-all duration-300 ease-out">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-all duration-300 ${
                        isCurrentPage
                          ? 'scale-110 text-blue-400 opacity-100'
                          : 'opacity-75 group-hover:scale-105 group-hover:opacity-100'
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className={`transition-all duration-300 ${
                        isCurrentPage
                          ? 'font-semibold text-white'
                          : 'font-medium group-hover:font-semibold'
                      }`}
                    >
                      {label}
                    </span>
                  </span>
                </HeaderLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

// Memoize the component with custom comparison
export const NavigationLinks = memo(NavigationLinksComponent, (prevProps, nextProps) => {
  return prevProps.links === nextProps.links && prevProps.isActive === nextProps.isActive;
});

NavigationLinks.displayName = 'NavigationLinks';
export default NavigationLinks;
export type { NavigationLink };
