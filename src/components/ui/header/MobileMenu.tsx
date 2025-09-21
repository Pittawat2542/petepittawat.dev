import { AnimatePresence, motion } from 'framer-motion';
import type { ComponentType, FC } from 'react';

import HeaderLink from '../../header/HeaderLink';
import { memo } from 'react';

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

const MobileMenuComponent: FC<MobileMenuProps> = ({ isOpen, onClose, links, isActive }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close navigation menu"
            className="md:hidden fixed inset-0 z-40 bg-[color:var(--black-nav,#020617)]/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <dialog
            id="mobile-nav-panel"
            open={true}
            aria-modal="true"
            className="md:hidden fixed inset-x-4 top-[calc(env(safe-area-inset-top)+4.5rem)] z-50 bg-transparent border-none p-0 max-w-none max-h-none w-auto h-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full"
            >
              <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-black/85 via-black/80 to-black/75 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl">
                <ul className="flex flex-col gap-1">
                  {links.map(({ href, label, icon: Icon }, index) => {
                    const isCurrentPage = isActive(href);
                    return (
                      <motion.li 
                        key={href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                      >
                        <HeaderLink
                          href={href}
                          isActive={isCurrentPage}
                          ariaLabel={`Navigate to ${label}`}
                          className="w-full justify-start px-5 py-3.5 text-base group relative overflow-hidden"
                          onClick={onClose}
                        >
                          <span className="relative flex items-center gap-3 z-10">
                            <Icon 
                              className={`h-5 w-5 transition-all duration-300 ${
                                isCurrentPage 
                                  ? 'opacity-100 text-blue-400 scale-110' 
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
                          
                          {/* Mobile menu item background effect */}
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Active indicator for mobile */}
                          {isCurrentPage && (
                            <div className="absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 shadow-lg shadow-blue-500/50" />
                          )}
                        </HeaderLink>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          </dialog>
        </>
      )}
    </AnimatePresence>
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