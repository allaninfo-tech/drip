import { getPopularTV, getTVGenres } from '@/lib/tmdb';
import TVClient from './TVClient';

export const revalidate = 3600;

export default async function TVPage() {
  const [shows, genres] = await Promise.all([
    getPopularTV(),
    getTVGenres(),
  ]);
  return <TVClient initial={shows.results} genres={genres.genres} />;
}
