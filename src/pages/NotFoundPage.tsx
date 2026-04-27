import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ 
      minHeight: "70vh", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      textAlign: "center"
    }}>
      <SEO title="404 - Not Found | Kaizoku" />
      
      <img 
        src="/kaizoku-404.svg" 
        alt="404" 
        style={{ width: "200px", height: "auto", marginBottom: "20px" }} 
      />
      <h1 style={{ fontSize: "4rem", fontWeight: 900, marginBottom: "1rem", letterSpacing: "-2px" }}>
        404
      </h1>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "2rem", opacity: 0.8 }}>
        You've reached a deserted island.
      </h2>
      <p style={{ maxWidth: "500px", margin: "0 auto 3rem", opacity: 0.6, lineHeight: 1.6 }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <div style={{ display: "flex", gap: "1rem" }}>
        <button 
          className="btn btn--primary"
          onClick={() => navigate("/")}
        >
          Return Home
        </button>
        <button 
          className="btn btn--outline"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
