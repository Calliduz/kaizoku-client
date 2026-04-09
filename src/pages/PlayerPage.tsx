import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAnimeById, fetchEpisodes, fetchEpisodeSources } from '../api/animeApi';
import VideoPlayer from '../components/VideoPlayer';
import EpisodeList from '../components/EpisodeList';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/pages/PlayerPage.css';

export default function PlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [sources, setSources] = useState([]);
  const [currentSource, setCurrentSource] = useState(null);

  const [loading, setLoading] = useState(true);
  const [sourceLoading, setSourceLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load Anime & Episodes
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const [animeRes, itemsRes] = await Promise.all([
          fetchAnimeById(id),
          fetchEpisodes(id)
        ]);

        if (isMounted) {
          setAnime(animeRes.data);
          const eps = itemsRes.data || [];
          setEpisodes(eps);
          if (eps.length > 0) setCurrentEpisode(eps[0]);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [id]);

  // Load Sources when episode changes
  useEffect(() => {
    let isMounted = true;
    if (!currentEpisode) return;

    const loadSources = async () => {
      try {
        setSourceLoading(true);
        const res = await fetchEpisodeSources(currentEpisode._id);
        if (isMounted) {
          const fetchedSources = res.data || [];
          setSources(fetchedSources);
          setCurrentSource(fetchedSources[0] || null);
        }
      } catch (err) {
        console.error('Failed to load sources:', err);
      } finally {
        if (isMounted) setSourceLoading(false);
      }
    };

    loadSources();
    return () => { isMounted = false; };
  }, [currentEpisode]);

  if (loading) return <LoadingSpinner />;
  if (error || !anime) return <div className="error-message container">Error: {error || 'Not found'}</div>;

  return (
    <div className="player-page" id="player-page">
      {/* Banner Backdrop */}
      <div
        className="player-page__backdrop"
        style={{ backgroundImage: `url(${anime.bannerImage || anime.coverImage})` }}
      />
      <div className="player-page__backdrop-overlay" />

      <div className="container player-page__content animate-fade-in-up">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="player-page__back">
          ← Back to Catalog
        </button>

        {/* Video Player Area */}
        <div className="player-page__video-container">
          {sourceLoading ? (
            <div className="player-page__video-loading">
              <LoadingSpinner />
              <p>Fetching encrypted sources (bypassing Cloudflare)...</p>
            </div>
          ) : currentSource ? (
            <VideoPlayer source={currentSource} title={`${anime.title} - ${currentEpisode.title}`} />
          ) : (
            <div className="player-page__video-error">
              No sources available for this episode.
            </div>
          )}
        </div>

        {/* Metadata & Episode List */}
        <div className="player-page__layout">
          <div className="player-page__info glass">
            <h1 className="player-page__title">{anime.title}</h1>
            <p className="player-page__episode-title">
              {currentEpisode ? `Episode ${currentEpisode.number}: ${currentEpisode.title}` : 'No episodes'}
            </p>

            <div className="player-page__tags">
              {anime.genres?.map(g => <span key={g} className="tag">{g}</span>)}
            </div>

            <p className="player-page__desc">{anime.description}</p>
          </div>

          <div className="player-page__episodes-container glass">
            <EpisodeList
              episodes={episodes}
              currentEpisodeId={currentEpisode?._id}
              onSelect={setCurrentEpisode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
