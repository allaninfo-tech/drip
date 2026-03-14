'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Film, Tv, Home, Flame, Menu, X } from 'lucide-react';

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/movies', label: 'Movies', icon: Film },
  { href: '/tv', label: 'TV Shows', icon: Tv },
  { href: '/trending', label: 'Trending', icon: Flame },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <Link href="/" className="navbar-logo">drip</Link>

        {/* Desktop links */}
        <ul className="navbar-links">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={pathname === href ? 'active' : ''}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <button className="navbar-search-btn" onClick={() => router.push('/search')} aria-label="Search">
            <Search size={18} />
          </button>
          {/* Mobile hamburger */}
          <button
            className="navbar-hamburger"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <nav className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <span className="navbar-logo" style={{ fontSize: '1.4rem' }}>drip</span>
              <button className="drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <ul className="drawer-links">
              {links.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link href={href} className={`drawer-link${pathname === href ? ' active' : ''}`}>
                    <Icon size={18} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
