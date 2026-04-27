
interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorDisplay({ message = 'An unexpected error occurred.', onRetry }: ErrorDisplayProps) {
  return (
    <div className="error-display container animate-fade-in" style={{
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      position: "relative"
    }}>
      {/* Background Ambient Glow */}
      <div style={{
        position: "absolute",
        width: "250px",
        height: "250px",
        background: "var(--color-danger)",
        filter: "blur(100px)",
        opacity: 0.1,
        borderRadius: "50%",
        zIndex: -1
      }} />

      <span style={{ fontSize: '4.5rem', marginBottom: '1.5rem', filter: "drop-shadow(0 10px 15px rgba(239, 68, 68, 0.2))" }}>⛓️</span>
      
      <h3 style={{ 
        fontSize: '2.5rem', 
        fontWeight: 900, 
        color: "#fff", 
        marginBottom: "1rem",
        letterSpacing: "-1px" 
      }}>
        Anchor Lost
      </h3>

      <p style={{ 
        color: 'var(--color-text-secondary)', 
        maxWidth: '450px',
        fontSize: "1.1rem",
        lineHeight: 1.6,
        marginBottom: "2.5rem"
      }}>
        {message}
      </p>

      {onRetry && (
        <button 
          className="btn-watch-hero" 
          onClick={onRetry}
          style={{ padding: "12px 36px" }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
