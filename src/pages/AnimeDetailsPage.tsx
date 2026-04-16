import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAnimeById, fetchEpisodes } from "../api/animeApi";
import EpisodeList from "../components/EpisodeList";
import CharacterList from "../components/CharacterList";
import RecommendationList from "../components/RecommendationList";
import AnimeDetailsSkeleton from "../components/AnimeDetailsSkeleton";
import ErrorDisplay from "../components/ErrorDisplay";
import AnimeLogoImage from "../components/AnimeLogoImage";
import type { Anime, Episode } from "../types";
import "../styles/pages/AnimeDetailsPage.css";

export default function AnimeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [detailTrailerMuted, setDetailTrailerMuted] = useState(true);
  const [detailTrailerReady, setDetailTrailerReady] = useState(false);
  const [showStickyWatch, setShowStickyWatch] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [anime, setAnime] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        setDetailTrailerReady(false);
        if (!id) throw new Error("No anime ID provided");
        const [animeRes, itemsRes] = await Promise.all([
          fetchAnimeById(id),
          fetchEpisodes(id),
        ]);

        setAnime(animeRes.data);
        setEpisodes(itemsRes.data || []);
        
        // Scroll to top on load
        window.scrollTo(0, 0);

        // Delay revealing trailer
        if (animeRes.data?.trailer?.id) {
          setTimeout(() => setDetailTrailerReady(true), 2000);
        }
      } catch (err: any) {
        setError(err.response?.data?.error?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    const handleScroll = () => {
      // Show sticky button after scrolling past the hero actions (approx 500px)
      if (window.scrollY > 500) {
        setShowStickyWatch(true);
      } else {
        setShowStickyWatch(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [id]);

  if (loading) {
    return <AnimeDetailsSkeleton />;
  }
  
  if (error) {
    return <ErrorDisplay message={error} onRetry={() => window.location.reload()} />;
  }
  
  if (!anime) return <div className="container">Anime not found</div>;

  const bgImage = anime.fanartBackground || anime.bannerImage || anime.coverImage;
  const hasTrailer = !!anime.trailer?.id;

  return (
    <div className="anime-details-page animate-fade-in">
      {/* Cinematic Hero Section */}
      <div className="details-hero">
        {/* Poster cover — always shown, fades when trailer is ready */}
        <img src={bgImage} alt="Banner" className={`details-hero__img ${hasTrailer && detailTrailerReady ? "details-hero__img--hidden" : ""}`} />
        
        {/* Trailer background */}
        {hasTrailer && (
          <div className="details-hero__trailer">
            <iframe
              src={`https://www.youtube.com/embed/${anime.trailer!.id}?autoplay=1&mute=${detailTrailerMuted ? 1 : 0}&controls=0&loop=1&playlist=${anime.trailer!.id}&rel=0&iv_load_policy=3&showinfo=0&disablekb=1&modestbranding=1`}
              allow="autoplay; encrypted-media"
              title="Anime Trailer Background"
              className="details-hero__trailer-iframe"
            />
          </div>
        )}

        <div className="details-hero__gradient" />
        
        <button className="back-btn details-back-btn" onClick={() => navigate(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back
        </button>

        {hasTrailer && (
          <button
            className="hero-mute-toggle"
            onClick={() => setDetailTrailerMuted(!detailTrailerMuted)}
            title={detailTrailerMuted ? "Unmute Trailer" : "Mute Trailer"}
          >
            {detailTrailerMuted ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            )}
          </button>
        )}
      </div>

      <div className="details-content-container">
        <div className="details-top-grid">
          {/* Left: Poster */}
          <div className="details-poster">
            <img src={anime.coverImage} alt={anime.title} />
          </div>

          {/* Right: Primary Info */}
          <div className="details-info">
            <AnimeLogoImage animeId={anime._id} initialLogo={anime.logo} title={anime.title} className="details-logo" />

            <div className="details-metadata">
              {anime.rating > 0 && (
                <span className="meta-chip score">★ {(anime.rating / 10).toFixed(1)}</span>
              )}
              <span className="meta-chip match-percent">{(90 + Math.floor(Math.random() * 9))}% Match</span>
              <span className="meta-chip">{anime.format?.replace(/_/g, " ")}</span>
              <span className="meta-chip episodes">{episodes.length} Episodes</span>
              <span className="meta-chip status-tag">{anime.status}</span>
              <span className="meta-chip season-tag">{anime.season} {anime.seasonYear}</span>
            </div>

            <div className="details-actions">
              <button
                className="btn-watch-now"
                onClick={() => {
                  if (episodes.length > 0) {
                    const firstEp = [...episodes].sort((a, b) => a.number - b.number)[0];
                    navigate(`/anime/${anime._id}/watch/${firstEp._id}`);
                  }
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                Watch Now
              </button>
              <button className="btn-add-list">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add to List
              </button>
            </div>

            <p className="details-summary">{anime.description}</p>
          </div>
        </div>

        {/* Bottom Grid: Episodes & Sidebar */}
        <div className="details-main-grid">
          <div className="main-content-column">
            <div className="episodes-section">
              <h2 className="section-title">
                Episodes <span style={{ color: "var(--color-accent)", opacity: 0.8 }}>({episodes.length})</span>
              </h2>
              {episodes.length > 0 ? (
                <EpisodeList
                  episodes={episodes}
                  onSelect={(ep) => navigate(`/anime/${id}/watch/${ep._id}`)}
                  fallbackImage={anime.fanartBackground || anime.bannerImage || anime.coverImage}
                />
              ) : (
                <div className="empty-state">No episodes available yet.</div>
              )}
            </div>

            {anime.characters && anime.characters.length > 0 && (
              <div className="characters-section" style={{ marginTop: "3rem" }}>
                <CharacterList characters={anime.characters.slice(0, 10)} />
              </div>
            )}
          </div>

          <aside className="sidebar-column">
            <div className="production-info card-panel" style={{ background: "rgba(255,255,255,0.03)", padding: "24px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <h3 className="section-title" style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Information</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ opacity: 0.6 }}>Studio</span> <span>{anime.studios?.[0]?.name || "Unknown"}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ opacity: 0.6 }}>Source</span> <span>{anime.scrapeSource || "Unknown"}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ opacity: 0.6 }}>Genres</span> <span style={{ textAlign: "right", fontSize: "0.9rem" }}>{anime.genres?.slice(0, 3).join(", ")}</span></div>
              </div>
            </div>

            {anime.recommendations && anime.recommendations.length > 0 && (
              <div style={{ marginTop: "2rem" }}>
                <RecommendationList title="Recommend" items={anime.recommendations} />
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Floating Action Button (Mobile) */}
      {isMobile && episodes.length > 0 && (
        <div className={`sticky-watch-fab ${showStickyWatch ? "visible" : ""}`}>
          <button
            className="btn-watch-now"
            onClick={() => {
              const firstEp = [...episodes].sort((a, b) => a.number - b.number)[0];
              navigate(`/anime/${anime._id}/watch/${firstEp._id}`);
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Watch Now
          </button>
        </div>
      )}
    </div>
  );
}
