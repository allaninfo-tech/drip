'use client';

import { useState } from 'react';
import { X, AlertCircle, Play, Shield } from 'lucide-react';
import { embedSources } from '@/lib/constants';

interface VideoPlayerProps {
  mediaId: number;
  type: 'movie' | 'tv';
  title: string;
  posterPath?: string | null;
  totalSeasons?: number;
  initialSeason?: number;
  initialEpisode?: number;
  episodeCounts?: number[];
  onClose: () => void;
}

const SOURCE_NAMES = ['VidLink', 'VidSrc', 'MultiEmbed', '2Embed', 'AutoEmbed'];

export default function VideoPlayer({
  mediaId,
  type,
  title,
  totalSeasons = 1,
  initialSeason = 1,
  initialEpisode = 1,
  episodeCounts = [],
  onClose,
}: VideoPlayerProps) {
  const [season, setSeason] = useState(initialSeason);
  const [episode, setEpisode] = useState(initialEpisode);
  const [sourceIdx, setSourceIdx] = useState(0);
  // Key strategy: user must click play before iframe loads — prevents auto-redirect scripts
  const [activated, setActivated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const sources =
    type === 'movie'
      ? embedSources.movie(mediaId)
      : embedSources.tv(mediaId, season, episode);

  const currentSrc = sources[sourceIdx];

  const handlePlay = () => {
    setActivated(true);
    setLoading(true);
    setError(false);
  };

  const handleSource = (idx: number) => {
    setSourceIdx(idx);
    setActivated(false); // Reset — user must click play again for new source
    setLoading(false);
    setError(false);
  };

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSeason(Number(e.target.value));
    setEpisode(1);
    setActivated(false);
    setLoading(false);
    setError(false);
  };

  const handleEpisodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEpisode(Number(e.target.value));
    setActivated(false);
    setLoading(false);
    setError(false);
  };

  const maxEpisodes = episodeCounts[season - 1] ?? 24;
  const srcName = SOURCE_NAMES[sourceIdx] ?? `Source ${sourceIdx + 1}`;

  return (
    <div className="player-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="player-modal">

        {/* ── Header ─────────────────────────────────── */}
        <div className="player-header">
          <div className="player-title">
            <span>{title}</span>
            {type === 'tv' && (
              <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.82rem' }}>
                S{String(season).padStart(2, '0')} E{String(episode).padStart(2, '0')}
              </span>
            )}
            <span className="player-source-badge">{srcName}</span>
          </div>
          <button className="player-close" onClick={onClose} aria-label="Close player">
            <X size={18} />
          </button>
        </div>

        {/* ── Player Area ─────────────────────────────── */}
        <div className="player-iframe-wrap">

          {/* Click-to-play overlay — shown before user activates */}
          {!activated && (
            <div className="player-cta-overlay">
              <div className="player-cta-inner">
                <button className="player-big-play" onClick={handlePlay} aria-label="Play">
                  <Play size={36} fill="#fff" color="#fff" />
                </button>
                <p className="player-cta-title">Tap to start streaming</p>
                <p className="player-cta-hint">
                  Using <strong>{srcName}</strong> · Switch sources below if it doesn&apos;t load
                </p>
                <div className="player-adblock-tip">
                  <Shield size={13} />
                  For best experience, use <strong>uBlock Origin</strong> or <strong>Brave browser</strong>
                </div>
              </div>
            </div>
          )}

          {/* Loading spinner — shown after click while iframe loads */}
          {activated && loading && !error && (
            <div className="player-loading">
              <div className="player-spinner" />
              <p className="player-loading-text">Connecting to {srcName}…</p>
            </div>
          )}

          {/* Error state */}
          {error && activated && (
            <div className="player-loading">
              <AlertCircle size={48} color="#ef4444" />
              <p className="player-loading-text">No stream on {srcName}. Try another source below.</p>
              {sourceIdx < sources.length - 1 && (
                <button
                  className="btn btn-primary"
                  style={{ marginTop: 12 }}
                  onClick={() => handleSource(sourceIdx + 1)}
                >
                  Try {SOURCE_NAMES[sourceIdx + 1] ?? `Source ${sourceIdx + 2}`} →
                </button>
              )}
            </div>
          )}

          {/* The actual iframe — only rendered after user clicks Play */}
          {activated && !error && (
            <iframe
              key={`${currentSrc}-${season}-${episode}`}
              src={currentSrc}
              className="player-iframe"
              allowFullScreen
              allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
              onLoad={() => setLoading(false)}
              onError={() => { setLoading(false); setError(true); }}
              title={title}
              referrerPolicy="no-referrer"
            />
          )}
        </div>

        {/* ── Footer: Sources + Episode Picker ────────── */}
        <div className="player-footer">
          <div className="player-source-selector">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Source:</span>
            {sources.map((_, i) => (
              <button
                key={i}
                className={`source-btn${sourceIdx === i ? ' active' : ''}`}
                onClick={() => handleSource(i)}
              >
                {SOURCE_NAMES[i] ?? `#${i + 1}`}
              </button>
            ))}
          </div>
          {type === 'tv' && (
            <div className="player-episode-picker">
              <select className="ep-select" value={season} onChange={handleSeasonChange}>
                {Array.from({ length: totalSeasons }, (_, i) => (
                  <option key={i + 1} value={i + 1}>Season {i + 1}</option>
                ))}
              </select>
              <select className="ep-select" value={episode} onChange={handleEpisodeChange}>
                {Array.from({ length: maxEpisodes }, (_, i) => (
                  <option key={i + 1} value={i + 1}>Episode {i + 1}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
