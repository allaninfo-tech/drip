import {
  getMovieDetails,
  getMovieCredits,
  getSimilarMovies,
  getMediaVideos,
} from '@/lib/tmdb';
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
    const title = `${movie.title} — Watch Free on dripTV`;
    return {
      title: movie.title, // Will be formatted by template as "Title — dripTV"
      description: movie.overview,
      openGraph: {
        title,
        description: movie.overview,
        images: movie.backdrop_path ? [imgUrl.backdrop(movie.backdrop_path, 'w1280')] : [],
        type: 'video.movie',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: movie.overview,
        images: movie.backdrop_path ? [imgUrl.backdrop(movie.backdrop_path, 'w780')] : [],
      }
    };
  } catch {
    return { title: 'Movie' };
  }
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params;
  const [movie, credits, similar, videos] = await Promise.all([
    getMovieDetails(Number(id)),
    getMovieCredits(Number(id)),
    getSimilarMovies(Number(id)),
    getMediaVideos(Number(id), 'movie'),
  ]);

  return <MovieDetailClient movie={movie} credits={credits} similar={similar.results} videos={videos} />;
}
