import { ArrowDownAZ, ArrowUpAZ, Calendar, Clock } from 'lucide-react';
import type { FC, ReactNode } from 'react';

import Selector from '@/components/ui/interaction/Selector';
import { memo } from 'react';

interface SortControlProps {
  readonly sortOptions: Array<{ readonly value: string; readonly label: string }>;
  readonly sortValue: string | undefined;
  readonly onSortChange: (value: string) => void;
}

const SortControlComponent: FC<SortControlProps> = ({ sortOptions, sortValue, onSortChange }) => {
  if (!sortOptions || sortOptions.length === 0) return null;

  const iconMap: Record<string, ReactNode> = {
    'year-desc': <Calendar size={14} />,
    'year-asc': <Calendar size={14} />,
    'title-asc': <ArrowDownAZ size={14} />,
    'title-desc': <ArrowUpAZ size={14} />,
    'date-desc': <Clock size={14} />,
    'date-asc': <Clock size={14} />,
  };

  const optionsWithIcons = sortOptions.map(option => ({
    ...option,
    icon: iconMap[option.value],
  }));

  return (
    <div className="flex w-full items-center gap-2 sm:w-auto">
      <span className="text-muted-foreground text-sm whitespace-nowrap">Sort:</span>
      <Selector
        value={sortValue || ''}
        onChange={onSortChange}
        className="w-full sm:w-auto"
        options={optionsWithIcons}
      />
    </div>
  );
};

export const SortControl = memo(SortControlComponent);
SortControl.displayName = 'SortControl';
export default SortControl;
