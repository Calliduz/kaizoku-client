import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchAllAnime } from "../api/animeApi";
import AnimeCard from "../components/AnimeCard";
import AnimeCardSkeleton from "../components/AnimeCardSkeleton";
import AnimeRow from "../components/AnimeRow";
import AnimeLogoImage from "../components/AnimeLogoImage";
import EmptyState from "../components/EmptyState";
import ErrorDisplay from "../components/ErrorDisplay";
import LoadingSpinner from "../components/LoadingSpinner";
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
  const [currentSpotlightIdx, setCurrentSpotlightIdx] = useState(0);

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
    if (spotlight.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSpotlightIdx((prev) => (prev + 1) % spotlight.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [spotlight]);

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
          <div className="mobile-only-spinner">
            <LoadingSpinner />
          </div>
          <div className="desktop-only-skeleton">
            <div
              className="carousel-skeleton skeleton"
              style={{
                width: "100vw",
                height: "60vh",
                minHeight: "400px",
                marginLeft: "calc(-50vw + 50%)",
                marginBottom: "60px",
              }}
            />

            <h2
              className="row-title"
              style={{ width: "200px", height: "28px", marginBottom: "20px" }}
            >
              <div
                className="skeleton"
                style={{ width: "100%", height: "100%", borderRadius: "4px" }}
              />
            </h2>
            <div className="anime-row" style={{ overflow: "hidden" }}>
              <AnimeCardSkeleton count={6} />
            </div>

            <h2
              className="row-title"
              style={{
                width: "250px",
                height: "28px",
                marginTop: "40px",
                marginBottom: "20px",
              }}
            >
              <div
                className="skeleton"
                style={{ width: "100%", height: "100%", borderRadius: "4px" }}
              />
            </h2>
            <div className="anime-row" style={{ overflow: "hidden" }}>
              <AnimeCardSkeleton count={6} />
            </div>

            <h2
              className="row-title"
              style={{
                width: "150px",
                height: "28px",
                marginTop: "40px",
                marginBottom: "20px",
              }}
            >
              <div
                className="skeleton"
                style={{ width: "100%", height: "100%", borderRadius: "4px" }}
              />
            </h2>
            <div className="anime-row" style={{ overflow: "hidden" }}>
              <AnimeCardSkeleton count={6} />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="discovery-view">
        {/* Spotlight Carousel */}
        {spotlight.length > 0 && (
          <div className="spotlight-carousel">
            {spotlight.map((anime, index) => (
              <div
                key={anime._id}
                className={`spotlight-hero ${index === currentSpotlightIdx ? "active" : ""}`}
                style={
                  {
                    "--bg-desktop": `linear-gradient(to right, rgba(10,10,10,0.9) 20%, rgba(10,10,10,0.4) 60%, rgba(10,10,10,0)), url(${anime.bannerImage || anime.coverImage})`,
                    "--bg-mobile": `linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.5) 40%, rgba(10,10,10,0) 80%), url(${anime.coverImage || anime.bannerImage})`,
                  } as React.CSSProperties
                }
              >
                <div
                  className="spotlight-content"
                  style={
                    index !== currentSpotlightIdx ? { display: "none" } : {}
                  }
                >
                  {anime.logo ? (
                    <img
                      src={anime.logo}
                      alt={anime.title}
                      className="spotlight-logo drop-shadow"
                    />
                  ) : (
                    <AnimeLogoImage
                      animeId={anime._id}
                      title={anime.title}
                      className="spotlight-logo"
                    />
                  )}
                  <h2 className="spotlight-title">{anime.title}</h2>
                  <p className="spotlight-description">
                    {anime.description?.substring(0, 150)}...
                  </p>
                  <div className="spotlight-actions">
                    <button
                      onClick={() => navigate(`/anime/${anime._id}`)}
                      className="btn-watch"
                    >
                      Watch Now
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="carousel-indicators">
              {spotlight.map((_, index) => (
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
        <AnimeRow
          title="Latest Releases"
          animes={latest}
          onSeeAll={() => updateFilters("sort", "newest")}
        />
        <AnimeRow
          title="Trending This Season"
          animes={trending}
          onSeeAll={() => updateFilters("sort", "popularity")}
        />
        <AnimeRow
          title="Top Rated"
          animes={topRated}
          onSeeAll={() => updateFilters("sort", "rating")}
        />
      </div>
    );
  };

  const renderCatalogView = () => {
    return (
      <section className="catalog container">
        <div className="catalog__header">
          <h2 className="catalog__title">
            {search ? `Search: "${search}"` : "Catalog View"}
          </h2>
          <div className="catalog__filters">
            <div className="filter-group">
              <span className="filter-label">Genre</span>
              <select
                className="filter-select"
                value={genre}
                onChange={(e) => updateFilters("genre", e.target.value)}
              >
                <option value="">All</option>
                <option value="Action">Action</option>
                <option value="Comedy">Comedy</option>
                <option value="Drama">Drama</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Romance">Romance</option>
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
