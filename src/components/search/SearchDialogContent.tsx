import { DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/core/dialog';
import type { FC, ReactNode } from 'react';

import { memo } from 'react';
import { motion } from 'framer-motion';

/**
 * Props for the SearchDialogContent component
 */
interface SearchDialogContentProps {
  /** The content to be rendered inside the search dialog */
  readonly children: ReactNode;
}

/**
 * A dialog content wrapper for the search modal with smooth animations.
 * 
 * This component provides:
 * - Smooth entry/exit animations using Framer Motion
 * - Proper dialog accessibility with ARIA labels
 * - Responsive sizing and positioning
 * - Glass morphism styling for the close button
 * - Screen reader support with hidden titles and descriptions
 * 
 * @param props - The component props
 * @returns A dialog content wrapper with animation support
 */
const SearchDialogContentComponent: FC<SearchDialogContentProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      <DialogContent
        className="no-paint-contain max-w-none w-[min(72rem,92vw)] p-0 overflow-visible top-[12vh] -translate-y-0 sm:top-1/2 sm:-translate-y-1/2"
        style={{ overflowY: 'visible' }}
      >
        <DialogTitle className="sr-only">Site Search</DialogTitle>
        <DialogDescription className="sr-only">
          Type to search posts, projects, publications, talks, and pages. Use arrow keys to navigate results.
        </DialogDescription>
        <DialogClose
          className="absolute -top-4 -right-4 z-10 inline-flex items-center justify-center rounded-full p-2.5 border border-white/15 bg-black/40 backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-white/10 shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          aria-label="Close search"
          title="Close (Esc)"
        >
          <span className="sr-only">Close</span>
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </DialogClose>
        {children}
      </DialogContent>
    </motion.div>
  );
};

/**
 * Memoized search dialog content component.
 * 
 * The component is memoized since it typically doesn't need to re-render
 * unless its children change, improving performance for the search modal.
 */
export const SearchDialogContent = memo(SearchDialogContentComponent);
SearchDialogContent.displayName = 'SearchDialogContent';
export default SearchDialogContent;