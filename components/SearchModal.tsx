'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, X, Film, Tv, Play } from 'lucide-react';
import { imgUrl, formatYear } from '@/lib/constants';
import type { SearchResult } from '@/lib/types';
import { searchMedia } from '@/lib/tmdb_client';

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Handle Ctrl+K / Cmd+K globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Fire a custom event that Navbar can listen to, or just handle it directly here
          // Since this component might be rendered once globally:
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced Search
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchMedia(query);
        // Filter out people, only keep movies and tv
        setResults(data.results.filter((r: any) => r.media_type === 'movie' || r.media_type === 'tv').slice(0, 10));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="search-modal">
        {/* Header / Input */}
        <div className="search-modal-header">
          <Search className="search-modal-icon" size={20} />
          <input
            ref={inputRef}
            type="text"
            className="search-modal-input"
            placeholder="Search movies, tv shows... (Cmd+K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && <div className="search-spinner" />}
          <button className="search-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        {(query.trim().length > 0 || results.length > 0) && (
          <div className="search-modal-results">
            {results.length === 0 && !loading && query.trim().length > 0 ? (
              <div className="search-no-results">No results found for "{query}"</div>
            ) : (
              results.map((item) => {
                const isMovie = item.media_type === 'movie';
                const title = isMovie ? item.title : item.name;
                const year = formatYear(isMovie ? item.release_date : item.first_air_date);

                return (
                  <div
                    key={`${item.media_type}-${item.id}`}
                    className="search-result-item"
                    onClick={() => {
                      router.push(`/${isMovie ? 'movie' : 'tv'}/${item.id}`);
                      onClose();
                    }}
                  >
                    {item.poster_path ? (
                      <Image
                        src={imgUrl.poster(item.poster_path, 'w92')}
                        alt={title || ''}
                        width={40}
                        height={60}
                        className="search-result-img"
                        unoptimized
                      />
                    ) : (
                      <div className="search-result-img-fallback">
                        {isMovie ? <Film size={20} /> : <Tv size={20} />}
                      </div>
                    )}
                    <div className="search-result-info">
                      <div className="search-result-title">{title}</div>
                      <div className="search-result-meta">
                        {year} • {isMovie ? 'Movie' : 'TV Show'}
                      </div>
                    </div>
                    <div className="search-result-action">
                      <Play size={16} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
