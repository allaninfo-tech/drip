import { getMovieDetails } from '@/lib/tmdb';
import { embedSources } from '@/lib/constants';
import MovieWatchClient from './MovieWatchClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WatchMoviePage({ params }: Props) {
  const { id } = await params;
  const movie = await getMovieDetails(Number(id));
  const sources = embedSources.movie(Number(id));

  return (
    <MovieWatchClient
      sources={sources}
      title={movie.title}
      mediaId={Number(id)}
      backdropPath={movie.backdrop_path}
      overview={movie.overview}
    />
  );
}
