import { useRef } from "react";
import AnimeCard from "./AnimeCard";
import AnimeCardSkeleton from "./AnimeCardSkeleton";
import type { Anime } from "../types";
import type { HistoryItem } from "../utils/watchHistory";
import "../styles/components/AnimeRow.css";

interface Props {
  title: string;
  animes: Anime[];
  loading?: boolean;
  onSeeAll?: () => void;
  showRankings?: boolean;
  disableCardTrailers?: boolean;
  isExternal?: boolean;
  historyItems?: HistoryItem[];
}

export default function AnimeRow({
  title,
  animes,
  loading = false,
  onSeeAll,
  showRankings = false,
  disableCardTrailers = false,
  isExternal = false,
  historyItems = []
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
          className="row-nav row-nav--prev"
          onClick={() => handleScroll("left")}
          aria-label="Scroll left"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>

        <div className="anime-row" ref={rowRef}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div className="anime-row-item" key={i}>
                  <AnimeCardSkeleton />
                </div>
              ))
            : animes.map((anime, index) => {
                const history = historyItems.find(h => h.anime._id === anime._id);
                return (
                  <div className="anime-row-item" key={anime._id}>
                    {showRankings && index < 10 && (
                      <div className="ranking-number">{index + 1}</div>
                    )}
                    <AnimeCard 
                      anime={anime} 
                      disableTrailer={disableCardTrailers} 
                      isExternal={isExternal}
                      progress={history?.progressPercentage}
                    />
                  </div>
                );
              })}
        </div>

        <button
          className="row-nav row-nav--next"
          onClick={() => handleScroll("right")}
          aria-label="Scroll right"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </div>
  );
}
