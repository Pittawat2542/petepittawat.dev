/**
 * Error logging utility for consistent error handling across the application
 */

// Add process type declaration
declare const process: {
  env: {
    NODE_ENV?: string;
  };
};

declare namespace React {
  interface ErrorInfo {
    componentStack: string;
  }
}

// Define error severity levels
export type ErrorLevel = 'info' | 'warn' | 'error' | 'fatal';

// Define error context interface
export interface ErrorContext {
  /** Component or module where the error occurred */
  readonly component?: string;
  /** Additional context data */
  readonly context?: Record<string, unknown>;
  /** User ID or session identifier */
  readonly userId?: string;
  /** URL where the error occurred */
  readonly url?: string;
}

// Define error log entry interface
export interface ErrorLogEntry {
  /** Error message */
  readonly message: string;
  /** Error object (if available) */
  readonly error?: Error | null;
  /** Error severity level */
  readonly level: ErrorLevel;
  /** Error context */
  readonly context?: ErrorContext | null;
  /** Timestamp when the error occurred */
  readonly timestamp: number;
  /** Stack trace (if available) */
  readonly stack?: string;
}

/**
 * Log an error with context and severity level
 *
 * @param message - Error message
 * @param level - Error severity level
 * @param error - Error object (optional)
 * @param context - Additional context (optional)
 */
export function logError(
  message: string,
  level: ErrorLevel = 'error',
  error?: Error,
  context?: ErrorContext
): void {
  // In development, log to console
  if (process.env['NODE_ENV'] === 'development') {
    const logMethod =
      level === 'info' ? console.info : level === 'warn' ? console.warn : console.error;
    logMethod(`[${level.toUpperCase()}] ${message}`, {
      error: error?.message,
      context,
      stack: error?.stack,
    });
  }

  // In production, you might send to an error tracking service
  // Example: Sentry, LogRocket, or custom API endpoint
  if (process.env['NODE_ENV'] === 'production') {
    // Example implementation:
    // sendToErrorService(logEntry);
  }
}

/**
 * Log an informational message
 *
 * @param message - Informational message
 * @param context - Additional context (optional)
 */
export function logInfo(message: string, context?: ErrorContext): void {
  logError(message, 'info', undefined, context);
}

/**
 * Log a warning message
 *
 * @param message - Warning message
 * @param error - Error object (optional)
 * @param context - Additional context (optional)
 */
export function logWarning(message: string, error?: Error, context?: ErrorContext): void {
  logError(message, 'warn', error, context);
}

/**
 * Log a fatal error and potentially stop execution
 *
 * @param message - Fatal error message
 * @param error - Error object (optional)
 * @param context - Additional context (optional)
 */
export function logFatal(message: string, error?: Error, context?: ErrorContext): void {
  logError(message, 'fatal', error, context);

  // In critical situations, you might want to stop execution
  // or show a critical error UI
  if (process.env['NODE_ENV'] === 'development') {
    console.error('FATAL ERROR:', message, error, context);
  }
}

/**
 * Enhanced error boundary error handler
 *
 * @param error - Error object
 * @param errorInfo - Error information from React
 * @param component - Component name where error occurred
 */
export function handleBoundaryError(
  error: Error,
  errorInfo: React.ErrorInfo,
  component: string
): void {
  logError(`React error boundary caught an error in ${component}`, 'error', error, {
    component,
    context: {
      componentStack: errorInfo.componentStack,
    },
  });
}

/**
 * Create a wrapped error with additional context
 *
 * @param message - Error message
 * @param context - Error context
 * @returns Enhanced error object
 */
export function createErrorWithContext(message: string, context: ErrorContext): Error {
  const error = new Error(message);

  // Add context as a non-enumerable property to avoid serialization issues
  Object.defineProperty(error, '__context', {
    value: context,
    writable: false,
    enumerable: false,
    configurable: false,
  });

  return error;
}

export default {
  logError,
  logInfo,
  logWarning,
  logFatal,
  handleBoundaryError,
  createErrorWithContext,
};
