'use client';

import { useState, useCallback } from 'react';
import MediaCard from '@/components/MediaCard';
import { getPopularTV, getTopRatedTV, getAiringTodayTV, getTVGenres } from '@/lib/tmdb';
import type { TVShow, Genre } from '@/lib/types';

interface TVClientProps {
  initial: TVShow[];
  genres: Genre[];
}

export default function TVClient({ initial, genres }: TVClientProps) {
  const [shows, setShows] = useState<TVShow[]>(initial);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [loading, setLoading] = useState(false);

  const fetchShows = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await getPopularTV(p);
      setShows(res.results);
      setTotalPages(Math.min(res.total_pages, 500));
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="browse-page">
      <h1>TV Shows</h1>
      <p className="browse-subtitle">Stream popular and top-rated series for free.</p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>Loading…</div>
      ) : (
        <div className="media-grid">
          {shows.map((s) => (
            <MediaCard key={s.id} media={s} type="tv" />
          ))}
        </div>
      )}

      <div className="pagination">
        <button
          className="page-btn"
          disabled={page <= 1}
          onClick={() => { const p = page - 1; setPage(p); fetchShows(p); window.scrollTo({top:0,behavior:'smooth'}); }}
        >
          ← Prev
        </button>
        <span className="page-indicator">Page {page} of {totalPages}</span>
        <button
          className="page-btn"
          disabled={page >= totalPages}
          onClick={() => { const p = page + 1; setPage(p); fetchShows(p); window.scrollTo({top:0,behavior:'smooth'}); }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
