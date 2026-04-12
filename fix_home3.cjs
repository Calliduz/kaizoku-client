const fs = require("fs");
const file =
  "C:/Users/chuchi/Desktop/Repositories/kaizoku/kaizoku-client/src/pages/HomePage.tsx";
let txt = fs.readFileSync(file, "utf8");

// Replace the logo query
txt = txt.replace(
  /\{spotlight\[0\]\.logo \? \([\s\S]*?className="spotlight-logo"[\s\S]*?\/\>\s*\)\s*:\s*\([\s\S]*?\<h1 className="spotlight-title"\>\{spotlight\[0\]\.title\}\<\/h1\>\s*\)\}/g,
  '<AnimeLogoImage animeId={spotlight[0]._id} initialLogo={spotlight[0].logo} title={spotlight[0].title} className="spotlight-logo" />',
);

const splitStr = "{/* Horizontal Scrolling Rows */}";
let parts = txt.split(splitStr);
if (parts.length > 1) {
  parts[1] =
    "\n" +
    '          <AnimeRow title="LATEST RELEASES" animes={latest} onSeeAll={() => updateFilters("sort", "newest")} />\n' +
    '          <AnimeRow title="TRENDING THIS SEASON" animes={trending} onSeeAll={() => updateFilters("sort", "popularity")} />\n' +
    '          <AnimeRow title="ALL-TIME POPULAR" animes={topRated} onSeeAll={() => updateFilters("sort", "rating")} />\n' +
    "        </div>\n" +
    "      </div>\n" +
    "    );\n" +
    "  }\n" +
    "\n" +
    "  return (\n" +
    '    <main className="home-page animate-fade-in">\n' +
    "      {isBrowsing ? renderCatalogView() : renderDiscoveryView()}\n" +
    "    </main>\n" +
    "  );\n" +
    "}\n";
  txt = parts[0] + splitStr + parts[1];
} else {
  console.log("Could not split on rows", splitStr);
  console.log(txt.substring(txt.length - 200));
}

fs.writeFileSync(file, txt);
