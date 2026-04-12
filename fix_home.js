const fs = require('fs');
const file = 'C:/Users/chuchi/Desktop/Repositories/kaizoku/kaizoku-client/src/pages/HomePage.tsx';
let txt = fs.readFileSync(file, 'utf8');

// Replace the logo query
txt = txt.replace(
  /\{anime\.logo \? \([\s\S]*?className="spotlight-logo drop-shadow"[\s\S]*?\/\>\s*\)\s*:\s*\([\s\S]*?\<h1 className="spotlight-title"\>\{anime\.title\}\<\/h1\>\s*\)\}/g,
  '<AnimeLogoImage animeId={anime.id || anime._id} initialLogo={anime.logo} title={anime.title} className="spotlight-logo drop-shadow" />'
);

const splitStr = '{/* Horizontal Scrolling Rows */}';
let parts = txt.split(splitStr);
if (parts.length > 1) {
  parts[1] = '\n' +
'          <AnimeRow title="LATEST RELEASES" animes={latest} onSeeAll={() => updateFilters("sort", "newest")} />\n' +
'          <AnimeRow title="TRENDING THIS SEASON" animes={trending} onSeeAll={() => updateFilters("sort", "popularity")} />\n' +
'          <AnimeRow title="ALL-TIME POPULAR" animes={topRated} onSeeAll={() => updateFilters("sort", "rating")} />\n' +
'        </div>\n' +
'      </div>\n' +
'    );\n' +
'  }\n' +
'\n' +
'  return (\n' +
'    <main className="home-page">\n' +
'      {isBrowsing ? renderCatalogView() : renderDiscoveryView()}\n' +
'    </main>\n' +
'  );\n' +
'}\n';
  txt = parts[0] + splitStr + parts[1];
} else {
  console.log("Could not split on", splitStr);
}

fs.writeFileSync(file, txt);
const fs = require('fs');
const file = 'C:/Users/chuchi/Desktop/Repositories/kaizoku/kaizoku-client/src/pages/HomePage.tsx';
let txt = fs.readFileSync(file, 'utf8');

txt = txt.replace(
/\{anime\.logo \? \([\s\S]*?className=\"spotlight-logo drop-shadow\"[\s\S]*?\/\>[\s\S]*?\) \: \([\s\S]*?\<h1 className=\"spotlight-title\"\>\{anime\.title\}\<\/h1\>[\s\S]*?\)\}/,
'<AnimeLogoImage animeId={anime.id || anime._id} initialLogo={anime.logo} title={anime.title} className="spotlight-logo drop-shadow" />'
);

const rowsRegex = /\{\/\* Horizontal Scrolling Rows \*\/\}[\s\S]*?\<\/section\>/;
txt = txt.replace(rowsRegex, 
{/* Horizontal Scrolling Rows */}
          <AnimeRow title="LATEST RELEASES" animes={latest} onSeeAll={() => updateFilters("sort", "newest")} />
          <AnimeRow title="TRENDING THIS SEASON" animes={trending} onSeeAll={() => updateFilters("sort", "popularity")} />
          <AnimeRow title="ALL-TIME POPULAR" animes={topRated} onSeeAll={() => updateFilters("sort", "rating")} />
        </div>
      </section>);

fs.writeFileSync(file, txt);
