'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check } from 'lucide-react';

interface HeartPopButtonProps {
  isSaved: boolean;
  onToggle: (e: React.MouseEvent) => void;
  className?: string;
}

export default function HeartPopButton({ isSaved, onToggle, className = '' }: HeartPopButtonProps) {
  const [isPopping, setIsPopping] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSaved) {
      setIsPopping(true);
      setTimeout(() => setIsPopping(false), 1000); // Reset animation state
    }
    onToggle(e);
  };

  const particles = Array.from({ length: 6 }).map((_, i) => {
    // Distribute particles in a circle
    const angle = (i / 6) * Math.PI * 2;
    const distance = 25;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    };
  });

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={handleClick}
        className={className}
        aria-label={isSaved ? "Remove from List" : "Add to List"}
        style={{ position: 'relative', zIndex: 10, border: 'none', background: 'transparent' }}
      >
        <motion.div
          animate={isPopping ? { scale: [1, 1.4, 1] } : {}}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {isSaved ? <Check size={18} color="#22c55e" strokeWidth={3} /> : <Plus size={18} />}
        </motion.div>
      </button>

      {/* Particle Burst */}
      <AnimatePresence>
        {isPopping && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 5, pointerEvents: 'none' }}>
            {particles.map((p, i) => (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  opacity: 0,
                  scale: 1,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  position: 'absolute',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: ['#7c3aed', '#8b5cf6', '#06b6d4', '#22c55e'][i % 4],
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
