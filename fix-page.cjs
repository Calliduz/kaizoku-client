const fs = require("fs");

let content = fs.readFileSync("src/pages/AnimeDetailsPage.tsx", "utf8");

const replacement = `  if (!anime) return <div className="container">Anime not found</div>;

  const bgImage = anime.bannerImage || anime.coverImage;

  return (`;

if (content.indexOf(" Anime not found ") === -1) {
  content = content.replace("  return (", replacement);
}
content = content.replace(
  /import ErrorDisplay from "\.\.\/components\/ErrorDisplay";\n/,
  "",
);

fs.writeFileSync("src/pages/AnimeDetailsPage.tsx", content);
console.log("Fixed AnimeDetailsPage.tsx");
