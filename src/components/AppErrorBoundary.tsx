import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export default class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("The application encountered a rendering error:", error, errorInfo.componentStack);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
          <section
            className="w-full max-w-lg rounded-xl border border-border bg-card p-8 text-center shadow-sm"
            role="alert"
            aria-labelledby="app-error-title"
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-7 w-7 text-destructive" aria-hidden="true" />
            </div>
            <h1 id="app-error-title" className="mb-2 text-2xl font-bold">
              Something went wrong
            </h1>
            <p className="mb-6 text-muted-foreground">
              BizRadar could not display this page. Reload the application to try again.
            </p>
            <Button onClick={this.handleReload}>
              <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
              Reload application
            </Button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
