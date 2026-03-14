'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Play, ArrowLeft, Star, Clock, Calendar, Globe } from 'lucide-react';
import { imgUrl, formatYear, formatRating, formatRuntime, GENRE_COLORS } from '@/lib/constants';
import VideoPlayer from '@/components/VideoPlayer';
import MediaCard from '@/components/MediaCard';
import type { Movie, MediaCredits, TVShow } from '@/lib/types';

interface MovieDetailClientProps {
  movie: Movie;
  credits: MediaCredits;
  similar: Movie[];
}

export default function MovieDetailClient({ movie, credits, similar }: MovieDetailClientProps) {
  const [showPlayer, setShowPlayer] = useState(false);
  const router = useRouter();

  const director = credits.crew.find((c) => c.job === 'Director');
  const cast = credits.cast.slice(0, 12);

  return (
    <div>
      {/* Detail Hero */}
      <section className="detail-hero">
        {movie.backdrop_path && (
          <Image
            src={imgUrl.backdrop(movie.backdrop_path, 'original')}
            alt={movie.title}
            fill
            priority
            className="detail-backdrop"
            style={{ objectFit: 'cover' }}
            unoptimized
          />
        )}
        <div className="detail-gradient" />
        <div className="detail-content">
          <button
            className="btn btn-secondary"
            onClick={() => router.back()}
            style={{ marginBottom: 24, padding: '8px 16px', fontSize: '0.82rem' }}
          >
            <ArrowLeft size={15} /> Back
          </button>
          {movie.poster_path && (
            <Image
              src={imgUrl.poster(movie.poster_path, 'w342')}
              alt={movie.title}
              width={180}
              height={270}
              className="detail-poster"
              unoptimized
            />
          )}
          <h1 className="detail-title">{movie.title}</h1>
          {movie.tagline && <p className="detail-tagline">{movie.tagline}</p>}
          <div className="detail-meta">
            <span className="detail-meta-chip"><Star size={14} fill="#f59e0b" color="#f59e0b" /> {formatRating(movie.vote_average)}</span>
            <span className="detail-meta-chip"><Calendar size={14} /> {formatYear(movie.release_date)}</span>
            {movie.runtime && <span className="detail-meta-chip"><Clock size={14} /> {formatRuntime(movie.runtime)}</span>}
            <span className="detail-meta-chip"><Globe size={14} /> {movie.original_language.toUpperCase()}</span>
          </div>
          {movie.genres && movie.genres.length > 0 && (
            <div className="hero-genres">
              {movie.genres.map((g) => (
                <span key={g.id} className="genre-pill" style={{ color: GENRE_COLORS[g.id] ?? '#94a3b8' }}>{g.name}</span>
              ))}
            </div>
          )}
          <p className="detail-overview">{movie.overview}</p>
          {director && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Directed by</strong> {director.name}
            </p>
          )}
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => setShowPlayer(true)}>
              <Play size={18} fill="currentColor" /> Watch Now
            </button>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="detail-body">
        {/* Cast */}
        {cast.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <h2 className="section-heading">Cast</h2>
            <div className="cast-grid">
              {cast.map((c) => (
                <div key={c.id} className="cast-card">
                  <Image
                    src={imgUrl.profile(c.profile_path)}
                    alt={c.name}
                    width={80}
                    height={80}
                    className="cast-avatar"
                    unoptimized
                  />
                  <p className="cast-name">{c.name}</p>
                  <p className="cast-character">{c.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Movies */}
        {similar.length > 0 && (
          <div>
            <h2 className="section-heading">Similar Movies</h2>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {similar.slice(0, 12).map((m) => (
                <MediaCard key={m.id} media={m} type="movie" />
              ))}
            </div>
          </div>
        )}
      </div>

      {showPlayer && (
        <VideoPlayer
          mediaId={movie.id}
          type="movie"
          title={movie.title}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </div>
  );
}
