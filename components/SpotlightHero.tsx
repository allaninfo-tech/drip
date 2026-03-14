'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Play, Info, Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { imgUrl, formatYear, formatRating, formatRuntime, GENRE_COLORS } from '@/lib/constants';
import type { Movie, TVShow } from '@/lib/types';

type SpotlightItem = Movie | TVShow;

interface SpotlightHeroProps {
  items: SpotlightItem[];
  type: 'movie' | 'tv';
}

function isMovie(item: SpotlightItem): item is Movie {
  return 'title' in item;
}

const AUTOPLAY_MS = 6000;

export default function SpotlightHero({ items, type }: SpotlightHeroProps) {
  const [active, setActive] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const router = useRouter();

  const goto = useCallback((idx: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setActive(idx);
      setTransitioning(false);
    }, 300);
  }, [transitioning]);

  const prev = () => goto((active - 1 + items.length) % items.length);
  const next = useCallback(() => goto((active + 1) % items.length), [active, goto, items.length]);

  // Auto-rotate
  useEffect(() => {
    const t = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [active, next]);

  if (!items.length) return null;

  const item = items[active];
  const title = isMovie(item) ? item.title : item.name;
  const date = isMovie(item) ? item.release_date : item.first_air_date;
  const runtime = isMovie(item) && item.runtime ? formatRuntime(item.runtime) : null;
  const genres = item.genres ?? [];

  const watchHref = type === 'movie' ? `/watch/movie/${item.id}` : `/watch/tv/${item.id}/1/1`;
  const detailHref = `/${type}/${item.id}`;

  const rating = item.vote_average;
  const ratingColor =
    rating >= 7.5 ? '#22c55e' :
    rating >= 5.5 ? '#f59e0b' : '#ef4444';

  return (
    <section className="spotlight">
      {/* Backdrop */}
      <div className={`spotlight-backdrop-wrap ${transitioning ? 'fading' : ''}`}>
        {item.backdrop_path && (
          <Image
            src={imgUrl.backdrop(item.backdrop_path, 'original')}
            alt={title}
            fill
            priority
            className="spotlight-backdrop"
            style={{ objectFit: 'cover' }}
            unoptimized
          />
        )}
        <div className="spotlight-gradient" />
        <div className="spotlight-gradient-bottom" />
      </div>

      {/* Content */}
      <div className={`spotlight-content${transitioning ? ' fading' : ''}`}>
        {/* Index dots */}
        <div className="spotlight-dots">
          {items.map((_, i) => (
            <button
              key={i}
              className={`spotlight-dot${i === active ? ' active' : ''}`}
              onClick={() => goto(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="spotlight-meta-row">
          <span className="hero-badge"><Star size={11} fill="currentColor" /> Featured</span>
          <span className="spotlight-type-badge">{type === 'movie' ? 'Movie' : 'TV Series'}</span>
          <span className="spotlight-rating" style={{ color: ratingColor }}>
            <Star size={13} fill={ratingColor} /> {formatRating(rating)}
          </span>
          <span className="spotlight-year">{formatYear(date)}</span>
          {runtime && <span className="spotlight-runtime"><Clock size={12} /> {runtime}</span>}
        </div>

        <h1 className="spotlight-title">{title}</h1>

        {genres.length > 0 && (
          <div className="hero-genres">
            {genres.slice(0, 4).map((g) => (
              <span key={g.id} className="genre-pill" style={{ color: GENRE_COLORS[g.id] ?? '#94a3b8' }}>
                {g.name}
              </span>
            ))}
          </div>
        )}

        <p className="hero-overview">{item.overview}</p>

        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => router.push(watchHref)}>
            <Play size={18} fill="currentColor" /> Watch Now
          </button>
          <button className="btn btn-secondary" onClick={() => router.push(detailHref)}>
            <Info size={18} /> More Info
          </button>
        </div>
      </div>

      {/* Nav arrows */}
      <button className="spotlight-nav left" onClick={prev} aria-label="Previous">
        <ChevronLeft size={22} />
      </button>
      <button className="spotlight-nav right" onClick={next} aria-label="Next">
        <ChevronRight size={22} />
      </button>

    </section>
  );
}
