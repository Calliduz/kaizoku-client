import type { StreamingSource } from '../types';
import '../styles/components/ServerSelector.css';

interface ServerSelectorProps {
  sources: StreamingSource[];
  currentSource: StreamingSource | null;
  onSelect: (source: StreamingSource) => void;
}

export default function ServerSelector({ sources, currentSource, onSelect }: ServerSelectorProps) {
  if (!sources || sources.length === 0) return null;

  // Group sources by audio type
  const subSources = sources.filter(s => s.audio === 'sub' || !s.audio);
  const dubSources = sources.filter(s => s.audio === 'dub');

  // Helper to group by server name (taking the highest quality as default)
  const groupSourcesByServer = (srcs: StreamingSource[]) => {
    const map = new Map<string, StreamingSource>();
    for (const src of srcs) {
      const existing = map.get(src.server);
      if (!existing) {
        map.set(src.server, src);
      } else {
        const getVal = (q: string) => parseInt(q.replace(/\D/g, '')) || 0;
        if (getVal(src.quality) > getVal(existing.quality)) {
          map.set(src.server, src);
        }
      }
    }
    return Array.from(map.values());
  };

  const subGrouped = groupSourcesByServer(subSources);
  const dubGrouped = groupSourcesByServer(dubSources);

  return (
    <div className="server-selector">
      <div className="server-selector__row">
        {subGrouped.length > 0 && (
          <div className="server-group">
            <span className="server-group__label">Subtitles</span>
            <div className="server-group__list">
              {subGrouped.map((source, index) => (
                <button
                  key={`sub-${index}`}
                  className={`server-btn ${currentSource?.server === source.server && (currentSource?.audio === 'sub' || !currentSource?.audio) ? 'active' : ''}`}
                  onClick={() => onSelect(source)}
                >
                  <span className="server-btn__name">{source.server}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {dubGrouped.length > 0 && (
          <div className="server-group">
            <span className="server-group__label">Dubbed</span>
            <div className="server-group__list">
              {dubGrouped.map((source, index) => (
                <button
                  key={`dub-${index}`}
                  className={`server-btn dub ${currentSource?.server === source.server && currentSource?.audio === 'dub' ? 'active' : ''}`}
                  onClick={() => onSelect(source)}
                >
                  <span className="server-btn__name">{source.server}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
