import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/components/Navbar.css';

export default function Navbar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Local state for the input to make it feel responsive
  const urlQuery = searchParams.get('search') || '';
  const [localQuery, setLocalQuery] = useState(urlQuery);
  const isInitialMount = useRef(true);

  // Sync local state if URL changes (e.g. browser back/forward or clear button)
  useEffect(() => {
    if (urlQuery !== localQuery) {
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
        newParams.set('search', localQuery);
        newParams.set('page', '1'); // Reset to page 1 on new search
      } else {
        newParams.delete('search');
        newParams.delete('page');
      }
      
      setSearchParams(newParams);

      // If we're not on the home page, go there to see results
      if (window.location.pathname !== '/') {
        navigate(`/?${newParams.toString()}`);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [localQuery]);

  const handleSearchChange = (val: string) => {
    setLocalQuery(val);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <nav className="navbar glass" id="main-navbar">
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo" id="nav-logo">
          <span className="navbar__logo-icon">⛵</span>
          <span className="navbar__logo-text gradient-text">KAIZOKU</span>
        </Link>

        {/* Search */}
        <div className="navbar__search-container">
          <form className="navbar__search" onSubmit={handleSearchSubmit} id="nav-search-form">
            <svg className="navbar__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          <Link to="/" className="navbar__link" id="nav-home">Home</Link>
          <Link to="/catalog" className="navbar__link" id="nav-catalog">Catalog</Link>
        </div>
      </div>
    </nav>
  );
}
