import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Providers from './Providers';
import TopProgressBar from '@/components/TopProgressBar';
import { Suspense } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL('https://driptv.vercel.app'), // Update with actual domain
  title: {
    default: 'dripTV — Stream Movies & TV for Free',
    template: '%s — dripTV'
  },
  description: 'Watch trending movies and TV shows for free on dripTV. Thousands of titles, zero subscriptions.',
  keywords: ['streaming', 'movies', 'tv shows', 'free', 'watch online', 'drip', 'dripTV'],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'dripTV — Stream Movies & TV for Free',
    description: 'Watch trending movies and TV shows for free on dripTV.',
    type: 'website',
    siteName: 'dripTV',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'dripTV — Stream Movies & TV for Free',
    description: 'Watch trending movies and TV shows for free on dripTV.',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/apple-touch-icon.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>
          <Suspense fallback={null}>
            <TopProgressBar />
          </Suspense>
          <Navbar />
          <main className="content-container">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

