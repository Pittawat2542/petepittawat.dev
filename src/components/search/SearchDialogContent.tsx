import '@/styles/components/search.css';

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/core/dialog';
import { BlogCardOverlays } from '@/components/ui/blog/BlogCardOverlays';
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
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={cn(
        'ease-[var(--motion-ease-decelerate, ease-out)] transform-gpu transition-[opacity,transform] duration-300',
        mounted ? 'scale-100 opacity-100' : 'scale-[0.98] opacity-0'
      )}
    >
      <DialogContent
        className="no-paint-contain top-[12vh] w-[min(72rem,92vw)] max-w-none -translate-y-0 overflow-visible border-none bg-transparent p-0 shadow-none sm:top-1/2 sm:-translate-y-1/2"
        style={{ overflowY: 'visible' }}
      >
        <DialogTitle className="sr-only">Site Search</DialogTitle>
        <DialogDescription className="sr-only">
          Type to search posts, projects, publications, talks, and pages. Use arrow keys to navigate
          results.
        </DialogDescription>
        <div className="search-modal shape-squircle">
          <BlogCardOverlays accent="var(--accent)" intensity="subtle" />
          <header className="search-modal__header">
            <div className="search-modal__headline">
              <span className="search-modal__eyebrow">Search</span>
              <p>Type to explore posts, projects, publications, talks, and pages.</p>
            </div>
            <DialogClose
              className="search-modal__close"
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
          </header>
          <div className="search-modal__body">{children}</div>
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
