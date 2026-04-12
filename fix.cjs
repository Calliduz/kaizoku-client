const fs = require('fs');
const content = fs.readFileSync('./src/pages/HomePage.tsx', 'utf8');

const regex = /const renderDiscoveryView = \(\) => \{[\s\S]*?\{\/\* Horizontal Scrolling Rows \*\/\}/;

const newDiscovery = `const renderDiscoveryView = () => {
    if (discoveryLoading) {
      return (
        <div className="discovery-view">
          <div className="carousel-skeleton" />
          <h2 className="row-title">Latest Updates</h2>
          <div className="anime-row">
            {Array.from({ length: 5 }).map((_, i) => (
              <div className="anime-row-item" key={i}>
                <AnimeCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="discovery-view">
        {/* Spotlight Carousel Hero */}
        {spotlight.length > 0 && (
          <div className="spotlight-carousel">
            {spotlight.slice(0, 5).map((anime, index) => (
              <div
                key={anime._id}
                className={\`spotlight-hero \${index === currentSlide ? 'active' : ''}\`}
                style={{
                  backgroundImage: \`linear-gradient(to right, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 40%, rgba(10,10,10,0) 100%), url(\${anime.banner || anime.cover})\`,
                }}
              >
                <div className="spotlight-content container">
                  {anime.logo ? (
                    <img
                      src={anime.logo}
                      alt={anime.title}
                      className="spotlight-logo drop-shadow"
                    />
                  ) : (
                    <h1 className="spotlight-title">{anime.title}</h1>        
                  )}
                  <p className="spotlight-description">
                    {anime.description?.substring(0, 200)}...
                  </p>
                  <div className="spotlight-actions">
                    <button
                      onClick={() => navigate(\`/anime/\${anime._id}\`)}
                      className="btn-watch"
                    >
                      Watch Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="carousel-indicators">
              {spotlight.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  className={\`carousel-dot \${index === currentSlide ? 'active' : ''}\`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={\`Go to slide \${index + 1}\`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Horizontal Scrolling Rows */}`;

fs.writeFileSync('./src/pages/HomePage.tsx', content.replace(regex, newDiscovery));
console.log('Fixed HomePage.tsx!');
