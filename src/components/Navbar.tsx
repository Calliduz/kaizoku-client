import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/components/Navbar.css';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
    }
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
        <form className="navbar__search" onSubmit={handleSearch} id="nav-search-form">
          <svg className="navbar__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="navbar__search-input"
            placeholder="Search anime..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            id="nav-search-input"
          />
        </form>

        {/* Nav Links */}
        <div className="navbar__links">
          <Link to="/" className="navbar__link" id="nav-home">Home</Link>
          <Link to="/catalog" className="navbar__link" id="nav-catalog">Catalog</Link>
        </div>
      </div>
    </nav>
  );
}
