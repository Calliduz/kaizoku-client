import type { Episode } from "../types";
import "../styles/components/EpisodeList.css";

interface EpisodeListProps {
  episodes: Episode[];
  currentEpisodeId?: string;
  onSelect: (ep: Episode) => void;
}

/**
 * EpisodeList — scrollable episode selector for the player page.
 */
export default function EpisodeList({
  episodes = [],
  currentEpisodeId,
  onSelect,
}: EpisodeListProps) {
  return (
    <div className="episode-list" id="episode-list">
      <h3 className="episode-list__title">Episodes</h3>
      <div className="episode-list__grid">
        {episodes.length > 0 ? (
          episodes.map((ep) => (
            <button
              key={ep._id}
              className={`episode-list__item ${ep._id === currentEpisodeId ? "active" : ""}`}
              onClick={() => onSelect(ep)}
              id={`episode-${ep.number}`}
            >
              <span className="episode-list__number">{ep.number}</span>
              <span className="episode-list__ep-title">
                {ep.title && ep.title !== `Episode ${ep.number}`
                  ? ep.title
                  : `Episode ${ep.number}`}
              </span>
            </button>
          ))
        ) : (
          <div className="episode-list__empty">
            No episodes available for this source.
          </div>
        )}
      </div>
    </div>
  );
}
