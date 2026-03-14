'use client';

import { useWatchlist } from '@/lib/useLocalStorage';
import MediaCard from '@/components/MediaCard';

export default function WatchlistPage() {
  const { watchlist } = useWatchlist();

  return (
    <div className="browse-page">
      <div className="section-header" style={{ padding: '0 48px', marginBottom: 32 }}>
        <h1 className="section-title" style={{ fontSize: '2.4rem' }}>My List</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
          {watchlist.length} {watchlist.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: 16 }}>Your list is empty.</p>
          <p>Click the + icon on any movie or TV show to save it for later.</p>
        </div>
      ) : (
        <div className="grid-layout">
          {watchlist.map((media) => (
            <MediaCard key={media.id} media={media} type={media.type} />
          ))}
        </div>
      )}
    </div>
  );
}
