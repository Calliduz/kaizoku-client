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

  return (
    <div className="server-selector">
      <div className="server-selector__row">
        {subSources.length > 0 && (
          <div className="server-group">
            <span className="server-group__label">Subtitles</span>
            <div className="server-group__list">
              {subSources.map((source, index) => (
                <button
                  key={`sub-${index}`}
                  className={`server-btn ${currentSource === source ? 'active' : ''}`}
                  onClick={() => onSelect(source)}
                >
                  <span className="server-btn__name">{source.server}</span>
                  <span className="server-btn__quality">{source.quality}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {dubSources.length > 0 && (
          <div className="server-group">
            <span className="server-group__label">Dubbed</span>
            <div className="server-group__list">
              {dubSources.map((source, index) => (
                <button
                  key={`dub-${index}`}
                  className={`server-btn dub ${currentSource === source ? 'active' : ''}`}
                  onClick={() => onSelect(source)}
                >
                  <span className="server-btn__name">{source.server}</span>
                  <span className="server-btn__quality">{source.quality}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
