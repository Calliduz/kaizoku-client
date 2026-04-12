import { useRef } from "react";
import AnimeCard from "./AnimeCard";
import AnimeCardSkeleton from "./AnimeCardSkeleton";
import type { Anime } from "../types";
import "../styles/components/AnimeRow.css";

interface Props {
  title: string;
  animes: Anime[];
  loading?: boolean;
  onSeeAll?: () => void;
}

export default function AnimeRow({
  title,
  animes,
  loading = false,
  onSeeAll,
}: Props) {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const scrollAmount = window.innerWidth * 0.75;
      rowRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="anime-row-container">
      <div className="row-header">
        <h2 className="row-title">
          <span className="title-icon"></span>
          {title}
        </h2>
        {onSeeAll && (
          <button className="see-all-btn" onClick={onSeeAll}>
            <span>See All</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        )}
      </div>

      <div className="row-scroll-wrapper">
        <button
          className="nav-arrow prev-arrow"
          onClick={() => handleScroll("left")}
          aria-label="Scroll left"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div className="anime-row" ref={rowRef}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div className="anime-row-item" key={i}>
                  <AnimeCardSkeleton />
                </div>
              ))
            : animes.map((anime) => (
                <div className="anime-row-item" key={anime._id}>
                  <AnimeCard anime={anime} />
                </div>
              ))}
        </div>

        <button
          className="nav-arrow next-arrow"
          onClick={() => handleScroll("right")}
          aria-label="Scroll right"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}
