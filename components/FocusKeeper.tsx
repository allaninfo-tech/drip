'use client';

import { useEffect } from 'react';

/**
 * A lightweight component that attempts to instantly refocus the current window
 * if a popup steals focus. This mitigates the annoyance of redirects by
 * automatically keeping the user on Drip.
 */
export default function FocusKeeper() {
  useEffect(() => {
    const handleBlur = () => {
      // Whenever the window loses focus (e.g. an ad popup opens in a new tab),
      // instantly try to pull focus back to our window.
      setTimeout(() => {
        window.focus();
      }, 50);
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  return null;
}
