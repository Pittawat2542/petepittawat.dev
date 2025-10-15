import { memo, type ElementType, type FC, type ReactNode } from 'react';
import { Info, Lightbulb, AlertTriangle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalloutProps {
  readonly children: ReactNode;
  readonly type?: 'info' | 'tip' | 'warn' | 'note';
  readonly title?: string;
  readonly icon?: boolean;
}

const iconMap = {
  tip: Lightbulb,
  warn: AlertTriangle,
  note: FileText,
  info: Info,
} satisfies Record<NonNullable<CalloutProps['type']>, ElementType>;

const CalloutComponent: FC<CalloutProps> = ({ children, type = 'info', title, icon = true }) => {
  const headingId = title
    ? `callout-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    : undefined;

  const IconComponent = iconMap[type] ?? Info;

  return (
    <div className={cn('callout', type)} role="note" aria-labelledby={headingId}>
      {title ? (
        <div id={headingId} className="callout-title">
          {icon ? <IconComponent size={16} aria-hidden="true" /> : null}
          <span>{title}</span>
        </div>
      ) : null}
      {children}
    </div>
  );
};

const Callout = memo(CalloutComponent);
Callout.displayName = 'Callout';

export default Callout;
export { Callout };
