import type { Anime, Episode } from "../types";

const HISTORY_KEY = "kaizoku_watch_history";
const MAX_HISTORY = 12;

export interface HistoryItem {
  anime: Anime;
  episode: Episode;
  watchedAt: number;
  progressPercentage: number;
}

export const saveWatchHistory = (anime: Anime, episode: Episode, progress = 0) => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    let history: HistoryItem[] = raw ? JSON.parse(raw) : [];

    // Remove existing entry for this anime to bump it to top
    history = history.filter(item => item.anime._id !== anime._id);

    const newItem: HistoryItem = {
      anime,
      episode,
      watchedAt: Date.now(),
      progressPercentage: progress
    };

    history.unshift(newItem);
    
    // Limit history size
    if (history.length > MAX_HISTORY) {
      history = history.slice(0, MAX_HISTORY);
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error("Failed to save watch history", e);
  }
};

export const getWatchHistory = (): HistoryItem[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const getEpisodeProgress = (episodeId: string): number => {
  try {
    const savedTime = localStorage.getItem(`progress-${episodeId}`);
    return savedTime ? parseFloat(savedTime) : 0;
  } catch (e) {
    return 0;
  }
};

export const getEpisodePercentage = (episodeId: string): number => {
  try {
    const savedPercent = localStorage.getItem(`percent-${episodeId}`);
    return savedPercent ? parseFloat(savedPercent) : 0;
  } catch (e) {
    return 0;
  }
};

export const clearWatchHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};
