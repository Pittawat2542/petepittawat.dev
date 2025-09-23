import React, { type ReactNode, memo } from 'react';
import { Info, Lightbulb, AlertTriangle, FileText } from 'lucide-react';

interface CalloutProps {
  readonly children: ReactNode;
  readonly type?: 'info' | 'tip' | 'warn' | 'note';
  readonly title?: string;
  readonly icon?: boolean;
}

const CalloutComponent: React.FC<CalloutProps> = ({
  children,
  type = 'info',
  title,
  icon = true,
}) => {
  const headingId = title
    ? `callout-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    : undefined;

  // Map type to icon component
  const iconMap = {
    tip: Lightbulb,
    warn: AlertTriangle,
    note: FileText,
    info: Info,
  };

  const IconComponent = iconMap[type] || Info;

  return (
    <div className={`callout ${type}`} role="note" aria-labelledby={headingId}>
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
