import { Link } from "react-router-dom";
import "../styles/components/Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-content container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="logo-accent">KAI</span>ZOKU
          </Link>
          <p className="footer-tagline">
            Midnight Voyage into the world of cinematic anime. Stream your favorites in premium quality.
          </p>
          <div className="footer-socials">
            <a href="https://discord.gg/kaizoku" target="_blank" rel="noopener noreferrer" aria-label="Discord">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.052-.102.001-.226-.113-.271a13.062 13.062 0 0 1-1.873-.894.077.077 0 0 1-.007-.128c.126-.094.252-.192.372-.29a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .077.01c.12.098.246.196.373.29a.077.077 0 0 1-.006.128 12.933 12.933 0 0 1-1.874.894.077.077 0 0 0-0.112.272c.352.699.764 1.364 1.226 1.994.053.076.084.102.084.102a19.878 19.878 0 0 0 6.025-3.03.077.077 0 0 0 .032-.057c.465-5.188-.781-9.692-3.322-13.66a.066.066 0 0 0-.033-.03zM8.02 15.33c-1.182 0-2.156-1.085-2.156-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.086 2.156 2.419 0 1.334-.946 2.419-2.156 2.419zm7.974 0c-1.182 0-2.156-1.085-2.156-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.086 2.156 2.419 0 1.334-.946 2.419-2.156 2.419z"/></svg>
            </a>
            <a href="https://github.com/kaizoku-anime" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
          </div>
        </div>

        <div className="footer-links">
          <div className="link-column">
            <h4>PAGES</h4>
            <Link to="/">Home</Link>
            <Link to="/?sort=popularity">Trending</Link>
            <Link to="/?sort=rating">Top Rated</Link>
          </div>
          <div className="link-column">
            <h4>GENRES</h4>
            <Link to="/?genre=Action">Action</Link>
            <Link to="/?genre=Fantasy">Fantasy</Link>
            <Link to="/?genre=Sci-Fi">Sci-Fi</Link>
          </div>
          <div className="link-column">
            <h4>LEGAL</h4>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/dmca">DMCA</Link>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container bottom-inner">
          <p>© {currentYear} KAIZOKU Anime. Built for the Midnight Voyage community.</p>
          <p className="disclaimer">Kaizoku does not store any files on our server. All contents are provided by non-affiliated third-party sources.</p>
        </div>
      </div>
    </footer>
  );
}
