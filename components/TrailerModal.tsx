'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface TrailerModalProps {
  trailerKey: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function TrailerModal({ trailerKey, isOpen, onClose }: TrailerModalProps) {
  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !trailerKey) return null;

  return (
    <div className="player-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()} style={{ zIndex: 400 }}>
      <div className="player-modal" style={{ maxWidth: 1000 }}>
        <div className="player-header">
          <div className="player-title">Official Trailer</div>
          <button className="player-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="player-iframe-wrap">
          <iframe
            className="player-iframe"
            src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
