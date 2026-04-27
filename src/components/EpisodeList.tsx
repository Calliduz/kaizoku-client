import type { Episode } from "../types";
import "../styles/components/EpisodeList.css";

interface EpisodeListProps {
  episodes: Episode[];
  currentEpisodeId?: string;
  onSelect: (ep: Episode) => void;
  fallbackImage?: string;
  variant?: "default" | "compact";
}

/**
 * EpisodeList — Cinematic list selector for the details and player pages.
 */
export default function EpisodeList({
  episodes = [],
  currentEpisodeId,
  onSelect,
  fallbackImage,
  variant = "default",
}: EpisodeListProps) {
  return (
    <div className={`episode-list-cinematic ${variant === "compact" ? "compact-view" : ""}`} id="episode-list">
      <div className="episode-list__container">
        {episodes.length > 0 ? (
          episodes.map((ep) => {
            const isActive = ep._id === currentEpisodeId;
            return (
              <button
                key={ep._id}
                className={`episode-item-wrapper ${isActive ? "active" : ""}`}
                onClick={() => onSelect(ep)}
                id={`episode-${ep.number}`}
              >
                <div className="episode-item-number">{ep.number}</div>
                
                <div className="episode-item-thumb">
                  <img src={ep.thumbnail || fallbackImage} alt={`Episode ${ep.number}`} />
                  <div className="episode-item-overlay">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  {isActive && <div className="now-playing-tag">PLAYING</div>}
                </div>

                {variant !== "compact" && (
                  <div className="episode-item-info">
                    <div className="episode-item-header">
                      <h3 className="episode-item-title">
                        {ep.seasonNumber ? `S${ep.seasonNumber} : ` : ""}
                        {ep.title || `Episode ${ep.number}`}
                      </h3>
                      <span className="episode-item-duration">24m</span>
                    </div>
                    <p className={`episode-item-summary ${!ep.description ? "is-empty" : ""}`}>
                      {ep.description || "No synopsis available for this episode."}
                    </p>
                  </div>
                )}
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
