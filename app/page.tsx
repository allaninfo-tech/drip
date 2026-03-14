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
import SpotlightHero from '@/components/SpotlightHero';
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

  // Fetch full details for the top 5 trending movies (for genres, runtime)
  const spotlightItems = await Promise.all(
    trendingMovies.results.slice(0, 5).map((m) => getMovieDetails(m.id))
  );

  return (
    <div>
      {/* Spotlight carousel — top 5 trending movies */}
      <SpotlightHero items={spotlightItems} type="movie" />

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
