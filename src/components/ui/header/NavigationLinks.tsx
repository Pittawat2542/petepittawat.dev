import { memo, type ComponentType, type FC } from 'react';
import HeaderLink from '../../header/HeaderLink';
import { cn } from '@/lib/utils';

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
  const baseDelaySeconds = 0.04;

  return (
    <div className="relative hidden flex-1 items-center justify-center md:flex md:px-1 lg:px-0">
      <nav role="navigation" aria-label="Main navigation">
        <ul
          id="nav-list"
          className="relative flex items-center gap-1.5 text-sm font-medium text-white/75 lg:gap-2"
        >
          {links.map(({ href, label, icon: Icon }, index) => {
            const isCurrentPage = isActive(href);
            const animationDelay = `${(index + 1) * baseDelaySeconds}s`;
            return (
              <li
                key={href}
                className="relative animate-[nav-item-in_var(--motion-duration-slow)_var(--motion-ease-standard)_both]"
                style={{ animationDelay }}
              >
                <HeaderLink
                  href={href}
                  isActive={isCurrentPage}
                  ariaLabel={`Navigate to ${label}`}
                  className="group relative overflow-hidden"
                >
                  <span className="relative flex items-center gap-2 transition-all duration-[var(--motion-duration-normal)] ease-[var(--motion-ease-decelerate)] lg:gap-2.5">
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-all duration-[var(--motion-duration-normal)] ease-[var(--motion-ease-standard)]',
                        isCurrentPage
                          ? 'scale-110 text-blue-400 opacity-100'
                          : 'opacity-75 group-hover:scale-105 group-hover:opacity-100'
                      )}
                      aria-hidden="true"
                    />
                    <span
                      className={cn(
                        'transition-all duration-[var(--motion-duration-normal)] ease-[var(--motion-ease-decelerate)]',
                        isCurrentPage
                          ? 'font-semibold text-white'
                          : 'font-medium group-hover:font-semibold'
                      )}
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
