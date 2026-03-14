// ── TMDb Image Helpers ───────────────────────────────────────
const IMAGE_BASE = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

export const imgUrl = {
  poster: (path: string | null, size: 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500') =>
    path ? `${IMAGE_BASE}/${size}${path}` : '/placeholder-poster.svg',
  backdrop: (path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280') =>
    path ? `${IMAGE_BASE}/${size}${path}` : '/placeholder-backdrop.svg',
  profile: (path: string | null, size: 'w45' | 'w185' | 'h632' | 'original' = 'w185') =>
    path ? `${IMAGE_BASE}/${size}${path}` : '/placeholder-profile.svg',
};

// ── VidSrc Embed URL Builders ────────────────────────────────
export const vidSrc = {
  movie: (tmdbId: number) =>
    `https://vidsrc.to/embed/movie/${tmdbId}`,
  tvEpisode: (tmdbId: number, season: number, episode: number) =>
    `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`,
};

// ── Alternate Embed Sources ──────────────────────────────────
export const embedSources = {
  movie: (tmdbId: number) => [
    `https://vidlink.pro/movie/${tmdbId}`,
    `https://vidsrc.net/embed/movie?tmdb=${tmdbId}`,
    `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`,
    `https://www.2embed.cc/embed/${tmdbId}`,
    `https://autoembed.co/movie/tmdb/${tmdbId}`,
  ],
  tv: (tmdbId: number, season: number, episode: number) => [
    `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`,
    `https://vidsrc.net/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`,
    `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`,
    `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`,
    `https://autoembed.co/tv/tmdb/${tmdbId}-${season}-${episode}`,
  ],
};

// ── Formatting Helpers ───────────────────────────────────────
export function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function formatYear(dateStr: string | undefined): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).getFullYear().toString();
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trimEnd() + '…';
}

export const GENRE_COLORS: Record<number, string> = {
  28: '#ef4444',   // Action
  12: '#f97316',   // Adventure
  16: '#eab308',   // Animation
  35: '#22c55e',   // Comedy
  80: '#6366f1',   // Crime
  99: '#06b6d4',   // Documentary
  18: '#a855f7',   // Drama
  10751: '#ec4899', // Family
  14: '#8b5cf6',   // Fantasy
  36: '#84cc16',   // History
  27: '#dc2626',   // Horror
  10402: '#f59e0b', // Music
  9648: '#7c3aed', // Mystery
  10749: '#e11d48', // Romance
  878: '#0ea5e9',  // Sci-Fi
  53: '#64748b',   // Thriller
  10752: '#78716c', // War
  37: '#d97706',   // Western
};
