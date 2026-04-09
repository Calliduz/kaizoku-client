import client from './client';

/**
 * Anime API endpoints.
 */

export async function fetchAllAnime(params: any = {}): Promise<any> {
  return client.get('/anime', { params });
}

export async function fetchAnimeById(id: string): Promise<any> {
  return client.get(`/anime/${id}`);
}

export async function fetchEpisodes(animeId: string): Promise<any> {
  return client.get(`/anime/${animeId}/episodes`);
}

export async function fetchEpisodeSources(episodeId: string): Promise<any> {
  return client.get(`/episodes/${episodeId}/sources`);
}

export async function triggerScrape(query: string, fetchEpisodes = false): Promise<any> {
  return client.post('/scrape', { query, fetchEpisodes });
}
