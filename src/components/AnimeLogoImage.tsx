import { useState, useEffect } from "react";
import { fetchAnimeLogo } from "../api/animeApi";

interface Props {
  animeId: string;
  initialLogo?: string;
  title: string;
  className?: string;
  onBackgroundFetched?: (bgUrl: string) => void;
}

export default function AnimeLogoImage({
  animeId,
  initialLogo,
  title,
  className = "details-logo",
  onBackgroundFetched,
}: Props) {
  const [logo, setLogo] = useState<string | null>(initialLogo || null);
  const [loading, setLoading] = useState(!initialLogo);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // Reset state if anime changes
    if (initialLogo) {
      setLogo(initialLogo);
      setLoading(false);
      setFailed(false);
      return;
    }

    setLoading(true);
    setFailed(false);

    // Load dynamically from backend
    fetchAnimeLogo(animeId)
      .then((res) => {
        if (res.success) {
          if (res.data) setLogo(res.data);
          if (res.background && onBackgroundFetched) {
            onBackgroundFetched(res.background);
          }
        } else {
          setFailed(true);
        }
      })
      .catch(() => {
        setFailed(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [animeId, initialLogo]);

  if (failed || (!loading && !logo)) {
    return <h1 className="details-title-text">{title}</h1>;
  }

  return logo ? (
    <img
      src={logo}
      alt={title}
      className={`${className} ${loading ? "logo-loading" : "logo-loaded"}`}
      style={{ opacity: loading ? 0 : 1, transition: "opacity 0.6s ease" }}
    />
  ) : null;
}
