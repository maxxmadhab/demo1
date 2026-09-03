import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : "An unexpected error occurred.",
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-ivory px-5">
          <div className="w-full max-w-md text-center">
            <div className="mb-6 font-display text-4xl font-medium text-charcoal">Budhram</div>
            <h1 className="mb-3 font-body text-sm font-medium uppercase tracking-[0.18em] text-gold-deep">
              Something went wrong
            </h1>
            <p className="mb-2 font-body text-sm text-stone">
              The page encountered an error and could not be displayed.
            </p>
            <p className="mb-8 break-words font-body text-xs text-mist">{this.state.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-block bg-charcoal px-8 py-3.5 font-body text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ivory transition-colors duration-300 hover:bg-charcoal-light"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
