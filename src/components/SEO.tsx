import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export default function SEO({
  title = "Kaizoku — Stream Premium Anime",
  description = "Midnight Voyage of discoveries. Stream your favorite anime in high resolution with premium cinematic experience on Kaizoku.",
  keywords = "anime, streaming, free anime, hd anime, cinematic anime, kaizoku",
  image = "/kaizoku-embed.png",
  url = window.location.href,
}: SEOProps) {
  useEffect(() => {
    // Update Title
    const baseTitle = "Kaizoku";
    document.title = title.includes(baseTitle) ? title : `${title} | ${baseTitle}`;

    // Update Meta Tags
    const updateMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    updateMeta("description", description);
    updateMeta("keywords", keywords);
    
    // Open Graph
    updateMeta("og:title", title, "property");
    updateMeta("og:description", description, "property");
    updateMeta("og:image", image, "property");
    updateMeta("og:url", url, "property");
    updateMeta("og:type", "website", "property");

    // Twitter
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", image);
  }, [title, description, keywords, image, url]);

  return null;
}
