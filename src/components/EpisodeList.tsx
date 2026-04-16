import type { Episode } from "../types";
import "../styles/components/EpisodeList.css";

interface EpisodeListProps {
  episodes: Episode[];
  currentEpisodeId?: string;
  onSelect: (ep: Episode) => void;
  fallbackImage?: string;
}

/**
 * EpisodeList — Cinematic list selector for the details and player pages.
 */
export default function EpisodeList({
  episodes = [],
  currentEpisodeId,
  onSelect,
  fallbackImage,
}: EpisodeListProps) {
  return (
    <div className="episode-list-cinematic" id="episode-list">
      <div className="episode-list__container">
        {episodes.length > 0 ? (
          episodes.map((ep, index) => {
            const isActive = ep._id === currentEpisodeId;
            return (
              <button
                key={ep._id}
                className={`episode-item-wrapper ${isActive ? "active" : ""}`}
                onClick={() => onSelect(ep)}
                id={`episode-${ep.number}`}
              >
                <div className="episode-item-number">{index + 1}</div>
                
                <div className="episode-item-thumb">
                  <img src={fallbackImage} alt={`Episode ${ep.number}`} />
                  <div className="episode-item-overlay">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  {isActive && <div className="now-playing-tag">PLAYING</div>}
                </div>

                <div className="episode-item-info">
                  <div className="episode-item-header">
                    <h4 className="episode-item-title">
                      {ep.title || `Episode ${ep.number}`}
                    </h4>
                    <span className="episode-item-duration">24m</span>
                  </div>
                  <p className="episode-item-summary">
                    Watch episode {ep.number} of this amazing series. Join the adventure as the story unfolds in this high-quality stream.
                  </p>
                </div>
              </button>
            );
          })
        ) : (
          <div className="episode-list__empty">
            No episodes available for this source.
          </div>
        )}
      </div>
    </div>
  );
}
