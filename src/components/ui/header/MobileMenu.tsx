import type { ComponentType, FC } from 'react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import HeaderLink from '@/components/header/HeaderLink';
import { cn } from '@/lib/utils';

interface MobileMenuLink {
  readonly href: string;
  readonly label: string;
  readonly icon: ComponentType<any>;
}

interface MobileMenuProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly links: readonly MobileMenuLink[];
  // eslint-disable-next-line no-unused-vars
  readonly isActive: (href: string) => boolean;
}

const EXIT_ANIMATION_MS = 200;

const MobileMenuComponent: FC<MobileMenuProps> = ({ isOpen, onClose, links, isActive }) => {
  const [isRendering, setIsRendering] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsRendering(true);
      return;
    }
    const timeout = window.setTimeout(() => setIsRendering(false), EXIT_ANIMATION_MS);
    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  const overlayClasses = useMemo(
    () =>
      cn(
        'fixed inset-0 z-40 bg-[color:var(--black-nav,#020617)]/60 backdrop-blur-sm transition-opacity duration-300 ease-[var(--motion-ease-decelerate, ease-out)] md:hidden',
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      ),
    [isOpen]
  );

  const panelWrapperClasses = useMemo(
    () =>
      cn(
        'w-full transform-gpu transition-[opacity,transform] duration-250 ease-[var(--motion-ease-decelerate, ease-out)]',
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
      ),
    [isOpen]
  );

  const getItemStyle = useCallback(
    (index: number) => ({
      transitionDelay: `${Math.min(index * 60, 240)}ms`,
    }),
    []
  );

  if (!isRendering) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation menu"
        className={overlayClasses}
        onClick={onClose}
      />
      <dialog
        id="mobile-nav-panel"
        open={true}
        aria-modal="true"
        className="fixed inset-x-4 top-[calc(env(safe-area-inset-top)+4.5rem)] z-50 h-auto max-h-none w-auto max-w-none border-none bg-transparent p-0 md:hidden"
      >
        <div className={panelWrapperClasses}>
          <div className="shape-squircle rounded-3xl border border-white/15 bg-gradient-to-br from-black/85 via-black/80 to-black/75 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <ul className="flex flex-col gap-1">
              {links.map(({ href, label, icon: Icon }, index) => {
                const isCurrentPage = isActive(href);
                return (
                  <li
                    key={href}
                    className={cn(
                      'ease-[var(--motion-ease-decelerate, ease-out)] transform-gpu transition-[opacity,transform] duration-300',
                      isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                    )}
                    style={getItemStyle(index)}
                  >
                    <HeaderLink
                      href={href}
                      isActive={isCurrentPage}
                      ariaLabel={`Navigate to ${label}`}
                      className="group relative w-full justify-start overflow-hidden px-5 py-3.5 text-base"
                      onClick={onClose}
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        <Icon
                          className={cn(
                            'h-5 w-5 transition-all duration-[var(--motion-duration-normal)] ease-[var(--motion-ease-standard)]',
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

                      {/* Mobile menu item background effect */}
                      <div className="shape-squircle-sm absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 transition-opacity duration-[var(--motion-duration-normal)] ease-[var(--motion-ease-decelerate)] group-hover:opacity-100" />

                      {/* Active indicator for mobile */}
                      {isCurrentPage && (
                        <div className="absolute top-1/2 right-3 h-2 w-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 shadow-lg shadow-blue-500/50" />
                      )}
                    </HeaderLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </dialog>
    </>
  );
};

// Memoize the component with custom comparison
export const MobileMenu = memo(MobileMenuComponent, (prevProps, nextProps) => {
  return (
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.links === nextProps.links &&
    prevProps.onClose === nextProps.onClose &&
    prevProps.isActive === nextProps.isActive
  );
});

MobileMenu.displayName = 'MobileMenu';
export default MobileMenu;
export type { MobileMenuLink };
