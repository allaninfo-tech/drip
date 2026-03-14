'use client';

import { useEffect, useState } from 'react';
import { X, Download, Shield, Info, Loader2 } from 'lucide-react';
import { embedSources } from '@/lib/constants';

interface DownloadModalProps {
  mediaId: number;
  type: 'movie' | 'tv';
  title: string;
  season?: number;
  episode?: number;
  onClose: () => void;
}

export default function DownloadModal({
  mediaId,
  type,
  title,
  season = 1,
  episode = 1,
  onClose,
}: DownloadModalProps) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const sources =
    type === 'movie'
      ? embedSources.movie(mediaId)
      : embedSources.tv(mediaId, season, episode);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    // We attempt to fetch a direct download link using a hypothetical or public scraping API
    // Since direct extraction from iframe providers on the client is blocked by CORS,
    // we would normally use a backend scraper. For this demo, we simulate extraction,
    // or provide the direct proxy link if we had a raw mp4 url.
    // Real extraction APIs (like consumables/TMDB scrapers) return the direct .mp4 or .m3u8 
    const attemptExtraction = async () => {
      try {
        setLoading(true);
        // Using a 3rd party generic extraction API or our own proxy scraper logic
        // For demonstration, since we don't have a built-in scraper, let's assume
        // we hit our own Next.js API that tries to scrape it:
        const res = await fetch(`/api/scrape?type=${type}&id=${mediaId}&s=${season}&e=${episode}`);
        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            setDownloadUrl(data.url);
            return;
          }
        }
        setError(true);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    attemptExtraction(); 
  }, [mediaId, type, season, episode]);

  const episodeLabel =
    type === 'tv'
      ? ` — S${String(season).padStart(2, '0')} E${String(episode).padStart(2, '0')}`
      : '';

  const safeFilename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}${
    type === 'tv' ? `_s${season}e${episode}` : ''
  }.mp4`;

  return (
    <div
      className="player-modal-overlay"
      style={{ zIndex: 500 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="player-modal"
        style={{ maxWidth: 560, borderRadius: 20, overflow: 'hidden', padding: 0 }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '20px 24px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-bright), var(--accent-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Download size={17} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
              Download
            </div>
            <div
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                marginTop: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {title}{episodeLabel}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'background 0.2s',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0', gap: 16 }}>
              <Loader2 className="animate-spin" size={32} color="var(--accent-bright)" />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Extracting direct video source...</p>
            </div>
          ) : downloadUrl ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: 20 }}>
              <div 
                style={{ 
                  width: 64, height: 64, borderRadius: '50%', 
                  background: 'rgba(34, 197, 94, 0.1)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}
              >
                <Download size={32} color="#22c55e" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>Ready to Download</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Direct MP4 video file extracted successfully.</p>
              </div>
              
              <a 
                href={`/api/download?url=${encodeURIComponent(downloadUrl)}&filename=${safeFilename}`}
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: '#fff',
                  padding: '12px 32px',
                  borderRadius: 100,
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 10px 20px -10px rgba(34,197,94,0.5)',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <Download size={18} />
                Download Video
              </a>
            </div>
          ) : (
            <>
              {/* Fallback flow if direct extraction fails */}
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: 12,
                  padding: '12px 16px',
                  marginBottom: 20,
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                }}
              >
                <Info size={15} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: '0.8rem', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
                  Direct extraction failed because the source providers blocked our scraper. We cannot provide a direct MP4 link here.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                  Manual Download Method:
                </p>
                {[
                  'Install "Video DownloadHelper" or IDM on your browser.',
                  'Click a stream server link below to open it in a new tab.',
                  'Play the video. Your downloader extension will intercept the video stream automatically.',
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: 'var(--text-secondary)',
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              {/* Server links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
                    marginBottom: 4,
                  }}
                >
                  Stream Servers
                </p>
                {sources.slice(0, 4).map((src, i) => (
                  <a
                    key={i}
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      textDecoration: 'none',
                      transition: 'all 0.18s',
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ flex: 1, fontSize: '0.85rem', fontWeight: 500 }}>
                      Server {i + 1}
                    </span>
                    <Shield size={14} color="var(--text-muted)" />
                  </a>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
