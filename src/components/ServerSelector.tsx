import type { StreamingSource } from '../types';
import '../styles/components/ServerSelector.css';

interface ServerSelectorProps {
  sources: StreamingSource[];
  currentSource: StreamingSource | null;
  onSelect: (source: StreamingSource) => void;
}

export default function ServerSelector({ sources, currentSource, onSelect }: ServerSelectorProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="server-selector">
      <span className="server-selector__label">Servers:</span>
      <div className="server-selector__list">
        {sources.map((source, index) => (
          <button
            key={`${source.server}-${index}`}
            className={`server-btn ${currentSource === source ? 'active' : ''}`}
            onClick={() => onSelect(source)}
          >
            {source.server || `Server ${index + 1}`}
          </button>
        ))}
      </div>
    </div>
  );
}
