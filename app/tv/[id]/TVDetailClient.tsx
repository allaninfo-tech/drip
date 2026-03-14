'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Play, ArrowLeft, Star, Calendar, Tv, Download, Heart } from 'lucide-react';
import { FastAverageColor } from 'fast-average-color';
import { imgUrl, formatYear, formatRating, GENRE_COLORS } from '@/lib/constants';
import VideoPlayer from '@/components/VideoPlayer';
import MediaCard from '@/components/MediaCard';
import TrailerModal from '@/components/TrailerModal';
import DownloadModal from '@/components/DownloadModal';
import Ripple from '@/components/Ripple';
import { useWatchlist } from '@/lib/useLocalStorage';
import type { TVShow, MediaCredits } from '@/lib/types';

interface TVDetailClientProps {
  show: TVShow;
  credits: MediaCredits;
  similar: TVShow[];
  videos?: { key: string; site: string; type: string }[];
}

export default function TVDetailClient({ show, credits, similar, videos = [] }: TVDetailClientProps) {
  const [showPlayer, setShowPlayer] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [ambientColor, setAmbientColor] = useState('rgba(5, 5, 8, 0)');
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const router = useRouter();

  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const saved = isInWatchlist(show.id);

  const creator = show.created_by?.[0];
  const cast = credits.cast.slice(0, 16);
  const trailerKey = videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer')?.key;
  const totalSeasons = show.number_of_seasons ?? 1;
  const rating = show.vote_average;
  const ratingColor = rating >= 7.5 ? '#22c55e' : rating >= 5.5 ? '#f59e0b' : '#ef4444';

  // Build episodeCounts array (indexed by season number)
  const episodeCountsArr: number[] = show.seasons
    ?.filter((s) => s.season_number > 0)
    .sort((a, b) => a.season_number - b.season_number)
    .map((s) => s.episode_count) ?? [];

  const episodeCountsRecord: Record<number, number> = show.seasons
    ?.filter((s) => s.season_number > 0)
    .reduce((acc, s) => ({ ...acc, [s.season_number]: s.episode_count }), {} as Record<number, number>) ?? {};

  const maxEpisodesForSeason = episodeCountsRecord[selectedSeason] ?? 24;

  const handleImageLoad = (e: any) => {
    if (!e.target || !e.target.naturalWidth) return;
    const fac = new FastAverageColor();
    try {
      const color = fac.getColor(e.target as HTMLImageElement, { silent: true });
      setAmbientColor(`rgba(${color.value[0]}, ${color.value[1]}, ${color.value[2]}, 0.55)`);
    } catch {}
  };

  const handleWatch = () => {
    setShowPlayer(true);
  };

  return (
    <div style={{ '--ambient-color': ambientColor } as React.CSSProperties}>
      {/* ── Full-bleed Backdrop Hero ── */}
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
            crossOrigin="anonymous"
            onLoad={handleImageLoad}
          />
        )}
        <div className="detail-gradient ambilight" />
        <div className="detail-gradient-bottom" />

        {/* Two-column content area */}
        <div className="detail-content detail-content-2col">
          <button
            className="btn btn-secondary detail-back-btn"
            onClick={() => router.back()}
          >
            <ArrowLeft size={15} /> Back
          </button>

          {/* Poster */}
          {show.poster_path && (
            <div className="detail-poster-wrap">
              <Image
                src={imgUrl.poster(show.poster_path, 'w500')}
                alt={show.name}
                width={260}
                height={390}
                className="detail-poster"
                unoptimized
              />
              <button
                className={`detail-watchlist-btn${saved ? ' saved' : ''}`}
                onClick={() => toggleWatchlist(show, 'tv')}
              >
                <Heart size={15} fill={saved ? 'currentColor' : 'none'} />
                {saved ? 'In My List' : 'Add to My List'}
              </button>
            </div>
          )}

          {/* Info */}
          <div className="detail-info">
            <h1 className="detail-title">{show.name}</h1>
            {show.tagline && <p className="detail-tagline">"{show.tagline}"</p>}

            <div className="detail-meta">
              <span className="detail-meta-chip" style={{ color: ratingColor, borderColor: ratingColor + '44' }}>
                <Star size={13} fill={ratingColor} /> {formatRating(rating)}
              </span>
              <span className="detail-meta-chip">
                <Calendar size={13} /> {formatYear(show.first_air_date)}
              </span>
              <span className="detail-meta-chip">
                <Tv size={13} /> {totalSeasons} Season{totalSeasons > 1 ? 's' : ''}
              </span>
              {show.status && (
                <span className="detail-meta-chip">{show.status}</span>
              )}
            </div>

            {show.genres && show.genres.length > 0 && (
              <div className="hero-genres" style={{ marginBottom: 20 }}>
                {show.genres.map((g) => (
                  <span key={g.id} className="genre-pill" style={{ color: GENRE_COLORS[g.id] ?? '#94a3b8' }}>
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <p className="detail-overview">{show.overview}</p>

            {creator && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
                <strong style={{ color: 'var(--text-primary)' }}>Created by</strong>{' '}
                {creator.name}
              </p>
            )}

            {/* ── Season & Episode Selector ── */}
            <div className="ep-selector-section">
              {/* Season pills */}
              <div className="ep-selector-label">Season</div>
              <div className="ep-season-pills">
                {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((s) => (
                  <button
                    key={s}
                    className={`ep-pill${selectedSeason === s ? ' active' : ''}`}
                    onClick={() => { setSelectedSeason(s); setSelectedEpisode(1); }}
                  >
                    S{s}
                  </button>
                ))}
              </div>

              {/* Episode pills (scroll if many) */}
              <div className="ep-selector-label" style={{ marginTop: 12 }}>
                Episode
                <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 6 }}>
                  ({maxEpisodesForSeason} total)
                </span>
              </div>
              <div className="ep-episode-pills">
                {Array.from({ length: Math.min(maxEpisodesForSeason, 50) }, (_, i) => i + 1).map((ep) => (
                  <button
                    key={ep}
                    className={`ep-pill ep-num-pill${selectedEpisode === ep ? ' active' : ''}`}
                    onClick={() => setSelectedEpisode(ep)}
                  >
                    {ep}
                  </button>
                ))}
                {maxEpisodesForSeason > 50 && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center', paddingLeft: 4 }}>
                    +{maxEpisodesForSeason - 50} more
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="hero-actions" style={{ flexWrap: 'wrap', marginTop: 4 }}>
              <Ripple color="rgba(0,0,0,0.2)" className="btn btn-primary" style={{ padding: 0, border: 'none' }}>
                <button className="btn btn-primary" onClick={handleWatch} style={{ margin: 0, width: '100%' }}>
                  <Play size={18} fill="currentColor" />
                  Watch S{selectedSeason} E{selectedEpisode}
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

      {/* ── Similar Shows ── */}
      {similar.length > 0 && (
        <div className="detail-body">
          <h2 className="section-heading">More Like This</h2>
          <div className="media-grid">
            {similar.slice(0, 20).map((m) => (
              <MediaCard key={m.id} media={m} type="tv" />
            ))}
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {showPlayer && (
        <VideoPlayer
          mediaId={show.id}
          type="tv"
          title={show.name}
          totalSeasons={totalSeasons}
          initialSeason={selectedSeason}
          initialEpisode={selectedEpisode}
          episodeCounts={episodeCountsArr}
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
          mediaId={show.id}
          type="tv"
          title={show.name}
          season={selectedSeason}
          episode={selectedEpisode}
          onClose={() => setShowDownload(false)}
        />
      )}
    </div>
  );
}
