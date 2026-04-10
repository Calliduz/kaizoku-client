import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchAllAnime } from '../api/animeApi';
import AnimeCard from '../components/AnimeCard';
import AnimeCardSkeleton from '../components/AnimeCardSkeleton';
import EmptyState from '../components/EmptyState';
import ErrorDisplay from '../components/ErrorDisplay';
import type { Anime } from '../types';
import '../styles/pages/HomePage.css';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const genre = searchParams.get('genre') || '';
  const format = searchParams.get('format') || '';
  const sort = searchParams.get('sort') || 'newest';

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

  // Fetch initial/search data
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadQuery();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, genre, format, sort]);

  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  // Load more
  const handleLoadMore = async () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;

    try {
      const res = await fetchAllAnime({ search, genre, format, sort, page: nextPage });
      setAnimeList((prev) => [...prev, ...res.data]);
      setHasMore(res.pagination.page < res.pagination.pages);
      setPage(nextPage);
    } catch (err) {
      console.error('Failed to load more:', err);
    }
  };

  return (
    <div className="home-page animate-fade-in" id="home-page">
      {/* Hero Section */}
      {!search && (
        <section className="hero">
          <div className="hero__content container">
            <h1 className="hero__title">
              Discover the <span className="gradient-text">Pirate King</span> of Anime
            </h1>
            <p className="hero__subtitle">
              Seamless streaming. High performance. No ads.
            </p>

          </div>
          <div className="hero__bg-gradient" />
        </section>
      )}

      {/* Catalog Section */}
      <section className="catalog container">
        <div className="catalog__header" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <h2 className="catalog__title">
            {search ? `Search Results: "${search}"` : 'Library Catalog'}
          </h2>

          <div className="catalog__filters">
            <div className="filter-group">
              <span className="filter-label">Genre</span>
              <select 
                className="filter-select" 
                value={genre} 
                onChange={(e) => updateFilters('genre', e.target.value)}
              >
                <option value="">All Genres</option>
                <option value="Action">Action</option>
                <option value="Adventure">Adventure</option>
                <option value="Comedy">Comedy</option>
                <option value="Drama">Drama</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Horror">Horror</option>
                <option value="Mystery">Mystery</option>
                <option value="Psychological">Psychological</option>
                <option value="Romance">Romance</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Slice of Life">Slice of Life</option>
                <option value="Sports">Sports</option>
                <option value="Supernatural">Supernatural</option>
                <option value="Thriller">Thriller</option>
              </select>
            </div>

            <div className="filter-group">
              <span className="filter-label">Format</span>
              <select 
                className="filter-select" 
                value={format} 
                onChange={(e) => updateFilters('format', e.target.value)}
              >
                <option value="">All Formats</option>
                <option value="TV">TV Series</option>
                <option value="MOVIE">Movie</option>
                <option value="OVA">OVA</option>
                <option value="ONA">ONA</option>
                <option value="SPECIAL">Special</option>
              </select>
            </div>

            <div className="filter-group">
              <span className="filter-label">Sort By</span>
              <select 
                className="filter-select" 
                value={sort} 
                onChange={(e) => updateFilters('sort', e.target.value)}
              >
                <option value="newest">Recently Updated</option>
                <option value="popular">Popularity</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {error ? (
          <ErrorDisplay message={error} onRetry={loadQuery} />
        ) : loading && animeList.length === 0 ? (
          <div className="catalog__grid">
            <AnimeCardSkeleton count={12} />
          </div>
        ) : animeList.length === 0 ? (
          <EmptyState 
            icon="🔍"
            title="No Results Found"
            description={search ? `We couldn't find any anime matching "${search}".` : "The library is currently empty."}
            action={search ? { label: 'Clear Search', onClick: () => updateFilters('search', '') } : undefined}
          />
        ) : (
          <>
            <div className="catalog__grid" id="anime-grid">
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
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
