import { getTrendingMovies, getTrendingTV, getPopularMovies } from '@/lib/tmdb';
import MediaRow from '@/components/MediaRow';
import HeroBanner from '@/components/HeroBanner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trending',
  description: 'See what everyone is watching. The latest trending movies and TV shows on dripTV, all for free.',
};
import { getMovieDetails } from '@/lib/tmdb';

export const revalidate = 3600;

export default async function TrendingPage() {
  const [trendingMovies, trendingTV, popularMovies] = await Promise.all([
    getTrendingMovies(),
    getTrendingTV(),
    getPopularMovies(),
  ]);

  const heroIdx = Math.floor(Math.random() * Math.min(5, trendingTV.results.length));
  const heroShow = await getMovieDetails(trendingMovies.results[heroIdx].id);

  return (
    <div>
      <HeroBanner item={heroShow} type="movie" />
      <MediaRow title="🔥 Trending Movies This Week" items={trendingMovies.results} type="movie" seeAllHref="/movies" />
      <MediaRow title="📺 Trending TV This Week" items={trendingTV.results} type="tv" seeAllHref="/tv" />
      <MediaRow title="🎬 Popular Right Now" items={popularMovies.results} type="movie" seeAllHref="/movies" />
      <div style={{ height: 60 }} />
    </div>
  );
}
