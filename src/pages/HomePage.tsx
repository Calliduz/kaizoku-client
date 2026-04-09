import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchAllAnime } from '../api/animeApi';
import AnimeCard from '../components/AnimeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/pages/HomePage.css';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch initial/search data
  useEffect(() => {
    let isMounted = true;
    const loadQuery = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchAllAnime({ search, page: 1 });
        if (isMounted) {
          setAnimeList(res.data);
          setHasMore(res.pagination.page < res.pagination.pages);
          setPage(1);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadQuery();
    return () => { isMounted = false; };
  }, [search]);

  // Load more
  const handleLoadMore = async () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;

    try {
      const res = await fetchAllAnime({ search, page: nextPage });
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
        <div className="catalog__header">
          <h2 className="catalog__title">
            {search ? `Search Results: "${search}"` : 'Latest Additions'}
          </h2>
        </div>

        {error && <div className="error-message">Error: {error}</div>}

        {loading && animeList.length === 0 ? (
          <LoadingSpinner />
        ) : animeList.length === 0 ? (
          <div className="catalog__empty">
            <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>😢</span>
            <h3>No anime found</h3>
            <p>Try searching for something else or trigger a scrape.</p>
          </div>
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
