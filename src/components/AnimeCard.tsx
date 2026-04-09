import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import '../styles/components/AnimeCard.css';

/**
 * AnimeCard — displays a single anime in the catalog grid.
 * Uses LazyLoadImage for progressive image loading.
 */
export default function AnimeCard({ anime }) {
  const {
    _id,
    title,
    coverImage,
    genres = [],
    rating,
    totalEpisodes,
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
