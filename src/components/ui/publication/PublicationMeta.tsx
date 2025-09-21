import { Building2, CalendarDays } from 'lucide-react';

import { Badge } from '../core/badge';
import type { FC } from 'react';
import type { Publication } from '../../../types';
import Tooltip from '../core/tooltip';
import { memo } from 'react';
import { toTitleCase } from './utils';

interface PublicationMetaProps {
  readonly item: Publication;
  readonly accent: string;
}

const PublicationMetaComponent: FC<PublicationMetaProps> = ({ item, accent }) => {
  return (
    <div className="mt-2 text-xs md:text-sm text-[color:var(--white)]/60 flex items-center gap-2 flex-wrap">
      {item.type ? (
        <Badge
          className="text-xs whitespace-nowrap"
          style={{
            color: accent,
            borderColor: `color-mix(in oklab, ${accent} 55%, transparent)`,
            background: `color-mix(in oklab, ${accent} 12%, transparent)`
          }}
          title={item.type}
        >
          {toTitleCase(item.type)}
        </Badge>
      ) : null}
      
      {item.venue ? (
        <Tooltip content={item.venue}>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] md:text-xs font-medium truncate max-w-[60vw] md:max-w-[22rem]"
            style={{
              color: accent,
              background: `color-mix(in oklab, ${accent} 10%, transparent)`,
              border: `1px solid color-mix(in oklab, ${accent} 45%, transparent)`
            }}
          >
            <Building2 size={12} aria-hidden="true" className="icon-bounce" />
            <span className="truncate">{item.venue}</span>
          </span>
        </Tooltip>
      ) : null}
      
      <Tooltip content={String(item.year)}>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] md:text-xs font-medium"
          style={{
            color: accent,
            background: `color-mix(in oklab, ${accent} 10%, transparent)`,
            border: `1px solid color-mix(in oklab, ${accent} 45%, transparent)`
          }}
        >
          <CalendarDays size={12} aria-hidden="true" className="icon-bounce" />
          <span>{item.year}</span>
        </span>
      </Tooltip>
    </div>
  );
};

// Memoize the component with custom comparison
export const PublicationMeta = memo(PublicationMetaComponent, (prevProps, nextProps) => {
  return (
    prevProps.item === nextProps.item &&
    prevProps.accent === nextProps.accent
  );
});

PublicationMeta.displayName = 'PublicationMeta';
export default PublicationMeta;