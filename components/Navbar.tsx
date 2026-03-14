'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Film, Tv, Home, Flame } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/movies', label: 'Movies', icon: Film },
    { href: '/tv', label: 'TV Shows', icon: Tv },
    { href: '/trending', label: 'Trending', icon: Flame },
  ];

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <Link href="/" className="navbar-logo">
        drip
      </Link>

      <ul className="navbar-links">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={pathname === href ? 'active' : ''}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="navbar-actions">
        <button
          className="navbar-search-btn"
          onClick={() => router.push('/search')}
          aria-label="Search"
        >
          <Search size={18} />
        </button>
      </div>
    </nav>
  );
}
