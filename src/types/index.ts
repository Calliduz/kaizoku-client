export interface Studio {
  id: number;
  name: string;
  isAnimationStudio: boolean;
}

export interface Anime {
  _id: string;
  title: string;
  altTitles: string[];
  slug: string;
  anilistId: number | null;
  coverImage: string;
  coverColor: string | null;
  bannerImage: string;
  description: string;
  genres: string[];
  tags: string[];
  status: 'RELEASING' | 'FINISHED' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS' | 'UNKNOWN';
  format: string | null;
  totalEpisodes: number;
  episodeDuration: number | null;
  rating: number;
  meanScore: number;
  popularity: number;
  season: string | null;
  seasonYear: number | null;
  startDate: string | null;
  endDate: string | null;
  studios: Studio[];
  sourceId?: string;
  scrapeSource?: string;
  updatedAt: string;
  createdAt: string;
}

export interface Episode {
  _id: string;
  animeId: string;
  number: number;
  title: string;
  sourceEpisodeId: string;
  url: string;
}

export interface StreamingSource {
  url: string;
  quality: string;
  server: string;
  type: 'hls' | 'mp4' | 'webm' | 'iframe' | 'embed';
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface AnimeListResponse {
  success: boolean;
  data: Anime[];
  pagination: Pagination;
}

export interface SingleAnimeResponse {
  success: boolean;
  data: Anime;
}

export interface EpisodeListResponse {
  success: boolean;
  data: Episode[];
}

export interface SourceResponse {
  success: boolean;
  data: StreamingSource[];
}
