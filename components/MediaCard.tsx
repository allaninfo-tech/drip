'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, Play } from 'lucide-react';
import { imgUrl, formatYear, formatRating } from '@/lib/constants';
import type { Movie, TVShow, SearchResult } from '@/lib/types';

type CardMedia = Movie | TVShow | SearchResult;

interface MediaCardProps {
  media: CardMedia;
  type: 'movie' | 'tv';
  priority?: boolean;
}

function getTitle(m: CardMedia): string {
  if ('title' in m && m.title) return m.title;
  if ('name' in m && m.name) return m.name;
  return 'Unknown';
}

function getDate(m: CardMedia): string {
  if ('release_date' in m && m.release_date) return m.release_date;
  if ('first_air_date' in m && m.first_air_date) return m.first_air_date;
  return '';
}

function getRatingColor(rating: number): string {
  if (rating >= 7.5) return '#22c55e';
  if (rating >= 5.5) return '#f59e0b';
  return '#ef4444';
}

export default function MediaCard({ media, type, priority = false }: MediaCardProps) {
  const router = useRouter();
  const title = getTitle(media);
  const year = formatYear(getDate(media));
  const rating = media.vote_average;
  const ratingStr = formatRating(rating);
  const ratingColor = getRatingColor(rating);

  return (
    <div
      className="media-card"
      onClick={() => router.push(`/${type}/${media.id}`)}
      role="button"
      aria-label={`Watch ${title}`}
    >
      <div style={{ position: 'relative', aspectRatio: '2/3' }}>
        <Image
          src={imgUrl.poster(media.poster_path, 'w342')}
          alt={title}
          fill
          sizes="(max-width: 768px) 130px, 160px"
          className="media-card-poster"
          priority={priority}
          style={{ objectFit: 'cover' }}
          unoptimized
        />
        {/* Type badge */}
        <span className="card-type-badge">{type === 'movie' ? 'MOVIE' : 'TV'}</span>

        {/* Hover overlay */}
        <div className="media-card-overlay">
          <div className="media-card-play">
            <Play size={20} fill="#fff" color="#fff" />
          </div>
        </div>
      </div>

      <div className="media-card-info">
        <p className="media-card-title">{title}</p>
        <div className="media-card-meta">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{year}</span>
          <span className="media-card-rating" style={{ color: ratingColor }}>
            <Star size={11} fill={ratingColor} />
            {ratingStr}
          </span>
        </div>
      </div>
    </div>
  );
}
