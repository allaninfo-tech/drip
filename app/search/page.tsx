'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, Star } from 'lucide-react';
import { imgUrl, formatYear, formatRating } from '@/lib/constants';
import { searchMulti } from '@/lib/tmdb';
import type { SearchResult } from '@/lib/types';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const debounced = useDebounce(query, 380);

  useEffect(() => {
    if (!debounced.trim()) { setResults([]); return; }
    setLoading(true);
    searchMulti(debounced)
      .then((r) => setResults(r.results.filter((x) => x.media_type !== 'person' && x.poster_path)))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debounced]);

  const getTitle = (r: SearchResult) => r.title ?? r.name ?? 'Unknown';
  const getDate = (r: SearchResult) => r.release_date ?? r.first_air_date ?? '';

  return (
    <div className="search-page">
      <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 8 }}>Search</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '0.9rem' }}>
        Find movies and TV shows to stream for free.
      </p>
      <div className="search-bar-wrap">
        <Search size={20} className="search-icon-abs" />
        <input
          className="search-input"
          type="text"
          placeholder="Search movies, TV shows…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          Searching…
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">🎬</div>
          <p className="no-results-title">No results for &quot;{query}&quot;</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Try a different keyword.</p>
        </div>
      )}

      {!loading && !query && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <p className="no-results-title">Discover something new</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Type above to search thousands of titles.</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="search-results-grid">
          {results.map((r) => (
            <div
              key={r.id}
              className="media-card"
              onClick={() => router.push(`/${r.media_type}/${r.id}`)}
              role="button"
              style={{ width: '100%' }}
            >
              <div style={{ position: 'relative', aspectRatio: '2/3' }}>
                <Image
                  src={imgUrl.poster(r.poster_path, 'w342')}
                  alt={getTitle(r)}
                  fill
                  sizes="160px"
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
                <div className="media-card-overlay">
                  <div className="media-card-play">
                    <Search size={18} color="#fff" />
                  </div>
                </div>
              </div>
              <div className="media-card-info">
                <p className="media-card-title">{getTitle(r)}</p>
                <div className="media-card-meta">
                  <span style={{ textTransform: 'uppercase', fontSize: '0.68rem', color: r.media_type === 'tv' ? 'var(--accent-secondary)' : 'var(--accent-bright)', fontWeight: 700 }}>
                    {r.media_type === 'tv' ? 'TV' : 'Film'}
                  </span>
                  <span className="media-card-rating">
                    <Star size={11} fill="currentColor" />
                    {formatRating(r.vote_average)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
