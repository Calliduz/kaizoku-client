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
          minHeight: "85vh", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center",
          textAlign: "center",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Background Ambient Glow */}
          <div style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            background: "var(--color-danger)",
            filter: "blur(150px)",
            opacity: 0.1,
            borderRadius: "50%",
            zIndex: -1,
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)"
          }} />

          <div style={{ fontSize: "5rem", marginBottom: "20px", filter: "drop-shadow(0 10px 20px rgba(239, 68, 68, 0.3))" }}>
            ⚓
          </div>

          <h1 style={{ 
            fontSize: "3.5rem", 
            fontWeight: 900, 
            marginBottom: "1rem", 
            color: "#fff",
            letterSpacing: "-2px"
          }}>
            System Breach
          </h1>

          <p style={{ 
            maxWidth: "500px", 
            margin: "0 auto 2.5rem", 
            opacity: 0.7, 
            fontSize: "1.2rem",
            lineHeight: 1.6,
          }}>
            An unexpected error has disrupted your voyage. We've logged the incident and are working to restore order.
          </p>

          <div style={{ display: "flex", gap: "1.5rem" }}>
            <button 
              className="btn-watch-hero"
              onClick={() => window.location.assign("/")}
              style={{ padding: "14px 40px" }}
            >
              Return Home
            </button>
            <button 
              className="btn-info-hero"
              onClick={() => window.location.reload()}
              style={{ padding: "14px 40px" }}
            >
              Retry Page
            </button>
          </div>
          
          {import.meta.env.MODE === "development" && (
            <div style={{ 
              marginTop: "4rem", 
              textAlign: "left", 
              background: "rgba(0,0,0,0.3)",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              maxWidth: "800px",
              width: "100%"
            }}>
              <h4 style={{ color: "var(--color-danger)", marginBottom: "10px", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Debug Info</h4>
              <code style={{ fontSize: "0.8rem", opacity: 0.6, display: "block", overflowX: "auto", whiteSpace: "pre-wrap" }}>
                {this.state.error?.stack || this.state.error?.toString()}
              </code>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
