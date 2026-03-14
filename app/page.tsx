import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getPopularTV,
  getTopRatedTV,
  getTrendingTV,
  getMovieDetails,
} from '@/lib/tmdb';
import HomeClientWrapper from './HomeClientWrapper';

export const revalidate = 3600;

export default async function HomePage() {
  const [
    trendingMovies,
    popularMovies,
    topRatedMovies,
    nowPlaying,
    popularTV,
    topRatedTV,
    trendingTV,
  ] = await Promise.all([
    getTrendingMovies(),
    getPopularMovies(),
    getTopRatedMovies(),
    getNowPlayingMovies(),
    getPopularTV(),
    getTopRatedTV(),
    getTrendingTV(),
  ]);

  // Fetch full details for the top 5 trending movies (for genres, runtime)
  const spotlightItems = await Promise.all(
    trendingMovies.results.slice(0, 5).map((m: any) => getMovieDetails(m.id))
  );

  return (
    <HomeClientWrapper 
      spotlightItems={spotlightItems} 
      trendingMovies={trendingMovies} 
      nowPlaying={nowPlaying} 
      topRatedMovies={topRatedMovies} 
      trendingTV={trendingTV} 
      topRatedTV={topRatedTV} 
      popularMovies={popularMovies} 
      popularTV={popularTV} 
    />
  );
}

