import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchAnimeById,
  fetchEpisodes,
  fetchEpisodeById,
  fetchEpisodeSources,
} from "../api/animeApi";
import VideoPlayer from "../components/VideoPlayer";
import EpisodeList from "../components/EpisodeList";
import LoadingSpinner from "../components/LoadingSpinner";
import PlayerSkeleton from "../components/PlayerSkeleton";
import ServerSelector from "../components/ServerSelector";
import ErrorDisplay from "../components/ErrorDisplay";
import EmptyState from "../components/EmptyState";
import { saveWatchHistory } from "../utils/watchHistory";
import type { Anime, Episode, StreamingSource } from "../types";
import "../styles/pages/PlayerPage.css";

export default function PlayerPage() {
  const { id, episodeId } = useParams();
  const navigate = useNavigate();

  const [anime, setAnime] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [sources, setSources] = useState<StreamingSource[]>([]);
  const [currentSource, setCurrentSource] = useState<StreamingSource | null>(
    null,
  );
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const LOADING_MESSAGES = [
    "Initializing playback engine...",
    "Bypassing Cloudflare filters...",
    "Hunting for high-quality mirrors...",
    "Optimizing stream buffer...",
    "Almost ready for departure...",
  ];
  const [loading, setLoading] = useState(true);
  const [sourceLoading, setSourceLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const eps = itemsRes.data || [];
      setEpisodes(eps);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load Anime & Episodes
  useEffect(() => {
    loadData();
  }, [id]);

  // Set Current Episode when episodes or episodeId changes
  useEffect(() => {
    if (episodes.length > 0 && episodeId) {
      if (episodeId === "first") {
        setCurrentEpisode(episodes[0]);
      } else {
        const ep = episodes.find((e) => e._id === episodeId);
        if (ep) setCurrentEpisode(ep);
      }
    }
  }, [episodes, episodeId]);
  // Load Sources when episode changes
  useEffect(() => {
    let isMounted = true;
    if (!currentEpisode) return;

    const loadSources = async (isRefresh = false) => {
      try {
        setSourceLoading(true);
        const res = await fetchEpisodeSources(currentEpisode._id, isRefresh);
        if (isMounted) {
          const fetchedSources = (res.data || []).filter((s: StreamingSource) => s && s.url);
          setSources(fetchedSources);
          setCurrentSource(fetchedSources[0] || null);
        }
      } catch (err) {
        console.error("Failed to load sources:", err);
      } finally {
        if (isMounted) setSourceLoading(false);
      }
    };

    loadSources();
    return () => {
      isMounted = false;
    };
  }, [currentEpisode?._id]); // Use ID as dependency to prevent object-reference loops

  // Track Watch History
  useEffect(() => {
    if (anime && currentEpisode) {
      saveWatchHistory(anime, currentEpisode);
    }
  }, [anime?._id, currentEpisode?._id]);

  const handleRefreshSources = async () => {
    if (!currentEpisode) return;
    try {
      setSourceLoading(true);
      // 1. Refresh Sources (Backend will also refresh metadata if forceRefresh=true)
      const res = await fetchEpisodeSources(currentEpisode._id, true);
      const fetchedSources = res.data || [];
      setSources(fetchedSources);
      setCurrentSource(fetchedSources[0] || null);

      // 2. Sync Metadata (Fetch updated episode object from DB)
      const epRes = await fetchEpisodeById(currentEpisode._id);
      if (epRes.data) {
        setCurrentEpisode(epRes.data);
      }
    } catch (err) {
      console.error("Failed to refresh sources:", err);
    } finally {
      setSourceLoading(false);
    }
  };

  // Loading Message Rotator
  useEffect(() => {
    if (!sourceLoading) {
      setLoadingMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1800);

    return () => clearInterval(interval);
  }, [sourceLoading]);

  const lastHistoryUpdateRef = useRef<number>(0);

  if (loading) {
    return (
      <>
        <div className="mobile-only-spinner">
          <LoadingSpinner />
        </div>
        <div className="desktop-only-skeleton">
          <PlayerSkeleton />
        </div>
      </>
    );
  }

  if (error || !anime)
    return (
      <div className="player-page" style={{ paddingTop: "var(--space-2xl)" }}>
        <ErrorDisplay message={error || "Anime not found"} onRetry={loadData} />
      </div>
    );

  return (
    <div className="player-page" id="player-page">
      {/* Banner Backdrop */}
      <div
        className="player-page__backdrop"
        style={{
          backgroundImage: `url(${anime.bannerImage || anime.coverImage})`,
        }}
      />
      <div className="player-page__backdrop-overlay" />

      <div className="container player-page__content animate-fade-in-up">
        {/* Premium Floating Control Bar */}
        {!loading && !error && sources.length > 0 && (
          <div className="player-controls-bar glass animate-fade-in">
            <ServerSelector
              sources={sources}
              currentSource={currentSource}
              onSelect={setCurrentSource}
            />
            <div className="player-controls-bar__actions">
              <button
                onClick={handleRefreshSources}
                className="refresh-btn-premium"
                title="Force re-scrape for new links"
              >
                <span className="refresh-btn-premium__icon">🔄</span>
                <span className="refresh-btn-premium__text">Force Refresh</span>
              </button>
            </div>
          </div>
        )}

        {/* Video Player Area */}
        <div className="player-page__video-container">
          {sourceLoading ? (
            <div className="player-page__video-loading premium-loader">
              <div 
                className="loading-backdrop" 
                style={{ backgroundImage: `url(${anime.bannerImage || anime.coverImage})` }}
              />
              <div className="premium-loader__visual">
                <LoadingSpinner />
                <div className="premium-loader__pulse"></div>
              </div>
              <div className="premium-loader__content">
                <p className="premium-loader__status animate-fade-in-down" key={loadingMessageIndex}>
                  {LOADING_MESSAGES[loadingMessageIndex]}
                </p>
                <div className="premium-loader__progress-bar">
                  <div className="premium-loader__progress-fill"></div>
                </div>
              </div>
              <button
                onClick={handleRefreshSources}
                className="btn btn--outline btn--sm refresh-pill"
              >
                Taking too long? Force Refresh
              </button>
            </div>
          ) : currentSource && currentEpisode && anime ? (
            <VideoPlayer
              source={currentSource}
              title={`${anime.title} - ${currentEpisode.title}`}
              episodeId={currentEpisode._id}
              onProgress={(percent) => {
                const now = Date.now();
                if (now - lastHistoryUpdateRef.current > 5000) {
                  saveWatchHistory(anime, currentEpisode, percent);
                  lastHistoryUpdateRef.current = now;
                }
              }}
            />
          ) : (
            <div className="player-page__video-error">
              <EmptyState
                icon="📭"
                title="No Sources Found"
                description="We couldn't fetch any streaming links for this episode. This can happen if the external source is down or Cloudflare bypass failed."
              />
              <button
                onClick={handleRefreshSources}
                className="btn btn--primary"
                style={{ marginTop: "var(--space-md)", width: "auto" }}
              >
                🔄 Refresh Sources
              </button>
            </div>
          )}
        </div>

        {/* Metadata & Episode List */}
        {/* Minimal Viewer Layout */}
        <div
          className="player-page__layout"
          style={{
            marginTop: "20px",
          }}
        >
          <div className="player-page__info glass player-info-box">
            <div className="player-page__cover-wrapper">
              <img
                src={anime.coverImage}
                alt={anime.title}
                className="player-page__cover-img"
              />
            </div>
            <div className="player-page__details">
              {anime.logo ? (
                <img
                  src={anime.logo}
                  alt={anime.title}
                  className="player-page__logo"
                />
              ) : (
                <h1 className="player-page__title">{anime.title}</h1>
              )}
              
              <div className="player-page__meta-content">
                <p className="player-page__episode-badge">
                  {currentEpisode
                    ? `${currentEpisode.seasonNumber ? `Season ${currentEpisode.seasonNumber} : ` : ""}Episode ${currentEpisode.number}`
                    : "No episodes"}
                </p>
                
                {currentEpisode?.title && 
                 !currentEpisode.title.toLowerCase().includes(`episode ${currentEpisode.number}`) && (
                  <h2 className="player-page__ep-name">{currentEpisode.title}</h2>
                )}

                {currentEpisode?.description && (
                  <p className="player-page__description animate-fade-in">
                    {currentEpisode.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="player-page__episodes-container glass">
            <EpisodeList
              episodes={episodes}
              currentEpisodeId={currentEpisode?._id}
              onSelect={(ep) => navigate(`/anime/${id}/watch/${ep._id}`)}
              fallbackImage={anime.fanartBackground || anime.bannerImage || anime.coverImage}
              variant="compact"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
