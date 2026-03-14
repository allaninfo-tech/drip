import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Drip — Stream Movies & TV for Free',
  description: 'Watch trending movies and TV shows for free on Drip. Thousands of titles, zero subscriptions.',
  keywords: ['streaming', 'movies', 'tv shows', 'free', 'watch online', 'drip'],
  openGraph: {
    title: 'Drip — Stream Movies & TV for Free',
    description: 'Watch trending movies and TV shows for free on Drip.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
