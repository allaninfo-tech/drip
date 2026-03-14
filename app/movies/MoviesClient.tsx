'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MediaCard from '@/components/MediaCard';
import { getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getUpcomingMovies, getMoviesByGenre } from '@/lib/tmdb';
import type { Movie, Genre } from '@/lib/types';

interface MoviesClientProps {
  initial: Movie[];
  genres: Genre[];
}

export default function MoviesClient({ initial, genres }: MoviesClientProps) {
  const [movies, setMovies] = useState<Movie[]>(initial);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMovies = useCallback(async (genreId: number | null, p: number) => {
    setLoading(true);
    try {
      const res = genreId
        ? await getMoviesByGenre(genreId, p)
        : await getPopularMovies(p);
      setMovies(res.results);
      setTotalPages(Math.min(res.total_pages, 500));
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="browse-page">
      <h1>Movies</h1>
      <p className="browse-subtitle">Browse thousands of movies, sorted by popularity.</p>

      {/* Genre filter */}
      <div className="genre-filter-bar">
        <button
          className={`genre-filter-chip${selectedGenre === null ? ' active' : ''}`}
          onClick={() => { setSelectedGenre(null); setPage(1); fetchMovies(null, 1); }}
        >
          All
        </button>
        {genres.map((g) => (
          <button
            key={g.id}
            className={`genre-filter-chip${selectedGenre === g.id ? ' active' : ''}`}
            onClick={() => { setSelectedGenre(g.id); setPage(1); fetchMovies(g.id, 1); }}
          >
            {g.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>Loading…</div>
      ) : (
        <div className="media-grid">
          {movies.map((m) => (
            <MediaCard key={m.id} media={m} type="movie" />
          ))}
        </div>
      )}

      <div className="pagination">
        <button
          className="page-btn"
          disabled={page <= 1}
          onClick={() => { const p = page - 1; setPage(p); fetchMovies(selectedGenre, p); window.scrollTo({top:0,behavior:'smooth'}); }}
        >
          ← Prev
        </button>
        <span className="page-indicator">Page {page} of {totalPages}</span>
        <button
          className="page-btn"
          disabled={page >= totalPages}
          onClick={() => { const p = page + 1; setPage(p); fetchMovies(selectedGenre, p); window.scrollTo({top:0,behavior:'smooth'}); }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
