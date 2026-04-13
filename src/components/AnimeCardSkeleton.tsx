import '../styles/components/AnimeCard.css';

interface AnimeCardSkeletonProps {
  count?: number;
}

export default function AnimeCardSkeleton({ count = 1 }: AnimeCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="anime-card anime-row-item skeleton-card">
          <div className="anime-card__image-wrapper skeleton" style={{ aspectRatio: '3/4' }} />
          <div className="anime-card__info">
            <div className="skeleton" style={{ height: '1rem', width: '90%', marginBottom: '0.5rem', borderRadius: '4px' }} />
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <div className="skeleton" style={{ height: '0.7rem', width: '25%', borderRadius: '4px' }} />
              <div className="skeleton" style={{ height: '0.7rem', width: '35%', borderRadius: '4px' }} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
