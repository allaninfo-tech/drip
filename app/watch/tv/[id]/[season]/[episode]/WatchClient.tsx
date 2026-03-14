'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle, Play, Shield } from 'lucide-react';
import { embedSources } from '@/lib/constants';

interface WatchClientProps {
  sources: string[];
  title: string;
  type: 'movie' | 'tv';
  mediaId: number;
  initialSeason?: number;
  initialEpisode?: number;
  totalSeasons?: number;
  episodeCounts?: number[];
  backdropPath?: string | null;
  overview?: string;
}

const SOURCE_NAMES = ['VidLink', 'VidSrc', 'MultiEmbed', '2Embed', 'AutoEmbed'];

export default function WatchClient({
  title,
  type,
  mediaId,
  initialSeason = 1,
  initialEpisode = 1,
  totalSeasons = 1,
  episodeCounts = [],
  overview,
}: WatchClientProps) {
  const [srcIdx, setSrcIdx] = useState(0);
  const [season, setSeason] = useState(initialSeason);
  const [episode, setEpisode] = useState(initialEpisode);
  const [activated, setActivated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const currentSources =
    type === 'movie'
      ? embedSources.movie(mediaId)
      : embedSources.tv(mediaId, season, episode);

  const currentSrc = currentSources[srcIdx];
  const maxEps = episodeCounts[season - 1] ?? 24;
  const srcName = SOURCE_NAMES[srcIdx] ?? `Source ${srcIdx + 1}`;

  const handlePlay = () => {
    setActivated(true);
    setLoading(true);
    setError(false);
  };

  const changeSource = (i: number) => {
    setSrcIdx(i);
    setActivated(false);
    setLoading(false);
    setError(false);
  };

  const changeEpisode = (newSeason: number, newEpisode: number) => {
    setSeason(newSeason);
    setEpisode(newEpisode);
    setSrcIdx(0);
    setActivated(false);
    setLoading(false);
    setError(false);
  };

  return (
    <div className="watch-page">
      <div className="watch-player-wrap">

        {/* Click-to-play overlay */}
        {!activated && (
          <div className="watch-cta-overlay">
            <button className="player-big-play" onClick={handlePlay} aria-label="Play">
              <Play size={48} fill="#fff" color="#fff" />
            </button>
            <p className="watch-cta-caption">
              Click to stream
              {type === 'tv' && ` S${String(season).padStart(2,'0')}E${String(episode).padStart(2,'0')}`}
              {' '}via <strong>{srcName}</strong>
            </p>
            <div className="player-adblock-tip" style={{ marginTop: 12 }}>
              <Shield size={13} />
              Ad-free experience: use <strong>uBlock Origin</strong> or <strong>Brave</strong>
            </div>
          </div>
        )}

        {activated && loading && !error && (
          <div className="player-loading" style={{ position: 'absolute', inset: 0, background: '#000', zIndex: 5 }}>
            <div className="player-spinner" />
            <p className="player-loading-text">Connecting to {srcName}…</p>
          </div>
        )}

        {error && (
          <div className="player-loading" style={{ position: 'absolute', inset: 0, background: '#000', zIndex: 5 }}>
            <AlertCircle size={52} color="#ef4444" />
            <p className="player-loading-text">No stream on {srcName}.</p>
            {srcIdx < currentSources.length - 1 && (
              <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => changeSource(srcIdx + 1)}>
                Try {SOURCE_NAMES[srcIdx + 1] ?? `Source ${srcIdx + 2}`} →
              </button>
            )}
          </div>
        )}

        {activated && !error && (
          <iframe
            key={`${mediaId}-${season}-${episode}-${srcIdx}`}
            src={currentSrc}
            className="watch-iframe"
            allowFullScreen
            allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="no-referrer"
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setError(true); }}
            title={title}
          />
        )}
      </div>

      <div className="watch-info">
        <button className="btn btn-secondary" onClick={() => router.back()}
          style={{ marginBottom: 20, padding: '8px 16px', fontSize: '0.82rem' }}>
          <ArrowLeft size={15} /> Back
        </button>
        <h1 className="watch-info-title">
          {title}
          {type === 'tv' && ` — S${String(season).padStart(2, '0')}E${String(episode).padStart(2, '0')}`}
        </h1>

        {type === 'tv' && (
          <div className="watch-ep-controls">
            <select className="ep-select" value={season} onChange={(e) => changeEpisode(Number(e.target.value), 1)}>
              {Array.from({ length: totalSeasons }, (_, i) => (
                <option key={i + 1} value={i + 1}>Season {i + 1}</option>
              ))}
            </select>
            <select className="ep-select" value={episode} onChange={(e) => changeEpisode(season, Number(e.target.value))}>
              {Array.from({ length: maxEps }, (_, i) => (
                <option key={i + 1} value={i + 1}>Episode {i + 1}</option>
              ))}
            </select>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Stream source:</span>
          {currentSources.map((_, i) => (
            <button key={i} className={`source-btn${srcIdx === i ? ' active' : ''}`} onClick={() => changeSource(i)}>
              {SOURCE_NAMES[i] ?? `Source ${i + 1}`}
            </button>
          ))}
        </div>

        {overview && (
          <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: 720 }}>
            {overview}
          </p>
        )}
      </div>
    </div>
  );
}
