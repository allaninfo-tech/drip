'use client';

import React, { useState, MouseEvent, useEffect } from 'react';

interface RippleData {
  x: number;
  y: number;
  size: number;
  id: number;
}

interface RippleProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  duration?: number;
}

export default function Ripple({ children, className = '', style, color = 'rgba(255, 255, 255, 0.3)', duration = 600 }: RippleProps) {
  const [ripples, setRipples] = useState<RippleData[]>([]);

  const addRipple = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.5; // Make ripple big enough to cover 
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const newRipple = { x, y, size, id: Date.now() };

    setRipples((prev) => [...prev, newRipple]);
  };

  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prev) => prev.slice(1)); // Remove oldest ripple after duration
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [ripples, duration]);

  return (
    <div
      onClick={addRipple}
      className={`ripple-container ${className}`}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            background: color,
            borderRadius: '50%',
            pointerEvents: 'none',
            transform: 'scale(0)',
            animation: `ripple-animation ${duration}ms cubic-bezier(0.1, 0.8, 0.3, 1) forwards`,
          }}
        />
      ))}
    </div>
  );
}
