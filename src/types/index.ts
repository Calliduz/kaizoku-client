export interface Studio {
  id: number;
  name: string;
  isAnimationStudio: boolean;
}

export interface Recommendation {
  id: number;
  title: string;
  coverImage: string;
  averageScore: number;
}

export interface Relation {
  id: number;
  relationType: string;
  title: string;
  coverImage: string;
  status: string;
  format: string;
}

export interface VoiceActor {
  id: number;
  name: string;
  nameNative: string;
  image: string;
}

export interface Character {
  id: number;
  name: string;
  nameNative: string;
  image: string;
  role: "MAIN" | "SUPPORTING" | "BACKGROUND";
  voiceActors: VoiceActor[];
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
  logo?: string;
  description: string;
  genres: string[];
  tags: string[];
  status:
    | "RELEASING"
    | "FINISHED"
    | "NOT_YET_RELEASED"
    | "CANCELLED"
    | "HIATUS"
    | "UNKNOWN";
  format: string | null;
  totalEpisodes: number;
  latestEpisode?: number;
  episodeDuration: number | null;
  rating: number;
  meanScore: number;
  popularity: number;
  season: string | null;
  seasonYear: number | null;
  startDate: string | null;
  endDate: string | null;
  studios: Studio[];
  characters?: Character[];
  recommendations?: Recommendation[];
  relations?: Relation[];
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

export interface Subtitle {
  url: string;
  lang: string;
  default?: boolean;
}

export interface StreamingSource {
  url: string;
  quality: string;
  server: string;
  type: "hls" | "mp4" | "webm" | "iframe" | "embed";
  audio?: "sub" | "dub";
  subtitles?: Subtitle[];
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
