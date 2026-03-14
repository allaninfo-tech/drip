const TMDB_BASE = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
const READ_TOKEN = process.env.NEXT_PUBLIC_TMDB_READ_TOKEN || '';

const headers = {
  accept: 'application/json',
  Authorization: `Bearer ${READ_TOKEN}`,
};

async function fetchTMDb<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${TMDB_BASE}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { headers, next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDb error: ${res.status} ${res.statusText}`);
  return res.json();
}

import type {
  Movie,
  TVShow,
  TMDbResponse,
  MediaCredits,
  Video,
  Genre,
  SearchResult,
  Season,
  Episode,
} from './types';

// ── Movies ──────────────────────────────────
export async function getTrendingMovies(page = 1): Promise<TMDbResponse<Movie>> {
  return fetchTMDb<TMDbResponse<Movie>>('/trending/movie/week', { page: String(page) });
}

export async function getPopularMovies(page = 1): Promise<TMDbResponse<Movie>> {
  return fetchTMDb<TMDbResponse<Movie>>('/movie/popular', { page: String(page) });
}

export async function getTopRatedMovies(page = 1): Promise<TMDbResponse<Movie>> {
  return fetchTMDb<TMDbResponse<Movie>>('/movie/top_rated', { page: String(page) });
}

export async function getNowPlayingMovies(page = 1): Promise<TMDbResponse<Movie>> {
  return fetchTMDb<TMDbResponse<Movie>>('/movie/now_playing', { page: String(page) });
}

export async function getUpcomingMovies(page = 1): Promise<TMDbResponse<Movie>> {
  return fetchTMDb<TMDbResponse<Movie>>('/movie/upcoming', { page: String(page) });
}

export async function getMovieDetails(id: number): Promise<Movie> {
  return fetchTMDb<Movie>(`/movie/${id}`);
}

export async function getMovieCredits(id: number): Promise<MediaCredits> {
  return fetchTMDb<MediaCredits>(`/movie/${id}/credits`);
}

export async function getMovieVideos(id: number): Promise<{ results: Video[] }> {
  return fetchTMDb<{ results: Video[] }>(`/movie/${id}/videos`);
}

export async function getSimilarMovies(id: number): Promise<TMDbResponse<Movie>> {
  return fetchTMDb<TMDbResponse<Movie>>(`/movie/${id}/similar`);
}

export async function getMoviesByGenre(genreId: number, page = 1): Promise<TMDbResponse<Movie>> {
  return fetchTMDb<TMDbResponse<Movie>>('/discover/movie', {
    with_genres: String(genreId),
    sort_by: 'popularity.desc',
    page: String(page),
  });
}

export async function getMovieGenres(): Promise<{ genres: Genre[] }> {
  return fetchTMDb<{ genres: Genre[] }>('/genre/movie/list');
}

// ── TV Shows ─────────────────────────────────
export async function getTrendingTV(page = 1): Promise<TMDbResponse<TVShow>> {
  return fetchTMDb<TMDbResponse<TVShow>>('/trending/tv/week', { page: String(page) });
}

export async function getPopularTV(page = 1): Promise<TMDbResponse<TVShow>> {
  return fetchTMDb<TMDbResponse<TVShow>>('/tv/popular', { page: String(page) });
}

export async function getTopRatedTV(page = 1): Promise<TMDbResponse<TVShow>> {
  return fetchTMDb<TMDbResponse<TVShow>>('/tv/top_rated', { page: String(page) });
}

export async function getAiringTodayTV(page = 1): Promise<TMDbResponse<TVShow>> {
  return fetchTMDb<TMDbResponse<TVShow>>('/tv/airing_today', { page: String(page) });
}

export async function getTVDetails(id: number): Promise<TVShow> {
  return fetchTMDb<TVShow>(`/tv/${id}`);
}

export async function getMediaVideos(id: string | number, type: 'movie' | 'tv') {
  const res = await fetchTMDb<any>(`/${type}/${id}/videos`);
  // Filter for official YouTube trailers if possible, or just return results
  return res.results || [];
}

export async function getTVCredits(id: number): Promise<MediaCredits> {
  return fetchTMDb<MediaCredits>(`/tv/${id}/credits`);
}

export async function getTVSeason(id: number, season: number): Promise<{ episodes: Episode[] }> {
  return fetchTMDb<{ episodes: Episode[] }>(`/tv/${id}/season/${season}`);
}

export async function getSimilarTV(id: number): Promise<TMDbResponse<TVShow>> {
  return fetchTMDb<TMDbResponse<TVShow>>(`/tv/${id}/similar`);
}

export async function getTVGenres(): Promise<{ genres: Genre[] }> {
  return fetchTMDb<{ genres: Genre[] }>('/genre/tv/list');
}

// ── Search ───────────────────────────────────
export async function searchMulti(query: string, page = 1): Promise<TMDbResponse<SearchResult>> {
  return fetchTMDb<TMDbResponse<SearchResult>>('/search/multi', {
    query,
    page: String(page),
    include_adult: 'false',
  });
}

export async function searchMovies(query: string, page = 1): Promise<TMDbResponse<Movie>> {
  return fetchTMDb<TMDbResponse<Movie>>('/search/movie', {
    query,
    page: String(page),
    include_adult: 'false',
  });
}
