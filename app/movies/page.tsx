import { getPopularMovies, getMovieGenres } from '@/lib/tmdb';
import MoviesClient from './MoviesClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Movies',
  description: 'Explore the latest trending and popular movies on dripTV. Stream thousands of titles for free.',
};

export const revalidate = 3600;

export default async function MoviesPage() {
  const [movies, genres] = await Promise.all([
    getPopularMovies(),
    getMovieGenres(),
  ]);
  return <MoviesClient initial={movies.results} genres={genres.genres} />;
}
