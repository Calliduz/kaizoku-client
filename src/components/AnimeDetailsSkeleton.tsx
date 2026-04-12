import '../styles/pages/AnimeDetailsPage.css';

export default function AnimeDetailsSkeleton() {
  return (
    <div className='anime-details-page anime-details-skeleton animate-fade-in' id='anime-details-skeleton'>
      <div className='details-hero skeleton' style={{ opacity: 0.2, minHeight: '400px' }}>
        <div className='details-hero__gradient' />
      </div>

      <div className='details-content-container'>
        <div className='details-top-grid'>
          <div className='details-poster skeleton' style={{ height: '400px', borderRadius: 'var(--radius-lg)' }} />

          <div className='details-info'>
            <div className='skeleton' style={{ height: '3.5rem', width: '60%', marginBottom: '1rem' }} />
            <div className='skeleton' style={{ height: '1.2rem', width: '30%', marginBottom: '2rem' }} />

            <div className='details-metadata' style={{ marginBottom: '2rem' }}>
              <div className='skeleton' style={{ height: '24px', width: '60px', borderRadius: '12px' }} />
              <div className='skeleton' style={{ height: '24px', width: '80px', borderRadius: '12px' }} />
              <div className='skeleton' style={{ height: '24px', width: '70px', borderRadius: '12px' }} />
            </div>

            <div className='details-actions' style={{ gap: '1rem', display: 'flex', marginBottom: '2rem' }}>
              <div className='skeleton' style={{ height: '45px', width: '140px', borderRadius: 'var(--radius-md)' }} />
              <div className='skeleton' style={{ height: '45px', width: '120px', borderRadius: 'var(--radius-md)' }} />
            </div>

            <div className='details-synopsis'>
              <div className='skeleton' style={{ height: '1rem', width: '100%', marginBottom: '0.5rem' }} />
              <div className='skeleton' style={{ height: '1rem', width: '90%', marginBottom: '0.5rem' }} />
              <div className='skeleton' style={{ height: '1rem', width: '95%', marginBottom: '0.5rem' }} />
              <div className='skeleton' style={{ height: '1rem', width: '60%' }} />
            </div>
            
            <div className='details-genres' style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
              <div className='skeleton' style={{ height: '30px', width: '80px', borderRadius: '20px' }} />
              <div className='skeleton' style={{ height: '30px', width: '100px', borderRadius: '20px' }} />
              <div className='skeleton' style={{ height: '30px', width: '70px', borderRadius: '20px' }} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <div className='skeleton' style={{ height: '2rem', width: '200px', marginBottom: '1.5rem' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '1rem' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className='skeleton' style={{ height: '50px', borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

