import React from 'react';
import '../styles/pages/PlayerPage.css';

export default function PlayerSkeleton() {
  return (
    <div className="player-page" id="player-skeleton">
      {/* Banner Skeleton */}
      <div className="player-page__backdrop skeleton" style={{ opacity: 0.3 }} />
      
      <div className="container player-page__content">
        {/* Back Button Skeleton */}
        <div className="skeleton" style={{ width: '120px', height: '32px', marginBottom: 'var(--space-md)', borderRadius: 'var(--radius-sm)' }} />

        {/* Video Player Skeleton */}
        <div className="player-page__video-container skeleton" style={{ aspectRatio: '16/9', borderRadius: 'var(--radius-lg)' }} />

        {/* Layout Skeleton */}
        <div className="player-page__layout" style={{ marginTop: 'var(--space-xl)' }}>
          <div className="player-page__info glass" style={{ padding: 'var(--space-lg)' }}>
            <div className="skeleton" style={{ height: '2.5rem', width: '60%', marginBottom: 'var(--space-md)' }} />
            <div className="skeleton" style={{ height: '1.2rem', width: '30%', marginBottom: 'var(--space-lg)' }} />
            
            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)' }}>
              <div className="skeleton" style={{ height: '24px', width: '60px', borderRadius: '4px' }} />
              <div className="skeleton" style={{ height: '24px', width: '80px', borderRadius: '4px' }} />
              <div className="skeleton" style={{ height: '24px', width: '70px', borderRadius: '4px' }} />
            </div>

            <div className="skeleton" style={{ height: '100px', width: '100%', marginBottom: 'var(--space-xl)' }} />
            
            <div className="player-page__metadata-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="metadata-item">
                  <div className="skeleton" style={{ height: '0.8rem', width: '40%', marginBottom: '0.4rem' }} />
                  <div className="skeleton" style={{ height: '1rem', width: '70%' }} />
                </div>
              ))}
            </div>
          </div>

          <div className="player-page__episodes-container glass" style={{ padding: 'var(--space-lg)' }}>
            <div className="skeleton" style={{ height: '1.5rem', width: '40%', marginBottom: 'var(--space-lg)' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 'var(--space-sm)' }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '40px', borderRadius: 'var(--radius-md)' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
