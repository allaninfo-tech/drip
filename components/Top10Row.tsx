'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import MediaCard from './MediaCard';
import type { Movie, TVShow } from '@/lib/types';

interface Top10RowProps {
  title: string;
  items: (Movie | TVShow)[];
  type: 'movie' | 'tv';
}

export default function Top10Row({ title, items, type }: Top10RowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth + 100 : scrollLeft + clientWidth - 100;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  // Take top 10 items only
  const top10 = items.slice(0, 10);

  return (
    <section className="media-section">
      <div className="section-header">
        <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp className="text-accent-bright" size={20} color="var(--accent-bright)" /> 
          {title}
        </h2>
      </div>

      <div className="row-wrapper">
        <button className="row-arrow left" onClick={() => scroll('left')} aria-label="Scroll left">
          <ChevronLeft size={24} />
        </button>
        
        <div className="row-scroll" ref={rowRef}>
          {top10.map((item) => (
            <div key={item.id} className="top10-card-wrapper">
              <MediaCard media={item} type={type} />
            </div>
          ))}
        </div>

        <button className="row-arrow right" onClick={() => scroll('right')} aria-label="Scroll right">
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}
