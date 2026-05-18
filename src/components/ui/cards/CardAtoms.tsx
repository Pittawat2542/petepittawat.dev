import { memo, type CSSProperties, type FC, type ReactNode } from 'react';
import { Badge } from '@/components/ui/core/badge';
import { cn } from '@/lib/utils';

function tint(intensity: number) {
  return `color-mix(in oklab, var(--card-accent) ${intensity}%, transparent)`;
}

interface CardKickerProps {
  readonly label: string;
  readonly className?: string | undefined;
}

const CardKickerComponent: FC<CardKickerProps> = ({ label, className }) => (
  <div
    className={cn(
      'type-micro inline-flex items-center gap-2 font-semibold tracking-[0.28em] text-white/48 uppercase',
      className
    )}
  >
    <span
      className="inline-block h-2 w-2 rounded-full"
      style={{
        background: 'color-mix(in oklab, var(--card-accent) 72%, white)',
        boxShadow: `0 0 0 6px ${tint(12)}`,
      }}
    />
    {label}
  </div>
);

interface CardInfoPanelProps {
  readonly children: ReactNode;
  readonly className?: string | undefined;
  readonly style?: CSSProperties | undefined;
}

const CardInfoPanelComponent: FC<CardInfoPanelProps> = ({ children, className, style }) => (
  <div
    className={cn('rounded-[1.2rem] border px-4 py-4', className)}
    style={{
      borderColor: tint(18),
      background: `linear-gradient(180deg, ${tint(8)}, transparent)`,
      ...style,
    }}
  >
    {children}
  </div>
);

interface CardDividerProps {
  readonly className?: string | undefined;
}

const CardDividerComponent: FC<CardDividerProps> = ({ className }) => (
  <div
    className={cn('h-px w-full', className)}
    style={{
      background: `linear-gradient(90deg, ${tint(32)}, transparent 85%)`,
    }}
  />
);

interface CardTagListProps {
  readonly tags?: readonly string[] | undefined;
  readonly tone?: 'accent' | 'muted' | undefined;
}

const CardTagListComponent: FC<CardTagListProps> = ({ tags, tone = 'accent' }) => {
  if (!tags?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <Badge
          key={tag}
          className={cn(
            'type-caption rounded-full border px-3 py-1 font-medium md:text-xs',
            tone === 'muted' && 'text-white/70'
          )}
          variant="outline"
          style={
            tone === 'muted'
              ? {
                  borderColor: tint(20),
                  background: tint(6),
                }
              : {
                  borderColor: 'color-mix(in oklab, var(--card-accent) 20%, transparent)',
                  color: 'color-mix(in oklab, var(--card-accent) 74%, white)',
                  background: 'color-mix(in oklab, var(--card-accent) 8%, rgba(15,23,42,0.3))',
                }
          }
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
};

export const CardKicker = memo(CardKickerComponent);
export const CardInfoPanel = memo(CardInfoPanelComponent);
export const CardDivider = memo(CardDividerComponent);
export const CardTagList = memo(CardTagListComponent);

CardKicker.displayName = 'CardKicker';
CardInfoPanel.displayName = 'CardInfoPanel';
CardDivider.displayName = 'CardDivider';
CardTagList.displayName = 'CardTagList';
