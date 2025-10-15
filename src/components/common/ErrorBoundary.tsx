import { Component, type ComponentType, type ErrorInfo, type ReactNode } from 'react';
import { ERROR_MESSAGES } from '@/lib/constants';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * Enhanced Error Boundary with better error reporting and recovery options
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private readonly resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    this.props.onError?.(error, errorInfo);

    if (process.env['NODE_ENV'] === 'development') {
      console.error('Error Boundary:', error, errorInfo);
    }
  }

  private readonly resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  override render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="flex min-h-[200px] items-center justify-center p-6">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23dc2626' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z'/%3E%3Cpath d='M12 9v4'/%3E%3Cpath d='m12 17 .01 0'/%3E%3C/svg%3E"
                alt="Warning"
                className="h-8 w-8 text-red-600"
              />
            </div>
            <h2 className="mb-2 text-xl font-semibold">Something went wrong</h2>
            <p className="mb-6 text-gray-600">{error?.message || ERROR_MESSAGES.GENERIC}</p>
            <button
              onClick={this.resetErrorBoundary}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return children;
  }

  override componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }
}

export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

export default ErrorBoundary;
