import { getPopularTV, getTVGenres } from '@/lib/tmdb';
import TVClient from './TVClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TV Shows',
  description: 'Discover trending TV series and binge-worthy shows on dripTV. Watch your favorites for free.',
};

export const revalidate = 3600;

export default async function TVPage() {
  const [shows, genres] = await Promise.all([
    getPopularTV(),
    getTVGenres(),
  ]);
  return <TVClient initial={shows.results} genres={genres.genres} />;
}
