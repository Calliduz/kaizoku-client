import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import type { Anime } from "../types";
import "react-lazy-load-image-component/src/effects/blur.css";
import "../styles/components/AnimeCard.css";

/**
 * AnimeCard — displays a single anime in the catalog grid.
 * Uses LazyLoadImage for progressive image loading.
 */
interface AnimeCardProps {
  anime: Anime;
  disableTrailer?: boolean;
}

export default function AnimeCard({ anime, disableTrailer = false }: AnimeCardProps) {
  const {
    _id,
    title,
    coverImage,
    rating,
    totalEpisodes,
    latestEpisode,
    format,
  } = anime;
  const [isHovered, setIsHovered] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    let timer: any;
    if (!disableTrailer && isHovered && anime.trailer?.id) {
      timer = setTimeout(() => setShowTrailer(true), 1200); // Wait for user to settle
    } else {
      setShowTrailer(false);
    }
    return () => clearTimeout(timer);
  }, [isHovered, anime.trailer?.id, disableTrailer]);

  const displayEpisodes = latestEpisode ?? totalEpisodes;

  return (
    <div
      className={`anime-card-wrapper ${isHovered ? "is-hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/anime/${_id}`} className="anime-card" id={`anime-card-${_id}`}>
        <div className="anime-card__image-wrapper">
          <LazyLoadImage
            src={coverImage || "/placeholder.svg"}
            alt={title}
            effect="blur"
            className="anime-card__image"
            wrapperClassName="anime-card__lazy-wrapper"
          />

          {/* Trailer Preview */}
          {showTrailer && anime.trailer?.id && (
            <div className="card-trailer-overlay animate-fade-in">
              <iframe
                src={`https://www.youtube.com/embed/${anime.trailer.id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`}
                allow="autoplay; encrypted-media"
                title="Preview"
              />
            </div>
          )}

          <div className="anime-card__overlay">
            <div className="card-actions-mini">
              <span className="mini-btn-play">▶</span>
              <span className="mini-btn-add">+</span>
            </div>
          </div>

          <div className="card-top-badges">
            {anime.popularity > 10000 && (
              <span className="badge-top10">TOP 10</span>
            )}
            {rating > 0 && (
              <span className="anime-card__rating">
                ★ {(rating / 10).toFixed(1)}
              </span>
            )}
            {displayEpisodes > 0 && (
              <span className="anime-card__episodes">{displayEpisodes} EP</span>
            )}
          </div>
        </div>

        <div className="anime-card__info">
          <h3 className="anime-card__title">{title}</h3>
          <div className="card-expanded-info">
            <div className="card-meta-line">
              <span className="badge-match">{(90 + Math.floor(Math.random() * 9))}% Match</span>
              <span className="meta-quality">HD</span>
              <span className="meta-year">{anime.seasonYear}</span>
              <span className="meta-format">{format?.replace(/_/g, " ")}</span>
            </div>
            <div className="card-genres-line">
              {anime.genres?.slice(0, 3).join(" • ")}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
