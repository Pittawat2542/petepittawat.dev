import Selector from './Selector';
import GlassButton from './GlassButton';

type Props = {
  total: number;
  visible: number;
  perPage: number;
  onPerPageChange: (n: number) => void;
  onLoadMore?: () => void;
  className?: string;
  perPageOptions?: number[];
};

export default function PageControls({ total, visible, perPage, onPerPageChange, onLoadMore, className = '', perPageOptions = [6, 12, 24, 48] }: Props) {
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
}
