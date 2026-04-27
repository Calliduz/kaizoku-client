import client from "./client";

/**
 * Anime API endpoints.
 */

export async function fetchAllAnime(params: any = {}, signal?: AbortSignal): Promise<any> {
  return client.get("/anime", { params, signal });
}

export async function fetchAnimeById(id: string, signal?: AbortSignal): Promise<any> {
  return client.get(`/anime/${id}`, { signal });
}

export async function fetchEpisodes(animeId: string, signal?: AbortSignal): Promise<any> {
  return client.get(`/anime/${animeId}/episodes`, { signal });
}

export async function fetchEpisodeById(id: string): Promise<any> {
  return client.get(`/episodes/${id}`);
}

export async function fetchEpisodeSources(
  episodeId: string,
  refresh = false,
  signal?: AbortSignal,
): Promise<any> {
  return client.get(`/episodes/${episodeId}/sources`, { params: { refresh }, signal });
}

export async function triggerScrape(
  query: string,
  fetchEpisodes = false,
): Promise<any> {
  return client.post("/scrape", { query, fetchEpisodes });
}

export async function fetchSuggestions(query: string): Promise<any> {
  return client.get("/anime/search/suggest", { params: { query } });
}

export async function fetchAnimeLogo(id: string): Promise<any> {
  return client.get(`/anime/${id}/logo`);
}

export async function fetchTop100(signal?: AbortSignal): Promise<any> {
  return client.get("/anime/top-100", { signal });
}

export async function fetchAiringSchedule(signal?: AbortSignal): Promise<any> {
  return client.get("/anime/airing-schedule", { signal });
}
