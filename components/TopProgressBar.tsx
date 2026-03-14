'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // When pathname or searchParams change, the navigation has completed
    setLoading(false);
    setProgress(100);
    
    const timer = setTimeout(() => {
      setProgress(0);
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // We can't easily hook into Next.js "route change start" in App Router 
  // without wrapping all Links, but we can simulate the progress bar 
  // on any click that might lead to a new page.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.href && !anchor.target && anchor.origin === window.location.origin) {
        if (anchor.href !== window.location.href) {
          setLoading(true);
          setProgress(30);
          
          // Increment progress slowly
          const interval = setInterval(() => {
            setProgress(prev => (prev >= 90 ? 90 : prev + 5));
          }, 200);
          
          return () => clearInterval(interval);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  if (progress === 0 && !loading) return null;

  return (
    <div 
      className="top-progress-bar" 
      style={{ 
        width: `${progress}%`,
        opacity: progress === 100 ? 0 : 1,
        transition: progress === 100 ? 'width 0.2s ease-out, opacity 0.4s ease-in' : 'width 0.4s ease-out'
      }} 
    />
  );
}
