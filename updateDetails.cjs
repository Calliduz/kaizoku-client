const fs = require('fs');

let content = fs.readFileSync('src/pages/AnimeDetailsPage.tsx', 'utf8');

const layoutReplacement = `  return (
    <div className="anime-details-page animate-fade-in">
      <div className="details-hero">
        <img
          src={bgImage}
          alt="Banner"
          className={\`details-hero__img \${anime.bannerImage ? 'has-banner' : ''}\`}
        />
        <div className="details-hero__gradient" />
      </div>

      <div className="details-content-container">
        <div className="details-top-grid">
          <div className="details-poster">
            <img src={anime.coverImage} alt={anime.title} />
          </div>

          <div className="details-info">
            {anime.logo ? (
              <img src={anime.logo} alt={anime.title} className="details-logo" />
            ) : (
              <h1 className="details-title-text">{anime.title}</h1>
            )}

            <div className="details-metadata">
              {anime.rating > 0 && (
                <span className="meta-chip score">
                  ★ {(anime.rating / 10).toFixed(1)}
                </span>
              )}
              {episodes.length > 0 && (
                <span className="meta-chip episodes">{episodes.length} eps</span>
              )}
              {anime.format && <span className="meta-chip">{anime.format}</span>}
              {anime.status && <span className="meta-chip">{anime.status}</span>}
            </div>

            <div className="details-actions">
              <button
                className="btn-watch-now"
                onClick={() => {
                  if (episodes.length > 0) {
                    navigate(\`/anime/\${anime._id}/watch/\${episodes[0]._id}\`);
                  }
                }}
              >
                ▶ Watch Now
              </button>
              <button className="btn-add-list">+ Add to List</button>
              <button className="btn-add-list" style={{ padding: '12px', width: '48px', justifyContent: 'center' }}>♡</button>
            </div>

            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginTop: '20px', display: 'flex', gap: '20px' }}>
               <span style={{ fontWeight: 'bold', borderBottom: '2px solid var(--primary-color)', paddingBottom: '10px' }}>Summary</span>
               <span style={{ color: 'var(--text-secondary)' }}>Relations</span>
            </div>

            <p className="details-summary">{anime.description}</p>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: "1400px", margin: "40px auto 0", padding: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 300px", gap: "30px" }}>
          <div className="main-content-column">
            <div className="episodes-section" style={{ marginBottom: "40px" }}> 
              <h2 style={{ marginBottom: '20px' }}>Episodes ({episodes.length})</h2>
              {episodes.length > 0 ? (
                <EpisodeList
                  episodes={episodes}
                  currentEpisodeId={undefined}
                  onSelect={(ep) => navigate(\`/anime/\${id}/watch/\${ep._id}\`)}   
                />
              ) : (
                <div>No episodes available yet.</div>
              )}
            </div>
            {anime.characters && anime.characters.length > 0 && (
              <CharacterList characters={anime.characters.slice(0, 10)} />      
            )}
          </div>

          <aside className="sidebar-column" style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            <div className="production-info card-panel" style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px' }}>
              <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>Production</h3>
              <p style={{ margin: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Studio</span> 
                <span>{anime.studios?.[0]?.name || "Unknown"}</span>
              </p>
              <p style={{ margin: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Episodes</span> 
                <span>{anime.totalEpisodes || "Ongoing"}</span>   
              </p>
              <p style={{ margin: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Season</span> 
                <span>{anime.season} {anime.seasonYear}</span>   
              </p>
            </div>
            {anime.recommendations && anime.recommendations.length > 0 && (     
              <RecommendationList
                title="More Like This"
                items={anime.recommendations}
              />
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}`;

content = content.replace(/import "\.\.\/styles\/pages\/PlayerPage\.css";/g, 'import "../styles/pages/AnimeDetailsPage.css";');

const startIndex = content.indexOf('  return (\n');
const startMatch = content.indexOf('  return (\r\n');
const theIndex = startIndex !== -1 ? startIndex : startMatch;

const newContent = content.substring(0, theIndex) + layoutReplacement + '\n}\n';

fs.writeFileSync('src/pages/AnimeDetailsPage.tsx', newContent);
console.log('Successfully updated AnimeDetailsPage.tsx');
