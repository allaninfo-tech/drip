'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import MediaCard from './MediaCard';
import type { Movie, TVShow } from '@/lib/types';

interface MediaRowProps {
  title: string;
  items: (Movie | TVShow)[];
  type: 'movie' | 'tv';
  seeAllHref?: string;
}

export default function MediaRow({ title, items, type, seeAllHref }: MediaRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({ left: dir === 'right' ? 600 : -600, behavior: 'smooth' });
  };

  if (!items?.length) return null;

  return (
    <section className="media-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {seeAllHref && (
          <Link href={seeAllHref} className="section-link">
            See all <ArrowRight size={14} />
          </Link>
        )}
      </div>
      <div className="row-wrapper">
        <button className="row-arrow left" onClick={() => scroll('left')} aria-label="Scroll left">
          <ChevronLeft size={20} />
        </button>
        <div className="row-scroll" ref={rowRef}>
          {items.map((item, i) => (
            <MediaCard key={item.id} media={item} type={type} priority={i < 4} />
          ))}
        </div>
        <button className="row-arrow right" onClick={() => scroll('right')} aria-label="Scroll right">
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
