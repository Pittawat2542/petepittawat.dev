import { logError, logInfo, logWarning } from '@/lib/errorLogger';
import { memo, useEffect } from 'react';

import type { FC } from 'react';

/**
 * Example component demonstrating error logging usage
 */
const ErrorLoggingExampleComponent: FC = () => {
  useEffect(() => {
    // Log an informational message
    logInfo('ErrorLoggingExample component mounted', {
      component: 'ErrorLoggingExample',
      context: {
        timestamp: new Date().toISOString(),
      },
    });

    // Simulate a potential error scenario
    try {
      // Some operation that might fail
      const result = performRiskyOperation();
      logInfo('Risky operation completed successfully', {
        component: 'ErrorLoggingExample',
        context: {
          result,
        },
      });
    } catch (error) {
      // Log the error with context
      logError(
        'Failed to perform risky operation',
        'error',
        error instanceof Error ? error : new Error(String(error)),
        {
          component: 'ErrorLoggingExample',
          context: {
            operation: 'performRiskyOperation',
          },
        }
      );
    }
  }, []);

  /**
   * Simulate a function that might throw an error
   */
  const performRiskyOperation = (): string => {
    // Simulate random failure
    if (Math.random() > 0.7) {
      logWarning('Risky operation encountered a warning', undefined, {
        component: 'ErrorLoggingExample',
        context: {
          operation: 'performRiskyOperation',
          warningType: 'randomFailure',
        },
      });
      throw new Error('Random failure occurred during risky operation');
    }

    return 'Operation successful';
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Error Logging Example</h2>
      <p className="text-gray-600">
        This component demonstrates how to use the error logging utility. Check the console for
        logged messages.
      </p>
    </div>
  );
};

const ErrorLoggingExample = memo(ErrorLoggingExampleComponent);
ErrorLoggingExample.displayName = 'ErrorLoggingExample';

export default ErrorLoggingExample;
export { ErrorLoggingExample };
