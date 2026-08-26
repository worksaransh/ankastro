import React from 'react';
import { Button } from '@/components/ui/button';
import { captureException } from '@/lib/sentry';

interface Props { children: React.ReactNode; inline?: boolean; }
interface State { hasError: boolean; message?: string }

class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message || String(error) };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, info);
    captureException(error, info);
  }
  render() {
    if (this.state.hasError) {
      if (this.props.inline) {
        return null;
      }
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
          <p className="text-4xl mb-4">🔧</p>
          <h1 className="font-display text-2xl text-foreground mb-2">Kuch gadbad ho gayi. Ghabrao mat!</h1>
          <p className="text-muted-foreground mb-4 max-w-md">Something went wrong. Please refresh.</p>
          {this.state.message && (
            <pre className="text-xs text-red-400 bg-black/30 rounded-lg p-3 max-w-lg overflow-auto mb-4 text-left whitespace-pre-wrap">
              {this.state.message}
            </pre>
          )}
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
