import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchAllAnime } from "../api/animeApi";
import AnimeCard from "../components/AnimeCard";
import AnimeCardSkeleton from "../components/AnimeCardSkeleton";
import AnimeRow from "../components/AnimeRow";
import AnimeLogoImage from "../components/AnimeLogoImage";
import EmptyState from "../components/EmptyState";
import ErrorDisplay from "../components/ErrorDisplay";
import LoadingSpinner from "../components/LoadingSpinner";
import SEO from "../components/SEO";
import { getWatchHistory, type HistoryItem } from "../utils/watchHistory";
import type { Anime } from "../types";
import "../styles/pages/HomePage.css";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const search = searchParams.get("search") || "";
  const genre = searchParams.get("genre") || "";
  const format = searchParams.get("format") || "";
  const sort = searchParams.get("sort") || "newest";

  const isBrowsing = search || genre || format || searchParams.has("sort");

  // Browsing State
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Yorumi-like Discovery State
  const [spotlight, setSpotlight] = useState<Anime[]>([]);
  const [latest, setLatest] = useState<Anime[]>([]);
  const [topRated, setTopRated] = useState<Anime[]>([]);
  const [trending, setTrending] = useState<Anime[]>([]);
  const [discoveryLoading, setDiscoveryLoading] = useState(true);
  const [watchHistory, setWatchHistory] = useState<HistoryItem[]>([]);
  const [currentSpotlightIdx, setCurrentSpotlightIdx] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerReady, setTrailerReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [fanartBackgrounds, setFanartBackgrounds] = useState<Record<string, string>>({});
  const spotlightWithBanner = spotlight.filter((anime) => !!anime.bannerImage);
  const carouselItems = spotlightWithBanner.length >= 3 ? spotlightWithBanner : spotlight;

  const loadDiscovery = async () => {
    setDiscoveryLoading(true);
    try {
      const [spotlightRes, latestRes, topRes, trendingRes] = await Promise.all([
        fetchAllAnime({ sort: "popular", limit: 10, page: 1 }),
        fetchAllAnime({ sort: "newest", limit: 15, page: 1 }),
        fetchAllAnime({ sort: "rating", limit: 15, page: 1 }),
        fetchAllAnime({ sort: "popularity", limit: 15, page: 1 }),
      ]);
      setSpotlight(spotlightRes.data);
      setLatest(latestRes.data);
      setTopRated(topRes.data);
      setTrending(trendingRes.data);
    } catch (e) {
      console.error(e);
      setError("Failed to load discovery data");
    } finally {
      setDiscoveryLoading(false);
    }
  };

  const loadQuery = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAllAnime({ search, genre, format, sort, page: 1 });
      setAnimeList(res.data);
      setHasMore(res.pagination.page < res.pagination.pages);
      setPage(1);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only load watch history when starting discovery view
    if (!isBrowsing) {
      setWatchHistory(getWatchHistory());
    }
  }, [isBrowsing]);

  useEffect(() => {
    if (!isBrowsing) {
      loadDiscovery();
    } else {
      const delayDebounceFn = setTimeout(() => {
        loadQuery();
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [search, genre, format, sort, isBrowsing]);

  useEffect(() => {
    if (carouselItems.length === 0) return;
    
    // Reset trailer when slide changes
    setShowTrailer(false);
    setTrailerReady(false);
    
    const interval = setInterval(() => {
      setCurrentSpotlightIdx((prev) => (prev + 1) % carouselItems.length);
    }, 8000); // Slower carousel for better impact

    // Show trailer after 2 seconds of being on a slide
    const trailerTimer = setTimeout(() => {
      if (carouselItems[currentSpotlightIdx]?.trailer?.id) {
        setShowTrailer(true);
        // Delay revealing trailer by 1.5s to let YouTube suppress its UI
        setTimeout(() => setTrailerReady(true), 1500);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(trailerTimer);
    };
  }, [carouselItems, currentSpotlightIdx]);

  useEffect(() => {
    if (currentSpotlightIdx >= carouselItems.length) {
      setCurrentSpotlightIdx(0);
    }
  }, [carouselItems.length, currentSpotlightIdx]);

  const handleNextSpotlight = () => {
    setCurrentSpotlightIdx((prev) => (prev + 1) % carouselItems.length);
  };

  const handlePrevSpotlight = () => {
    setCurrentSpotlightIdx((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  // Touch swipe support
  const touchStartX = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      if (delta > 0) handleNextSpotlight();
      else handlePrevSpotlight();
    }
  };

  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleLoadMore = async () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;

    try {
      const res = await fetchAllAnime({
        search,
        genre,
        format,
        sort,
        page: nextPage,
      });
      setAnimeList((prev) => [...prev, ...res.data]);
      setHasMore(res.pagination.page < res.pagination.pages);
      setPage(nextPage);
    } catch (err) {
      console.error("Failed to load more:", err);
    }
  };

  // ----- RENDERERS -----

  const renderDiscoveryView = () => {
    if (discoveryLoading) {
      return (
        <div className="discovery-view animate-fade-in" id="discovery-skeleton">
          {/* Main Carousel Skeleton */}
          <div className="spotlight-carousel skeleton-carousel">
            <div className="spotlight-hero active" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <div className="spotlight-content">
                <div className="skeleton" style={{ width: '300px', height: '120px', marginBottom: '20px' }} />
                <div className="skeleton" style={{ width: '80%', height: '1.2rem', marginBottom: '10px' }} />
                <div className="skeleton" style={{ width: '60%', height: '1.2rem', marginBottom: '25px' }} />
                <div className="skeleton" style={{ width: '140px', height: '45px', borderRadius: '8px' }} />
              </div>
            </div>
          </div>
          
          {/* Row Skeletons */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="discovery-row-container skeleton-row" style={{ marginTop: '30px' }}>
              <div className="skeleton" style={{ width: '200px', height: '24px', marginBottom: '15px', borderRadius: '4px' }} />
              <div className="anime-row" style={{ overflow: 'hidden', padding: '10px 0' }}>
                <AnimeCardSkeleton count={6} />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="discovery-view">
        <SEO title="Home" />
        {/* Spotlight Carousel */}
        {carouselItems.length > 0 && (
          <div
            className="spotlight-carousel"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {carouselItems.map((anime, index) => (
              <div
                key={anime._id}
                className={`spotlight-hero ${index === currentSpotlightIdx ? "active" : ""}`}
                style={
                  {
                    "--bg-desktop": `url(${fanartBackgrounds[anime._id] || anime.fanartBackground || anime.bannerImage || anime.coverImage})`,
                    "--bg-mobile": `linear-gradient(to top, rgba(10,10,10,0.64) 0%, rgba(10,10,10,0.24) 38%, rgba(10,10,10,0) 72%), url(${anime.coverImage || anime.bannerImage})`,
                  } as React.CSSProperties
                }
              >
                <div
                  className="spotlight-content"
                  style={
                    index !== currentSpotlightIdx ? { display: "none" } : {}
                  }
                >
                  <AnimeLogoImage
                    animeId={anime._id}
                    title={anime.title}
                    className="spotlight-logo drop-shadow"
                    onBackgroundFetched={(bgUrl) => {
                      setFanartBackgrounds((prev) => {
                        if (prev[anime._id] === bgUrl) return prev;
                        return { ...prev, [anime._id]: bgUrl };
                      });
                    }}
                  />
                  <div className="spotlight-metadata">
                    <span className="meta-badge rating">★ {(anime.rating / 10).toFixed(1)}</span>
                    <span className="meta-badge format">{anime.format?.replace(/_/g, " ")}</span>
                    <span className="meta-badge episodes">{anime.totalEpisodes} Episodes</span>
                    <div className="meta-genres">
                      {anime.genres?.slice(0, 3).map(g => <span key={g} className="genre-tag">{g}</span>)}
                    </div>
                  </div>
                  <p className="spotlight-description">
                    {anime.description?.substring(0, 220)}...
                  </p>
                  <div className="spotlight-actions-hero">
                    <button
                      onClick={() => navigate(`/anime/${anime._id}`)}
                      className="btn-watch-hero"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                      Watch Now
                    </button>
                    <button
                      onClick={() => navigate(`/anime/${anime._id}`)}
                      className="btn-info-hero"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                      More Info
                    </button>
                  </div>
                </div>

                {/* Trailer Overlay */}
                {index === currentSpotlightIdx && showTrailer && anime.trailer?.id && (
                  <div className={`spotlight-trailer-container ${trailerReady ? "trailer-visible" : ""}`}>
                    {/* Poster cover to hide YouTube player UI during initialization */}
                    <div
                      className={`trailer-poster-cover ${trailerReady ? "cover-hidden" : ""}`}
                      style={{ backgroundImage: `url(${fanartBackgrounds[anime._id] || anime.bannerImage || anime.coverImage})` }}
                    />
                    <iframe
                      className="spotlight-trailer-iframe"
                      src={`https://www.youtube.com/embed/${anime.trailer.id}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${anime.trailer.id}&rel=0&iv_load_policy=3&showinfo=0&disablekb=1&modestbranding=1`}
                      allow="autoplay; encrypted-media"
                      title="Anime Trailer"
                    />
                  </div>
                )}

                {/* Always-accessible Mute Toggle if trailer exists */}
                {index === currentSpotlightIdx && anime.trailer?.id && (
                  <button 
                    className="hero-mute-toggle"
                    onClick={() => setIsMuted(!isMuted)}
                    title={isMuted ? "Unmute Trailer" : "Mute Trailer"}
                  >
                    {isMuted ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"/></svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                    )}
                  </button>
                )}
              </div>
            ))}

            <button className="carousel-control prev" onClick={handlePrevSpotlight}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button className="carousel-control next" onClick={handleNextSpotlight}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>

            <div className="carousel-indicators">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${index === currentSpotlightIdx ? "active" : ""}`}
                  onClick={() => setCurrentSpotlightIdx(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Horizontal Scrolling Rows */}
        {watchHistory.length > 0 && (
          <AnimeRow
            title="Continue Watching"
            animes={watchHistory.map(h => h.anime)}
            disableCardTrailers={true}
          />
        )}
        <AnimeRow
          title="Latest Releases"
          animes={latest}
          disableCardTrailers={true}
          onSeeAll={() => updateFilters("sort", "newest")}
        />
        <AnimeRow
          title="Trending Now"
          animes={trending}
          showRankings={true}
          disableCardTrailers={true}
          onSeeAll={() => updateFilters("sort", "popularity")}
        />
        <AnimeRow
          title="Top Rated Classics"
          animes={topRated}
          disableCardTrailers={true}
          onSeeAll={() => updateFilters("sort", "rating")}
        />
      </div>
    );
  };

  const renderCatalogView = () => {
    const getCatalogTitle = () => {
      if (search) return `Search: "${search}"`;
      if (genre) return `Genre: ${genre}`;
      if (format) return `Format: ${format}`;
      switch (sort) {
        case "newest":
          return "Latest Releases";
        case "popularity":
          return "Trending Anime";
        case "rating":
          return "Top Rated";
        default:
          return "Catalog View";
      }
    };

    return (
      <section className="catalog container">
        <div className="catalog__header">
          <button
            className="catalog-back-btn"
            onClick={() => {
              setSearchParams(new URLSearchParams());
              navigate("/");
            }}
          >
            ← Back
          </button>
          <h2
            className="catalog__title"
            style={{
              fontSize: "2.5rem",
              fontWeight: "900",
              marginBottom: "20px",
            }}
          >
            {getCatalogTitle()}
          </h2>
          <div className="catalog__filters">
            <div className="filter-group">
              <span className="filter-label">Genre</span>
              <select
                className="filter-select"
                value={genre}
                onChange={(e) => updateFilters("genre", e.target.value)}
              >
                <option value="">All Genres</option>
                <option value="Action">Action</option>
                <option value="Adventure">Adventure</option>
                <option value="Comedy">Comedy</option>
                <option value="Drama">Drama</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Horror">Horror</option>
                <option value="Mystery">Mystery</option>
                <option value="Romance">Romance</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Slice of Life">Slice of Life</option>
                <option value="Sports">Sports</option>
                <option value="Supernatural">Supernatural</option>
                <option value="Thriller">Thriller</option>
              </select>
            </div>
          </div>
        </div>

        {error ? (
          <ErrorDisplay message={error} onRetry={loadQuery} />
        ) : loading && animeList.length === 0 ? (
          <>
            <div className="mobile-only-spinner">
              <LoadingSpinner />
            </div>
            <div className="catalog__grid desktop-only-skeleton">
              <AnimeCardSkeleton count={10} />
            </div>
          </>
        ) : animeList.length === 0 ? (
          <EmptyState
            icon="🔎"
            title="No Results Found"
            description="Try adjusting your filters."
          />
        ) : (
          <>
            <div className="catalog__grid">
              {animeList.map((anime) => (
                <AnimeCard key={anime._id} anime={anime} />
              ))}
              {loading && animeList.length > 0 && (
                <AnimeCardSkeleton count={5} />
              )}
            </div>
            {hasMore && (
              <div className="catalog__actions">
                <button
                  className="btn-load-more"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading && animeList.length > 0 ? "" : "Load More Anime"}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    );
  };

  return (
    <div className="home-page animate-fade-in" id="home-page">
      {isBrowsing ? renderCatalogView() : renderDiscoveryView()}
    </div>
  );
}
