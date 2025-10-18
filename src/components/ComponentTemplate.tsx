import type { FC } from 'react';
import { cn } from '@/lib/utils';
import { memo } from 'react';

/**
 * Component props interface
 */
interface ComponentTemplateProps {
  /** Additional CSS classes to apply */
  readonly className?: string | undefined;
  // Add other props here
}

/**
 * Component description
 *
 * Features:
 * - Feature 1
 * - Feature 2
 *
 * @param props - The component props
 * @returns A memoized component
 */
const ComponentTemplateComponent: FC<ComponentTemplateProps> = ({
  className,
  // destructure other props here
}) => {
  return <div className={cn('base-classes', className)}>{/* Component content */}</div>;
};

/**
 * Memoized component for optimal performance.
 *
 * The component is memoized to prevent unnecessary re-renders.
 */
export const ComponentTemplate = memo(ComponentTemplateComponent);
ComponentTemplate.displayName = 'ComponentTemplate';

/**
 * Default export for backward compatibility.
 *
 * @deprecated Consider using the named export `ComponentTemplate` instead
 */
export default ComponentTemplate;
