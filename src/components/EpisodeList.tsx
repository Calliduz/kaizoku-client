import '../styles/components/EpisodeList.css';

/**
 * EpisodeList — scrollable episode selector for the player page.
 */
export default function EpisodeList({ episodes = [], currentEpisodeId, onSelect }) {
  return (
    <div className="episode-list" id="episode-list">
      <h3 className="episode-list__title">Episodes</h3>
      <div className="episode-list__grid">
        {episodes.map((ep) => (
          <button
            key={ep._id}
            className={`episode-list__item ${ep._id === currentEpisodeId ? 'active' : ''}`}
            onClick={() => onSelect(ep)}
            id={`episode-${ep.number}`}
          >
            <span className="episode-list__number">{ep.number}</span>
            <span className="episode-list__ep-title">
              {ep.title || `Episode ${ep.number}`}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
