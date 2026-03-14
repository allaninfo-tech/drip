'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Play, Info, Star, Clock } from 'lucide-react';
import { imgUrl, formatYear, formatRating, formatRuntime, GENRE_COLORS } from '@/lib/constants';
import type { Movie, TVShow } from '@/lib/types';

interface HeroBannerProps {
  item: Movie | TVShow;
  type: 'movie' | 'tv';
}

function isMovie(item: Movie | TVShow): item is Movie {
  return 'title' in item;
}

export default function HeroBanner({ item, type }: HeroBannerProps) {
  const router = useRouter();
  const title = isMovie(item) ? item.title : item.name;
  const date = isMovie(item) ? item.release_date : item.first_air_date;
  const runtime = isMovie(item) && item.runtime ? formatRuntime(item.runtime) : null;
  const genres = item.genres ?? [];

  const watchHref = type === 'movie'
    ? `/watch/movie/${item.id}`
    : `/watch/tv/${item.id}/1/1`;
  const detailHref = `/${type}/${item.id}`;

  return (
    <section className="hero">
      {item.backdrop_path && (
        <Image
          src={imgUrl.backdrop(item.backdrop_path, 'original')}
          alt={title}
          fill
          priority
          className="hero-backdrop"
          style={{ objectFit: 'cover' }}
          unoptimized
        />
      )}
      <div className="hero-gradient" />
      <div className="hero-gradient-bottom" />
      <div className="hero-content">
        <span className="hero-badge">
          <Star size={11} fill="currentColor" /> Featured
        </span>
        <h1 className="hero-title">{title}</h1>
        <div className="hero-meta">
          <span className="hero-meta-item">
            <Star size={14} className="star" fill="#f59e0b" color="#f59e0b" />
            {formatRating(item.vote_average)}
          </span>
          <span className="hero-meta-item">{formatYear(date)}</span>
          {runtime && (
            <span className="hero-meta-item">
              <Clock size={13} /> {runtime}
            </span>
          )}
          <span className="hero-meta-item" style={{ color: 'var(--accent-secondary)', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: 700 }}>
            {type === 'movie' ? 'Movie' : 'TV Series'}
          </span>
        </div>
        {genres.length > 0 && (
          <div className="hero-genres">
            {genres.slice(0, 4).map((g) => (
              <span
                key={g.id}
                className="genre-pill"
                style={{ color: GENRE_COLORS[g.id] ?? '#94a3b8' }}
              >
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
    </section>
  );
}
