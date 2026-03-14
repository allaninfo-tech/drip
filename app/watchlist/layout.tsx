import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My List',
  description: 'Your personal watchlist on dripTV. Keep track of the movies and TV shows you want to watch for free.',
};

export default function WatchlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
