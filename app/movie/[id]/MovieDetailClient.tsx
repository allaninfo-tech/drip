'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Play, ArrowLeft, Star, Clock, Calendar, Globe, Download, Heart } from 'lucide-react';
import { FastAverageColor } from 'fast-average-color';
import { imgUrl, formatYear, formatRating, formatRuntime, GENRE_COLORS } from '@/lib/constants';
import VideoPlayer from '@/components/VideoPlayer';
import MediaCard from '@/components/MediaCard';
import TrailerModal from '@/components/TrailerModal';
import DownloadModal from '@/components/DownloadModal';
import Ripple from '@/components/Ripple';
import { useWatchlist } from '@/lib/useLocalStorage';
import type { Movie, MediaCredits } from '@/lib/types';

interface MovieDetailClientProps {
  movie: Movie;
  credits: MediaCredits;
  similar: Movie[];
  videos?: { key: string; site: string; type: string }[];
}

export default function MovieDetailClient({ movie, credits, similar, videos = [] }: MovieDetailClientProps) {
  const [showPlayer, setShowPlayer] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [ambientColor, setAmbientColor] = useState('rgba(5, 5, 8, 0)');
  const router = useRouter();
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const saved = isInWatchlist(movie.id);

  const director = credits.crew.find((c) => c.job === 'Director');
  const cast = credits.cast.slice(0, 16);
  const trailerKey = videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer')?.key;
  const rating = movie.vote_average;
  const ratingColor = rating >= 7.5 ? '#22c55e' : rating >= 5.5 ? '#f59e0b' : '#ef4444';

  const handleImageLoad = (e: any) => {
    if (!e.target || !e.target.naturalWidth) return;
    const fac = new FastAverageColor();
    try {
      const color = fac.getColor(e.target as HTMLImageElement, { silent: true });
      setAmbientColor(`rgba(${color.value[0]}, ${color.value[1]}, ${color.value[2]}, 0.55)`);
    } catch {}
  };

  return (
    <div style={{ '--ambient-color': ambientColor } as React.CSSProperties}>
      {/* ── Full-bleed Backdrop Hero ── */}
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
            crossOrigin="anonymous"
            onLoad={handleImageLoad}
          />
        )}
        <div className="detail-gradient ambilight" />
        <div className="detail-gradient-bottom" />

        {/* Two-column content area */}
        <div className="detail-content detail-content-2col">
          {/* Back button */}
          <button
            className="btn btn-secondary detail-back-btn"
            onClick={() => router.back()}
          >
            <ArrowLeft size={15} /> Back
          </button>

          {/* Poster */}
          {movie.poster_path && (
            <div className="detail-poster-wrap">
              <Image
                src={imgUrl.poster(movie.poster_path, 'w500')}
                alt={movie.title}
                width={260}
                height={390}
                className="detail-poster"
                unoptimized
              />
              {/* Watchlist heart below poster */}
              <button
                className={`detail-watchlist-btn${saved ? ' saved' : ''}`}
                onClick={() => toggleWatchlist(movie, 'movie')}
              >
                <Heart size={15} fill={saved ? 'currentColor' : 'none'} />
                {saved ? 'In My List' : 'Add to My List'}
              </button>
            </div>
          )}

          {/* Info */}
          <div className="detail-info">
            <h1 className="detail-title">{movie.title}</h1>
            {movie.tagline && <p className="detail-tagline">"{movie.tagline}"</p>}

            {/* Meta chips */}
            <div className="detail-meta">
              <span className="detail-meta-chip" style={{ color: ratingColor, borderColor: ratingColor + '44' }}>
                <Star size={13} fill={ratingColor} /> {formatRating(rating)}
              </span>
              <span className="detail-meta-chip">
                <Calendar size={13} /> {formatYear(movie.release_date)}
              </span>
              {movie.runtime && (
                <span className="detail-meta-chip">
                  <Clock size={13} /> {formatRuntime(movie.runtime)}
                </span>
              )}
              <span className="detail-meta-chip">
                <Globe size={13} /> {movie.original_language.toUpperCase()}
              </span>
              {movie.status && (
                <span className="detail-meta-chip">{movie.status}</span>
              )}
            </div>

            {/* Genre pills */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="hero-genres" style={{ marginBottom: 20 }}>
                {movie.genres.map((g) => (
                  <span key={g.id} className="genre-pill" style={{ color: GENRE_COLORS[g.id] ?? '#94a3b8' }}>
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <p className="detail-overview">{movie.overview}</p>

            {director && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 28 }}>
                <strong style={{ color: 'var(--text-primary)' }}>Directed by</strong>{' '}
                {director.name}
              </p>
            )}

            {/* Action buttons */}
            <div className="hero-actions" style={{ flexWrap: 'wrap' }}>
              <Ripple color="rgba(0,0,0,0.2)" className="btn btn-primary" style={{ padding: 0, border: 'none' }}>
                <button className="btn btn-primary" onClick={() => setShowPlayer(true)} style={{ margin: 0, width: '100%' }}>
                  <Play size={18} fill="currentColor" /> Watch Now
                </button>
              </Ripple>
              {trailerKey && (
                <Ripple color="rgba(255,255,255,0.2)" className="btn btn-secondary" style={{ padding: 0, border: 'none', background: 'transparent' }}>
                  <button className="btn btn-secondary" onClick={() => setShowTrailer(true)} style={{ margin: 0, width: '100%' }}>
                    <Play size={18} /> Trailer
                  </button>
                </Ripple>
              )}
              <Ripple color="rgba(255,255,255,0.2)" className="btn btn-download" style={{ padding: 0, border: 'none', background: 'transparent' }}>
                <button className="btn btn-download" onClick={() => setShowDownload(true)} style={{ margin: 0, width: '100%' }}>
                  <Download size={16} /> Download
                </button>
              </Ripple>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cast ── */}
      {cast.length > 0 && (
        <div className="detail-body">
          <h2 className="section-heading">Cast</h2>
          <div className="cast-scroll-row">
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

      {/* ── Similar Movies ── */}
      {similar.length > 0 && (
        <div className="detail-body">
          <h2 className="section-heading">More Like This</h2>
          <div className="media-grid">
            {similar.slice(0, 20).map((m) => (
              <MediaCard key={m.id} media={m} type="movie" />
            ))}
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {showPlayer && (
        <VideoPlayer
          mediaId={movie.id}
          type="movie"
          title={movie.title}
          onClose={() => setShowPlayer(false)}
        />
      )}
      {showTrailer && trailerKey && (
        <TrailerModal
          trailerKey={trailerKey}
          isOpen={showTrailer}
          onClose={() => setShowTrailer(false)}
        />
      )}
      {showDownload && (
        <DownloadModal
          mediaId={movie.id}
          type="movie"
          title={movie.title}
          onClose={() => setShowDownload(false)}
        />
      )}
    </div>
  );
}
