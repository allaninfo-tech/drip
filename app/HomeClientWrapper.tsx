'use client';

import SpotlightHero from '@/components/SpotlightHero';
import MediaRow from '@/components/MediaRow';
import Top10Row from '@/components/Top10Row';
import { useContinueWatching } from '@/lib/useLocalStorage';

export default function HomeClientWrapper({
  spotlightItems,
  trendingMovies,
  nowPlaying,
  topRatedMovies,
  trendingTV,
  topRatedTV,
  popularMovies,
  popularTV,
}: any) {
  const { history } = useContinueWatching();

  return (
    <div>
      {/* Spotlight carousel — top 5 trending movies */}
      <SpotlightHero items={spotlightItems} type="movie" />

      {/* Trending row immediately below the hero for more visual depth */}
      <MediaRow
        title="🔥 Trending Movies"
        items={trendingMovies.results}
        type="movie"
        seeAllHref="/trending"
      />

      <Top10Row
        title="Top 10 Movies Today"
        items={trendingMovies.results}
        type="movie"
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
      <Top10Row
        title="Top 10 Series Today"
        items={trendingTV.results}
        type="tv"
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
