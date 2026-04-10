import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import type { Anime } from '../types';
import 'react-lazy-load-image-component/src/effects/blur.css';
import '../styles/components/AnimeCard.css';

/**
 * AnimeCard — displays a single anime in the catalog grid.
 * Uses LazyLoadImage for progressive image loading.
 */
interface AnimeCardProps {
  anime: Anime;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  const {
    _id,
    title,
    coverImage,
    genres = [],
    rating,
    totalEpisodes,
    description,
    format,
  } = anime;

  return (
    <Link to={`/anime/${_id}`} className="anime-card" id={`anime-card-${_id}`}>
      <div className="anime-card__image-wrapper">
        <LazyLoadImage
          src={coverImage || '/placeholder.svg'}
          alt={title}
          effect="blur"
          className="anime-card__image"
          wrapperClassName="anime-card__lazy-wrapper"
        />
        <div className="anime-card__overlay">
          <span className="anime-card__play-icon">▶</span>
          {description && (
            <div className="anime-card__hover-details">
              <p className="anime-card__description">{description}</p>
            </div>
          )}
        </div>

        {rating > 0 && (
          <span className="anime-card__rating">
            ★ {(rating / 10).toFixed(1)}
          </span>
        )}

        {totalEpisodes > 0 && (
          <span className="anime-card__episodes">
            {totalEpisodes} EP
          </span>
        )}

        {format && (
          <span className="anime-card__format">
            {format.replace(/_/g, ' ')}
          </span>
        )}
      </div>

      <div className="anime-card__info">
        <h3 className="anime-card__title">{title}</h3>
        {genres.length > 0 && (
          <div className="anime-card__genres">
            {genres.slice(0, 3).map((genre) => (
              <span key={genre} className="anime-card__genre">{genre}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
