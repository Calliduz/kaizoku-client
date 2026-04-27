import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";

export default function NotFoundPage() {
  const navigate = useNavigate();

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
      <SEO title="404 - Not Found | Kaizoku" />
      
      {/* Background Ambient Glow */}
      <div style={{
        position: "absolute",
        width: "300px",
        height: "300px",
        background: "var(--color-accent)",
        filter: "blur(150px)",
        opacity: 0.1,
        borderRadius: "50%",
        zIndex: -1,
        top: "40%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      }} />

      <div style={{ animation: "float 6s ease-in-out infinite" }}>
        <img 
          src="/kaizoku-404.svg" 
          alt="404" 
          style={{ width: "280px", height: "auto", marginBottom: "30px", filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.5))" }} 
        />
      </div>

      <h1 style={{ 
        fontSize: "6rem", 
        fontWeight: 950, 
        marginBottom: "0.5rem", 
        lineHeight: 1,
        color: "var(--color-accent)",
        textShadow: "0 0 20px rgba(0, 163, 255, 0.3)",
        letterSpacing: "-4px"
      }}>
        404
      </h1>

      <h2 style={{ 
        fontSize: "1.75rem", 
        fontWeight: 800,
        marginBottom: "1.5rem", 
        color: "#fff",
        opacity: 0.9 
      }}>
        You've reached a deserted island.
      </h2>

      <p style={{ 
        maxWidth: "550px", 
        margin: "0 auto 3.5rem", 
        opacity: 0.6, 
        fontSize: "1.1rem",
        lineHeight: 1.6,
        fontWeight: 500
      }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <button 
          className="btn-watch-hero"
          onClick={() => navigate("/")}
          style={{ padding: "14px 40px" }}
        >
          Return Home
        </button>
        <button 
          className="btn-info-hero"
          onClick={() => navigate(-1)}
          style={{ padding: "14px 40px" }}
        >
          Go Back
        </button>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}
