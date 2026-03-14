'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const cleanUp = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    // When pathname or searchParams change, the navigation has completed
    cleanUp();
    setProgress(100);
    
    // Fade out and then reset
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setProgress(0), 400); // Reset after fade
    }, 400);

    return () => {
      clearTimeout(timer);
      cleanUp();
    };
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      // Basic check if it's a standard internal link
      if (
        anchor && 
        anchor.href && 
        !anchor.target && 
        anchor.origin === window.location.origin &&
        !anchor.hasAttribute('download') &&
        !anchor.href.startsWith('mailto:') &&
        !anchor.href.startsWith('tel:')
      ) {
        // Only trigger if it's a new URL
        const currentUrl = window.location.href;
        const targetUrl = anchor.href;
        
        if (currentUrl !== targetUrl) {
          cleanUp();
          setIsVisible(true);
          setProgress(30);
          
          intervalRef.current = setInterval(() => {
            setProgress(prev => {
              if (prev >= 90) return 90;
              return prev + 2;
            });
          }, 150);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
      cleanUp();
    };
  }, []);

  if (progress === 0 && !isVisible) return null;

  return (
    <div 
      className="top-progress-bar" 
      style={{ 
        width: `${progress}%`,
        opacity: isVisible ? 1 : 0,
        transition: isVisible 
          ? 'width 0.4s ease-out, opacity 0.2s ease-in' 
          : 'width 0.2s ease-out, opacity 0.4s ease-in'
      }} 
    />
  );
}
