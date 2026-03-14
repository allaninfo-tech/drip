'use client';

import { useState, useEffect } from 'react';
import { X, AlertCircle, Play, Shield, ExternalLink } from 'lucide-react';
import { embedSources } from '@/lib/constants';
import FocusKeeper from '@/components/FocusKeeper';
import { useContinueWatching } from '@/lib/useLocalStorage';

interface VideoPlayerProps {
  mediaId: number;
  type: 'movie' | 'tv';
  title: string;
  totalSeasons?: number;
  initialSeason?: number;
  initialEpisode?: number;
  episodeCounts?: number[];
  onClose: () => void;
}

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
  const [activated, setActivated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { addToHistory, updateProgress } = useContinueWatching();

  // Fake progress tracker since we can't read cross-origin iframe state
  useEffect(() => {
    if (!activated) return;
    let currentProgress = 5; // Start at 5%
    const interval = setInterval(() => {
      currentProgress = Math.min(currentProgress + 1, 95); // cap at 95%
      updateProgress(mediaId, currentProgress);
    }, 60000); // ++ every 60 seconds

    // Immediately set a base progress so it shows up in UI
    updateProgress(mediaId, currentProgress);

    return () => clearInterval(interval);
  }, [activated, mediaId, updateProgress]);

  const sources =
    type === 'movie'
      ? embedSources.movie(mediaId)
      : embedSources.tv(mediaId, season, episode);

  const currentSrc = sources[sourceIdx];
  // Abstract label — users don't need to know the provider name
  const srcLabel = `Server ${sourceIdx + 1}`;

  const handlePlay = () => { 
    setActivated(true); 
    setLoading(true); 
    setError(false);
    
    // Save to continue watching history
    // Minimal mock object since the actual hooks need full Movie/TV object,
    // but we only have basic props here. Let's pass what we have.
    addToHistory(
      { id: mediaId, title, name: title, poster_path: '', backdrop_path: '', vote_average: 0, overview: '' } as any, 
      type
    );
  };

  const handleSource = (idx: number) => {
    setSourceIdx(idx);
    setActivated(false);
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
  const nextLabel = `Server ${sourceIdx + 2}`;

  return (
    <div className="player-modal-overlay">
      <FocusKeeper />
      <div className="player-modal">

        {/* Header */}
        <div className="player-header">
          <div className="player-title">
            <span>{title}</span>
            {type === 'tv' && (
              <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.82rem' }}>
                S{String(season).padStart(2, '0')} E{String(episode).padStart(2, '0')}
              </span>
            )}
            <span className="player-source-badge">
              <Shield size={10} /> {srcLabel}
            </span>
          </div>
          <button className="player-close" onClick={onClose} aria-label="Close player">
            <X size={18} />
          </button>
        </div>

        {/* Player */}
        <div className="player-iframe-wrap">

          {/* Click-to-play overlay */}
          {!activated && (
            <div className="player-cta-overlay">
              <div className="player-cta-inner">
                <button className="player-big-play" onClick={handlePlay} aria-label="Play">
                  <Play size={36} fill="#fff" color="#fff" />
                </button>
                <p className="player-cta-title">Tap to start streaming</p>
                <p className="player-cta-hint">
                  Using <strong>{srcLabel}</strong> · Switch below if this one doesn&apos;t work
                </p>
                <div className="player-adblock-tip">
                  <Shield size={13} />
                  Tip: Use <strong>Brave browser</strong> or <strong>uBlock Origin</strong> for fewer interruptions
                </div>
              </div>
            </div>
          )}

          {/* Loading spinner */}
          {activated && loading && !error && (
            <div className="player-loading">
              <div className="player-spinner" />
              <p className="player-loading-text">Connecting to {srcLabel}…</p>
            </div>
          )}

          {/* Error */}
          {error && activated && (
            <div className="player-loading">
              <AlertCircle size={48} color="#ef4444" />
              <p className="player-loading-text">{srcLabel} is unavailable. Try another.</p>
              {sourceIdx < sources.length - 1 && (
                <button className="btn btn-primary" style={{ marginTop: 12 }}
                  onClick={() => handleSource(sourceIdx + 1)}>
                  Try {nextLabel} →
                </button>
              )}
            </div>
          )}

          {/* Iframe — only mounted after play clicked */}
          {activated && !error && (
            <iframe
              key={`${currentSrc}-${season}-${episode}`}
              src={currentSrc}
              className="player-iframe"
              allowFullScreen
              allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
              referrerPolicy="no-referrer"
              onLoad={() => setLoading(false)}
              onError={() => { setLoading(false); setError(true); }}
              title={title}
            />
          )}
        </div>

        {/* Footer */}
        <div className="player-footer">
          <div className="player-source-selector">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Stream:</span>
            {sources.map((_, i) => (
              <button
                key={i}
                className={`source-btn${sourceIdx === i ? ' active' : ''}`}
                onClick={() => handleSource(i)}
              >
                Server {i + 1}
              </button>
            ))}
          </div>
          {/* Download: open current source in new tab */}
          <a
            href={currentSrc}
            target="_blank"
            rel="noopener noreferrer"
            title="Open stream in new tab to download"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 8,
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
              color: '#4ade80', fontSize: '0.78rem', fontWeight: 700,
              textDecoration: 'none', transition: 'all 0.18s', flexShrink: 0,
            }}
          >
            <ExternalLink size={13} /> Download
          </a>
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
