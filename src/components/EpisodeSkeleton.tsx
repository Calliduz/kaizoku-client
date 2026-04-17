import "../styles/components/EpisodeList.css";

/**
 * EpisodeSkeleton — A premium loading state for the episode list.
 */
export default function EpisodeSkeleton() {
  // Show 4-5 skeleton items
  const skeletons = Array(5).fill(null);

  return (
    <div className="episode-list-cinematic is-loading">
      <div className="episode-list__container">
        {skeletons.map((_, i) => (
          <div key={i} className="episode-item-wrapper skeleton">
            <div className="episode-item-number skeleton-pulse" style={{ width: "24px", height: "18px", background: "rgba(255,255,255,0.05)", borderRadius: "4px" }} />
            
            <div className="episode-item-thumb skeleton-pulse">
              <div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.05)" }} />
            </div>

            <div className="episode-item-info">
              <div className="skeleton-pulse" style={{ width: "60%", height: "14px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", marginBottom: "8px" }} />
              <div className="skeleton-pulse" style={{ width: "90%", height: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", marginBottom: "4px" }} />
              <div className="skeleton-pulse" style={{ width: "40%", height: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "4px" }} />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .skeleton-pulse {
          animation: skeleton-pulse 1.8s ease-in-out infinite;
        }
        @keyframes skeleton-pulse {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
        .episode-item-wrapper.skeleton {
          pointer-events: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: grid;
          grid-template-columns: 40px minmax(130px, 180px) 1fr;
          gap: 1.25rem;
          padding: 1rem;
          align-items: center;
        }
        @media (max-width: 480px) {
          .episode-item-wrapper.skeleton {
            grid-template-columns: 24px 80px 1fr;
            gap: 0.5rem;
            padding: 0.4rem;
          }
        }
      `}</style>
    </div>
  );
}
