import SearchClient from './SearchClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search for movies and TV shows on dripTV. Find exactly what you want to watch for free.',
};

export default function SearchPage() {
  return <SearchClient />;
}
