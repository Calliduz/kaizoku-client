import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "../styles/components/Navbar.css";

export default function Navbar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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

  // Debounce the URL update
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

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
    <nav className="navbar" id="main-navbar">
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo" id="nav-logo">
          <div className="logo-badge">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="logo-svg"
            >
              <polygon points="12 2 2 12 12 22 22 12 12 2"></polygon>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
          <span className="navbar__logo-text gradient-text">KAIZOKU</span>
        </Link>

        {/* Search */}
        <div className="navbar__search-container">
          <form
            className="navbar__search"
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
          <Link to="/" className="navbar__link" id="nav-home">
            Home
          </Link>
          <Link to="/catalog" className="navbar__link" id="nav-catalog">
            Catalog
          </Link>
        </div>
      </div>
    </nav>
  );
}
