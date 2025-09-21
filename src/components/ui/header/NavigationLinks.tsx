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
      <ul id="nav-list" className="relative flex items-center gap-1 text-sm font-medium text-white/70">
        {links.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <HeaderLink href={href} isActive={isActive(href)} ariaLabel={label} className="nav-pill">
              <span className="flex items-center gap-2 transition-colors rounded-full">
                <Icon className="h-4 w-4 opacity-80" aria-hidden="true" />
                <span>{label}</span>
              </span>
            </HeaderLink>
          </li>
        ))}
      </ul>
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