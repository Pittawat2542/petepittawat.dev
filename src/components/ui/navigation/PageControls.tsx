import type { FC } from 'react';
import GlassButton from './GlassButton';
import Selector from '../interaction/Selector';
import { memo } from 'react';

interface PageControlsProps {
  readonly total: number;
  readonly visible: number;
  readonly perPage: number;
  readonly onPerPageChange: (n: number) => void;
  readonly onLoadMore?: () => void;
  readonly className?: string;
  readonly perPageOptions?: readonly number[];
}

const PageControlsComponent: FC<PageControlsProps> = ({ total, visible, perPage, onPerPageChange, onLoadMore, className = '', perPageOptions = [6, 12, 24, 48] }) => {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{visible}</span> of <span className="font-medium text-foreground">{total}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Per page:</span>
          <Selector
            label="Items per page"
            value={String(perPage)}
            onChange={(v) => onPerPageChange(Number(v))}
            options={perPageOptions.map((n) => ({ value: String(n), label: String(n) }))}
          />
        </div>
        {onLoadMore && visible < total && (
          <GlassButton size="sm" onClick={onLoadMore}>Load more</GlassButton>
        )}
      </div>
    </div>
  );
};

// Memoize the component with custom comparison
export const PageControls = memo(PageControlsComponent, (prevProps, nextProps) => {
  return (
    prevProps.total === nextProps.total &&
    prevProps.visible === nextProps.visible &&
    prevProps.perPage === nextProps.perPage &&
    prevProps.className === nextProps.className &&
    prevProps.perPageOptions === nextProps.perPageOptions &&
    prevProps.onPerPageChange === nextProps.onPerPageChange &&
    prevProps.onLoadMore === nextProps.onLoadMore
  );
});

PageControls.displayName = 'PageControls';
export default PageControls;
