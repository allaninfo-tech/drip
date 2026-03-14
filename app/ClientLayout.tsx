'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Expose a global way to open search if needed, but easiest is to pass prop to Navbar
  // Since Navbar is also a client component, we can just pass it.

  return (
    <>
      <Navbar onSearchClick={() => setIsSearchOpen(true)} />
      <main>{children}</main>
      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
