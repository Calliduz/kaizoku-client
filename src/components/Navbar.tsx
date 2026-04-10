import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchSuggestions } from '../api/animeApi';
import '../styles/components/Navbar.css';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetchSuggestions(query);
        setSuggestions(res.data || []);
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectSuggestion = (anime: any) => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    navigate(`/anime/${anime._id}`);
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
        <div className="navbar__search-container" ref={searchRef}>
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
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              id="nav-search-input"
              autoComplete="off"
            />
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="navbar__suggestions glass animate-fade-in">
              {suggestions.map((item) => (
                <div 
                  key={item._id} 
                  className="suggestion-item"
                  onClick={() => handleSelectSuggestion(item)}
                >
                  <img src={item.coverImage} alt="" className="suggestion-image" />
                  <div className="suggestion-info">
                    <span className="suggestion-title">{item.title}</span>
                    <span className="suggestion-meta">{item.format?.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
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
