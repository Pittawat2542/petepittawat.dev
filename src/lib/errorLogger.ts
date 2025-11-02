/**
 * Simple error logging utility
 */
import type React from 'react';

declare const process: {
  env: {
    NODE_ENV?: string;
  };
};

type ErrorLevel = 'info' | 'warn' | 'error';

interface ErrorContext {
  component?: string;
  context?: Record<string, unknown>;
}

/**
 * Log an error with context
 */
export function logError(
  message: string,
  level: ErrorLevel = 'error',
  error?: Error,
  context?: ErrorContext
): void {
  if (process.env['NODE_ENV'] === 'development') {
    const logMethod =
      level === 'info' ? console.info : level === 'warn' ? console.warn : console.error;
    logMethod(`[${level.toUpperCase()}] ${message}`, {
      error: error?.message,
      context,
      stack: error?.stack,
    });
  }
}

/**
 * Error boundary error handler
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
