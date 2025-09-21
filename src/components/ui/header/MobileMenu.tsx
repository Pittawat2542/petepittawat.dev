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
              <div className="rounded-3xl border border-white/12 bg-black/80 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
                <ul className="flex flex-col gap-2">
                  {links.map(({ href, label, icon: Icon }) => (
                    <li key={href}>
                      <HeaderLink
                        href={href}
                        isActive={isActive(href)}
                        ariaLabel={label}
                        className="w-full justify-start px-5 py-3 text-base"
                        onClick={onClose}
                      >
                        <Icon className="h-5 w-5 opacity-80" aria-hidden="true" />
                        <span>{label}</span>
                      </HeaderLink>
                    </li>
                  ))}
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