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
import HeroBanner from '@/components/HeroBanner';
import MediaRow from '@/components/MediaRow';

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

  // Pick a random hero from trending movies and fetch full details for genres
  const heroIdx = Math.floor(Math.random() * Math.min(8, trendingMovies.results.length));
  const heroItem = await getMovieDetails(trendingMovies.results[heroIdx].id);

  return (
    <div>
      <HeroBanner item={heroItem} type="movie" />

      <MediaRow
        title="🔥 Trending Movies"
        items={trendingMovies.results}
        type="movie"
        seeAllHref="/movies"
      />
      <MediaRow
        title="🎬 Now Playing"
        items={nowPlaying.results}
        type="movie"
        seeAllHref="/movies"
      />
      <MediaRow
        title="⭐ Top Rated Movies"
        items={topRatedMovies.results}
        type="movie"
        seeAllHref="/movies"
      />
      <MediaRow
        title="📺 Trending TV Shows"
        items={trendingTV.results}
        type="tv"
        seeAllHref="/tv"
      />
      <MediaRow
        title="🌟 Top Rated Series"
        items={topRatedTV.results}
        type="tv"
        seeAllHref="/tv"
      />
      <MediaRow
        title="🎭 Popular Movies"
        items={popularMovies.results}
        type="movie"
        seeAllHref="/movies"
      />
      <MediaRow
        title="📡 Popular TV Shows"
        items={popularTV.results}
        type="tv"
        seeAllHref="/tv"
      />
      <div style={{ height: 60 }} />
    </div>
  );
}
