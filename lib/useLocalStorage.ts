'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Movie, TVShow } from '@/lib/types';

export type SavedMedia = (Movie | TVShow) & {
  type: 'movie' | 'tv';
  savedAt: number;
  progress?: number;
};

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<SavedMedia[]>([]);

  // Load on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('drip_watchlist');
      if (stored) setWatchlist(JSON.parse(stored));
    } catch {}
  }, []);

  const toggleWatchlist = (media: Movie | TVShow, type: 'movie' | 'tv') => {
    const isSaved = watchlist.some((m) => m.id === media.id);
    let newList;
    
    if (isSaved) {
      newList = watchlist.filter((m) => m.id !== media.id);
    } else {
      newList = [{ ...media, type, savedAt: Date.now() }, ...watchlist];
    }

    setWatchlist(newList);
    localStorage.setItem('drip_watchlist', JSON.stringify(newList));
  };

  const isInWatchlist = (id: number) => watchlist.some((m) => m.id === id);

  return { watchlist, toggleWatchlist, isInWatchlist };
}

export function useContinueWatching() {
  const [history, setHistory] = useState<SavedMedia[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('drip_history');
      if (stored) setHistory(JSON.parse(stored));
    } catch {}
  }, []);

  const addToHistory = (media: Movie | TVShow, type: 'movie' | 'tv') => {
    // Remove if already exists to push it to the top
    const filtered = history.filter((m) => m.id !== media.id);
    const existing = history.find((m) => m.id === media.id);
    
    // Preserve progress if it existed
    const newList = [{ 
      ...media, 
      type, 
      savedAt: Date.now(),
      progress: existing?.progress || 0
    }, ...filtered].slice(0, 20);
    
    setHistory(newList);
    localStorage.setItem('drip_history', JSON.stringify(newList));
  };

  const updateProgress = useCallback((id: number, progress: number) => {
    setHistory((prev) => {
      const newList = prev.map((m) => 
        m.id === id ? { ...m, progress: Math.min(progress, 100) } : m
      );
      localStorage.setItem('drip_history', JSON.stringify(newList));
      return newList;
    });
  }, []);

  return { history, addToHistory, updateProgress };
}
