import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary component to catch UI crashes and display a fallback UI.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="container" style={{ 
          margin: "100px auto", 
          textAlign: "center",
          padding: "40px",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}>
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚢 Oh No!</h1>
          <p style={{ fontSize: "1.2rem", opacity: 0.7, marginBottom: "2rem" }}>
            The ship hit an iceberg. Something went wrong while loading this page.
          </p>
          <button 
            className="btn btn--primary"
            onClick={() => window.location.assign("/")}
          >
            Back to Safe Waters
          </button>
          
          {import.meta.env.MODE === "development" && (
            <div style={{ marginTop: "2rem", textAlign: "left", opacity: 0.5, fontSize: "0.8rem", overflow: "auto", maxHeight: "200px" }}>
              <code>{this.state.error?.toString()}</code>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
