import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchAllAnime } from "../api/animeApi";
import AnimeCard from "../components/AnimeCard";
import AnimeCardSkeleton from "../components/AnimeCardSkeleton";
import AnimeRow from "../components/AnimeRow";
import AnimeLogoImage from "../components/AnimeLogoImage";
import EmptyState from "../components/EmptyState";
import ErrorDisplay from "../components/ErrorDisplay";
import type { Anime } from "../types";
import "../styles/pages/HomePage.css";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const search = searchParams.get("search") || "";
  const genre = searchParams.get("genre") || "";
  const format = searchParams.get("format") || "";
  const sort = searchParams.get("sort") || "newest";

  const isBrowsing = search || genre || format;

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
        <div className="discovery-view">
          <div className="carousel-skeleton" />
          <h2 className="row-title">Latest Updates</h2>
          <div className="anime-row">
            {Array.from({ length: 5 }).map((_, i) => (
              <div className="anime-row-item" key={i}>
                <AnimeCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="discovery-view">
        {/* Spotlight Carousel Hero (Placeholder for top item) */}
        {spotlight.length > 0 && (
          <div className="spotlight-carousel">
            <div
              className="spotlight-hero active"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(10,10,10,0.9) 20%, rgba(10,10,10,0.4) 60%, rgba(10,10,10,0)), url(${spotlight[0].bannerImage || spotlight[0].coverImage})`,
              }}
            >
              <div className="spotlight-content">
                {spotlight[0].logo ? (
                  <img
                    src={spotlight[0].logo}
                    alt={spotlight[0].title}
                    className="spotlight-logo"
                  />
                ) : (
                  <AnimeLogoImage
                    animeId={spotlight[0]._id}
                    title={spotlight[0].title}
                    className="spotlight-logo"
                  />
                )}
                <p className="spotlight-description">
                  {spotlight[0].description?.substring(0, 150)}...
                </p>
                <div className="spotlight-actions">
                  <button
                    onClick={() => navigate(`/anime/${spotlight[0]._id}`)}
                    className="btn-watch"
                  >
                    Watch Now
                  </button>
                </div>
              </div>
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
          <div className="catalog__grid">
            <AnimeCardSkeleton count={10} />
          </div>
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
            </div>
            {hasMore && (
              <div className="catalog__actions">
                <button
                  className="btn-load-more"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Load More"}
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
