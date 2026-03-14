import { getPopularMovies, getMovieGenres } from '@/lib/tmdb';
import MoviesClient from './MoviesClient';

export const revalidate = 3600;

export default async function MoviesPage() {
  const [movies, genres] = await Promise.all([
    getPopularMovies(),
    getMovieGenres(),
  ]);
  return <MoviesClient initial={movies.results} genres={genres.genres} />;
}
