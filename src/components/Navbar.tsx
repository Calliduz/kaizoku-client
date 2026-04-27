import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import "../styles/components/Navbar.css";

export default function Navbar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // Detect if we should show the back button
  const showBackButton = location.pathname.startsWith("/anime/") || location.pathname.includes("/watch/");

  // Scroll listener for sticky navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Local state for the input to make it feel responsive
  const urlQuery = searchParams.get("search") || "";
  const [localQuery, setLocalQuery] = useState(urlQuery);
  const isInitialMount = useRef(true);
  const hasUserTyped = useRef(false);

  // Sync local state if URL changes (e.g. browser back/forward or clear button)
  useEffect(() => {
    if (urlQuery !== localQuery) {
      hasUserTyped.current = false;
      setLocalQuery(urlQuery);
    }
  }, [urlQuery]);

  const [isDebouncing, setIsDebouncing] = useState(false);

  // Debounce the URL update
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setIsDebouncing(true);

    const timer = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      if (localQuery.trim()) {
        newParams.set("search", localQuery);
        newParams.set("page", "1"); // Reset to page 1 on new search
      } else {
        newParams.delete("search");
        newParams.delete("page");
      }

      setSearchParams(newParams);
      setIsDebouncing(false);

      // Only navigate to home if the user explicitly typed in the search bar
      if (hasUserTyped.current && window.location.pathname !== "/") {
        navigate(`/?${newParams.toString()}`);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [localQuery]);

  const handleSearchChange = (val: string) => {
    hasUserTyped.current = true;
    setLocalQuery(val);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`} id="main-navbar">
      {/* Navbar Particles */}
      <div className="navbar__particles">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>
      <div className="navbar__inner container">
        {/* Left Side: Back Button & Logo */}
        <div className="navbar__left">
          {showBackButton && (
            <button 
              className="navbar__back-btn" 
              onClick={() => navigate(-1)}
              title="Go Back"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span>Back</span>
            </button>
          )}
          <Link to="/" className="navbar__logo" id="nav-logo">
            <img src="/kaizoku-icon.svg" alt="Kaizoku Logo" className="navbar__logo-img" />
            <span className="navbar__logo-text gradient-text">KAIZOKU</span>
          </Link>
        </div>

        {/* Search */}
        <div className="navbar__search-container">
          <form
            className={`navbar__search ${isDebouncing ? "is-loading" : ""}`}
            onSubmit={handleSearchSubmit}
            id="nav-search-form"
          >
            <svg
              className="navbar__search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="navbar__search-input"
              placeholder="Search anime..."
              value={localQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              id="nav-search-input"
              autoComplete="off"
            />
          </form>
        </div>

        {/* Nav Links */}
        <div className="navbar__links">
          <Link 
            to="/" 
            className={`navbar__link ${location.pathname === "/" && !urlQuery ? "active" : ""}`} 
            id="nav-home"
          >
            Home
          </Link>
          <Link 
            to="/catalog" 
            className={`navbar__link ${location.pathname === "/catalog" || (location.pathname === "/" && urlQuery) ? "active" : ""}`} 
            id="nav-catalog"
          >
            Catalog
          </Link>
        </div>
      </div>
    </nav>
  );
}
