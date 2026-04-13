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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
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
        if (!id) throw new Error("No anime ID provided");
        const [animeRes, itemsRes] = await Promise.all([
          fetchAnimeById(id),
          fetchEpisodes(id),
        ]);

        setAnime(animeRes.data);
        setEpisodes(itemsRes.data || []);
      } catch (err: any) {
        setError(err.response?.data?.error?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="discovery-view animate-fade-in">
        <AnimeDetailsSkeleton />
      </div>
    );
  }
  if (error)
    return (
      <ErrorDisplay message={error} onRetry={() => window.location.reload()} />
    );
  if (!anime) return <div className="container">Anime not found</div>;

  const bgImage =
    !isMobile && anime.fanartBackground
      ? anime.fanartBackground
      : anime.bannerImage || anime.coverImage;

  return (
    <div
      className="anime-details-page animate-fade-in"
      style={{ position: "relative" }}
    >
      <button
        className="back-btn details-back-btn"
        onClick={() => navigate(-1)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back
      </button>
      <div className="details-hero">
        <img
          src={bgImage}
          alt="Banner"
          className={`details-hero__img ${anime.bannerImage ? "has-banner" : ""}`}
        />
        <div className="details-hero__gradient" />
      </div>

      <div className="details-content-container">
        <div className="details-top-grid">
          <div className="details-poster">
            <img src={anime.coverImage} alt={anime.title} />
          </div>

          <div className="details-info">
            {anime.logo ? (
              <img
                src={anime.logo}
                alt={anime.title}
                className="details-logo"
              />
            ) : (
              <AnimeLogoImage animeId={anime._id} title={anime.title} />
            )}

            <div className="details-metadata">
              {anime.rating > 0 && (
                <span className="meta-chip score">
                  ★ {(anime.rating / 10).toFixed(1)}
                </span>
              )}
              {episodes.length > 0 && (
                <span className="meta-chip episodes">
                  {episodes.length} eps
                </span>
              )}
              {anime.format && (
                <span className="meta-chip">{anime.format}</span>
              )}
              {anime.status && (
                <span className="meta-chip">{anime.status}</span>
              )}
            </div>

            <div className="details-actions">
              <button
                className="btn-watch-now"
                onClick={() => {
                  if (episodes.length > 0) {
                    navigate(`/anime/${anime._id}/watch/${episodes[0]._id}`);
                  }
                }}
              >
                ▶ Watch Now
              </button>
              <button className="btn-add-list">+ Add to List</button>
              <button
                className="btn-add-list"
                style={{
                  padding: "12px",
                  width: "48px",
                  justifyContent: "center",
                }}
              >
                ♡
              </button>
            </div>

            <div
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                paddingBottom: "10px",
                marginTop: "20px",
                display: "flex",
                gap: "20px",
              }}
            >
              <span
                style={{
                  fontWeight: "bold",
                  borderBottom: "2px solid var(--primary-color)",
                  paddingBottom: "10px",
                }}
              >
                Summary
              </span>
              <span style={{ color: "var(--text-secondary)" }}>Relations</span>
            </div>

            <p className="details-summary">{anime.description}</p>
          </div>
        </div>
      </div>

      <div className="container details-main-grid">
        <div className="main-content-column">
          <div className="episodes-section" style={{ marginBottom: "40px" }}>
            <h2 style={{ marginBottom: "20px" }}>
              Episodes ({episodes.length})
            </h2>
            {episodes.length > 0 ? (
              <EpisodeList
                episodes={episodes}
                currentEpisodeId={undefined}
                onSelect={(ep) => navigate(`/anime/${id}/watch/${ep._id}`)}
              />
            ) : (
              <div>No episodes available yet.</div>
            )}
          </div>
          {anime.characters && anime.characters.length > 0 && (
            <CharacterList characters={anime.characters.slice(0, 10)} />
          )}
        </div>

        <aside
          className="sidebar-column"
          style={{ display: "flex", flexDirection: "column", gap: "30px" }}
        >
          <div
            className="production-info card-panel"
            style={{
              background: "rgba(255,255,255,0.02)",
              padding: "20px",
              borderRadius: "12px",
            }}
          >
            <h3
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                paddingBottom: "10px",
                marginBottom: "15px",
              }}
            >
              Production
            </h3>
            <p
              style={{
                margin: "8px 0",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: "var(--text-secondary)" }}>Studio</span>
              <span>{anime.studios?.[0]?.name || "Unknown"}</span>
            </p>
            <p
              style={{
                margin: "8px 0",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: "var(--text-secondary)" }}>Episodes</span>
              <span>{anime.totalEpisodes || "Ongoing"}</span>
            </p>
            <p
              style={{
                margin: "8px 0",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: "var(--text-secondary)" }}>Season</span>
              <span>
                {anime.season} {anime.seasonYear}
              </span>
            </p>
          </div>
          {anime.recommendations && anime.recommendations.length > 0 && (
            <RecommendationList
              title="More Like This"
              items={anime.recommendations}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
