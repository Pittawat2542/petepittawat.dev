import '@/styles/components/search-modal.css';

import { DialogContent, DialogDescription, DialogTitle } from '@/components/ui/core/dialog';
import { cn } from '@/lib/utils';
import { memo, useEffect, useState, type FC, type ReactNode } from 'react';

/**
 * Props for the SearchDialogContent component
 */
interface SearchDialogContentProps {
  /** The content to be rendered inside the search dialog */
  readonly children: ReactNode;
}

/**
 * A dialog content wrapper for the search modal with smooth transitions.
 *
 * This component provides:
 * - Smooth entry/exit transitions handled with CSS
 * - Proper dialog accessibility with ARIA labels
 * - Responsive sizing and positioning
 * - Glass morphism styling for the close button
 * - Screen reader support with hidden titles and descriptions
 *
 * @param props - The component props
 * @returns A dialog content wrapper with transition support
 */
const SearchDialogContentComponent: FC<SearchDialogContentProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className={cn(
        'ease-[var(--motion-ease-decelerate, ease-out)] transform-gpu transition-[opacity,transform] duration-300',
        mounted ? 'scale-100 opacity-100' : 'scale-[0.98] opacity-0'
      )}
    >
      <DialogContent
        className="no-paint-contain top-0 left-0 max-h-[calc(100vh-48px)] w-full max-w-none translate-x-0 translate-y-0 overflow-auto border-none bg-transparent p-0 shadow-none sm:top-1/2 sm:left-1/2 sm:w-[min(72rem,92vw)] sm:-translate-x-1/2 sm:-translate-y-1/2"
        style={{ overflowY: 'auto' }}
      >
        <DialogTitle className="sr-only">Site Search</DialogTitle>
        <DialogDescription className="sr-only">
          Type to search posts, projects, publications, talks, and pages. Use arrow keys to navigate
          results.
        </DialogDescription>
        <div className="search-modal shape-squircle relative overflow-hidden">
          {/* Subtle blue radial glows matching new theming */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 opacity-30"
            style={{
              background:
                'radial-gradient(circle at 50% 0%, var(--accent, #60a5fa) 0%, transparent 70%)',
              filter: 'blur(32px)',
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 opacity-10"
            style={{
              background:
                'radial-gradient(circle at 50% 100%, var(--accent, #60a5fa) 0%, transparent 70%)',
              filter: 'blur(24px)',
            }}
            aria-hidden="true"
          />
          {children}
        </div>
      </DialogContent>
    </div>
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
