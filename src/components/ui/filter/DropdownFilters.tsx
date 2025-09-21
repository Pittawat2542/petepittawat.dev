import { Award, Building2, Calendar, Code2, Database, FileText, Globe, Presentation, Tags, User, Video } from 'lucide-react';

import type { FC } from 'react';
import GlassButton from '@/components/ui/navigation/GlassButton';
import Selector from '@/components/ui/interaction/Selector';
import { memo } from 'react';

interface DropdownFiltersProps {
  readonly filterOptions: Record<string, readonly string[]>;
  readonly filters: Record<string, string>;
  readonly onFiltersChange?: (updater: (prev: Record<string, string>) => Record<string, string>) => void;
  readonly hasActiveFilters: boolean;
  readonly onClearAll: () => void;
}

const DropdownFiltersComponent: FC<DropdownFiltersProps> = ({ 
  filterOptions, 
  filters, 
  onFiltersChange, 
  hasActiveFilters, 
  onClearAll 
}) => {
  if (!Object.keys(filterOptions).length) {
    return null;
  }

  const toTitle = (s: string) => s.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  
  const iconFor = (k: string, v: string) => {
    switch (k) {
      case 'year':
        return <Calendar size={14} />;
      case 'venue':
        return <Building2 size={14} />;
      case 'tag':
        return <Tags size={14} />;
      case 'authorship':
        return v === 'first-author' ? <Award size={14} /> : <User size={14} />;
      case 'resource':
        if (/code/.test(v)) return <Code2 size={14} />;
        if (/data/.test(v)) return <Database size={14} />;
        if (/video/.test(v)) return <Video size={14} />;
        if (/slides?/.test(v)) return <Presentation size={14} />;
        if (/paper|preprint|journal/.test(v)) return <FileText size={14} />;
        return <Globe size={14} />;
      case 'type':
        return <FileText size={14} />;
      case 'mode':
        return <Globe size={14} />;
      case 'audience':
        return <User size={14} />;
      case 'role':
        return <User size={14} />;
      case 'link':
        if (/github|code/.test(v)) return <Code2 size={14} />;
        if (/paper|journal|preprint/.test(v)) return <FileText size={14} />;
        return <Globe size={14} />;
      default:
        return undefined;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">Filters</h3>
        {hasActiveFilters && (
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-xs"
          >
            Clear all
          </GlassButton>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {Object.entries(filterOptions).map(([key, options]) => {
          const selectedValue = filters[key] || 'all';
          const optObjects = [
            { value: 'all', label: `All ${toTitle(key)}s`, icon: iconFor(key, 'all') },
            ...options.map((o) => ({ value: o, label: toTitle(String(o)), icon: iconFor(key, String(o)) })),
          ];
          
          return (
            <div key={key} className="min-w-[180px]">
              <label className="sr-only">Filter by {key}</label>
              <Selector
                label={`Filter by ${toTitle(key)}`}
                value={selectedValue}
                options={optObjects}
                onChange={(val) => onFiltersChange?.((f) => ({ ...f, [key]: val }))}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const DropdownFilters = memo(DropdownFiltersComponent);
DropdownFilters.displayName = 'DropdownFilters';
export default DropdownFilters;