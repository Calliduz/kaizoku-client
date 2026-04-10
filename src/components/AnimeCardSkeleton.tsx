import React from 'react';
import '../styles/components/AnimeCard.css';

interface AnimeCardSkeletonProps {
  count?: number;
}

export default function AnimeCardSkeleton({ count = 1 }: AnimeCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="anime-card skeleton-card">
          <div className="anime-card__image-wrapper skeleton" style={{ aspectRatio: '2/3' }} />
          <div className="anime-card__info">
            <div className="skeleton" style={{ height: '1.2rem', width: '80%', marginBottom: '0.5rem' }} />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div className="skeleton" style={{ height: '0.8rem', width: '30%', borderRadius: '4px' }} />
              <div className="skeleton" style={{ height: '0.8rem', width: '40%', borderRadius: '4px' }} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
