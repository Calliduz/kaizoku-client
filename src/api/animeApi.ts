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

export async function fetchEpisodeSources(episodeId: string, refresh = false): Promise<any> {
  return client.get(`/episodes/${episodeId}/sources`, { params: { refresh } });
}

export async function triggerScrape(query: string, fetchEpisodes = false): Promise<any> {
  return client.post('/scrape', { query, fetchEpisodes });
}

export async function fetchSuggestions(query: string): Promise<any> {
  return client.get('/anime/search/suggest', { params: { query } });
}
