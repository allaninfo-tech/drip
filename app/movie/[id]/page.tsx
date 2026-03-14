import { getMovieDetails, getMovieCredits, getSimilarMovies } from '@/lib/tmdb';
import MovieDetailClient from './MovieDetailClient';
import type { Metadata } from 'next';
import { imgUrl } from '@/lib/constants';

export const revalidate = 3600;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await getMovieDetails(Number(id));
    return {
      title: `${movie.title} — Drip`,
      description: movie.overview,
      openGraph: {
        title: `${movie.title} — Drip`,
        description: movie.overview,
        images: movie.backdrop_path ? [imgUrl.backdrop(movie.backdrop_path, 'w1280')] : [],
      },
    };
  } catch {
    return { title: 'Movie — Drip' };
  }
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params;
  const [movie, credits, similar] = await Promise.all([
    getMovieDetails(Number(id)),
    getMovieCredits(Number(id)),
    getSimilarMovies(Number(id)),
  ]);

  return <MovieDetailClient movie={movie} credits={credits} similar={similar.results} />;
}
