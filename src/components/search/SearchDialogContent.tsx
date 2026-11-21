import { DialogContent, DialogDescription, DialogTitle } from '@/components/ui/core/dialog';
import { memo, type FC, type ReactNode } from 'react';

interface SearchDialogContentProps {
  readonly children: ReactNode;
  readonly onClose?: () => void;
}

const SearchDialogContentComponent: FC<SearchDialogContentProps> = ({ children, onClose }) => (
  <DialogContent
    onCloseAutoFocus={event => {
      event.preventDefault();
      onClose?.();
    }}
    className="search-dialog no-paint-contain border-none bg-transparent p-0 shadow-none"
  >
    <DialogTitle className="sr-only">Site Search</DialogTitle>
    <DialogDescription className="sr-only">
      Type to search posts, projects, publications, talks, and pages. Use arrow keys to navigate
      results.
    </DialogDescription>
    <div className="search-modal">{children}</div>
  </DialogContent>
);

export const SearchDialogContent = memo(SearchDialogContentComponent);
SearchDialogContent.displayName = 'SearchDialogContent';
export default SearchDialogContent;
