import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onClose: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SecretTerminalErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SecretTerminal error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const err = this.state.error;
      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
          <div className="rounded-xl border border-red-500/50 bg-navy p-6 text-center max-w-md">
            <p className="text-red-400 font-mono text-sm mb-4">
              Something went wrong. Please try again.
            </p>
            {err && (
              <p className="text-slate font-mono text-xs mb-4 break-all">
                {err.message}
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false });
                this.props.onClose();
              }}
              className="px-4 py-2 rounded bg-primary/20 text-primary font-mono text-sm hover:bg-primary/30"
            >
              Close
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
