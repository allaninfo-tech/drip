'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Play, ArrowLeft, Star, Clock, Calendar, Tv } from 'lucide-react';
import { imgUrl, formatYear, formatRating, GENRE_COLORS } from '@/lib/constants';
import VideoPlayer from '@/components/VideoPlayer';
import MediaCard from '@/components/MediaCard';
import type { TVShow, MediaCredits } from '@/lib/types';

interface TVDetailClientProps {
  show: TVShow;
  credits: MediaCredits;
  similar: TVShow[];
}

export default function TVDetailClient({ show, credits, similar }: TVDetailClientProps) {
  const [showPlayer, setShowPlayer] = useState(false);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const router = useRouter();

  const cast = credits.cast.slice(0, 12);
  const totalSeasons = show.number_of_seasons ?? 1;
  const episodeCounts = show.seasons
    ?.filter((s) => s.season_number > 0)
    .map((s) => s.episode_count) ?? [];

  return (
    <div>
      <section className="detail-hero">
        {show.backdrop_path && (
          <Image
            src={imgUrl.backdrop(show.backdrop_path, 'original')}
            alt={show.name}
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
          {show.poster_path && (
            <Image
              src={imgUrl.poster(show.poster_path, 'w342')}
              alt={show.name}
              width={180}
              height={270}
              className="detail-poster"
              unoptimized
            />
          )}
          <h1 className="detail-title">{show.name}</h1>
          {show.tagline && <p className="detail-tagline">{show.tagline}</p>}
          <div className="detail-meta">
            <span className="detail-meta-chip"><Star size={14} fill="#f59e0b" color="#f59e0b" /> {formatRating(show.vote_average)}</span>
            <span className="detail-meta-chip"><Calendar size={14} /> {formatYear(show.first_air_date)}</span>
            <span className="detail-meta-chip"><Tv size={14} /> {totalSeasons} Season{totalSeasons > 1 ? 's' : ''}</span>
          </div>
          {show.genres && show.genres.length > 0 && (
            <div className="hero-genres">
              {show.genres.map((g) => (
                <span key={g.id} className="genre-pill" style={{ color: GENRE_COLORS[g.id] ?? '#94a3b8' }}>{g.name}</span>
              ))}
            </div>
          )}
          <p className="detail-overview">{show.overview}</p>

          {/* Episode Picker */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            <select
              className="ep-select"
              value={season}
              onChange={(e) => { setSeason(Number(e.target.value)); setEpisode(1); }}
            >
              {Array.from({ length: totalSeasons }, (_, i) => (
                <option key={i + 1} value={i + 1}>Season {i + 1}</option>
              ))}
            </select>
            <select
              className="ep-select"
              value={episode}
              onChange={(e) => setEpisode(Number(e.target.value))}
            >
              {Array.from({ length: episodeCounts[season - 1] ?? 24 }, (_, i) => (
                <option key={i + 1} value={i + 1}>Episode {i + 1}</option>
              ))}
            </select>
          </div>

          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => setShowPlayer(true)}>
              <Play size={18} fill="currentColor" /> Watch S{String(season).padStart(2,'0')}E{String(episode).padStart(2,'0')}
            </button>
          </div>
        </div>
      </section>

      <div className="detail-body">
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

        {similar.length > 0 && (
          <div>
            <h2 className="section-heading">Similar Shows</h2>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {similar.slice(0, 12).map((s) => (
                <MediaCard key={s.id} media={s} type="tv" />
              ))}
            </div>
          </div>
        )}
      </div>

      {showPlayer && (
        <VideoPlayer
          mediaId={show.id}
          type="tv"
          title={show.name}
          totalSeasons={totalSeasons}
          initialSeason={season}
          initialEpisode={episode}
          episodeCounts={episodeCounts}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </div>
  );
}
