import { useNavigate } from "react-router-dom";
import "../styles/components/AiringScheduleRow.css";

interface AiringScheduleRowProps {
  schedule: any[];
}

export default function AiringScheduleRow({ schedule }: AiringScheduleRowProps) {
  const navigate = useNavigate();

  if (!schedule || schedule.length === 0) return null;

  // Group by day? Actually AniList returns sorted by time.
  // We'll just show the next few airing shows.
  
  return (
    <div className="discovery-row-container">
      <div className="discovery-row-header">
        <h2 className="discovery-row-title">
          <span className="row-title-icon">⏰</span>
          Airing Schedule
        </h2>
      </div>
      <div className="airing-schedule-container">
        {schedule.slice(0, 10).map((item, idx) => (
          <div 
            key={`${item.media.id}-${idx}`} 
            className="airing-item"
            onClick={() => navigate(`/anime/search?title=${encodeURIComponent(item.media.title.romaji)}`)}
          >
            <div className="airing-item__time">
              {new Date(item.airingAt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="airing-item__dot"></div>
            <div className="airing-item__content">
              <div className="airing-item__title">{item.media.title.romaji}</div>
              <div className="airing-item__episode">Episode {item.episode}</div>
            </div>
            <img 
              src={item.media.coverImage.large} 
              alt={item.media.title.romaji} 
              className="airing-item__image"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
