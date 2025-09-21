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
        <ul id="nav-list" className="relative flex items-center gap-2 text-sm font-medium text-white/75">
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
                      className={`h-4 w-4 transition-all duration-300 shrink-0 ${
                        isCurrentPage 
                          ? 'opacity-100 scale-110 text-blue-400' 
                          : 'opacity-75 group-hover:opacity-100 group-hover:scale-105'
                      }`} 
                      aria-hidden="true" 
                    />
                    <span className={`transition-all duration-300 ${
                      isCurrentPage 
                        ? 'font-semibold text-white' 
                        : 'font-medium group-hover:font-semibold'
                    }`}>
                      {label}
                    </span>
                  </span>
                  
                  {/* Enhanced hover background effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  
                  {/* Active page indicator */}
                  {isCurrentPage && (
                    <div className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 shadow-lg shadow-blue-500/50" />
                  )}
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
  return (
    prevProps.links === nextProps.links &&
    prevProps.isActive === nextProps.isActive
  );
});

NavigationLinks.displayName = 'NavigationLinks';
export default NavigationLinks;
export type { NavigationLink };