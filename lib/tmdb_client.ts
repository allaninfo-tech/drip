import axios from 'axios';

const TMDB_URL = 'https://api.themoviedb.org/3';
// Need a client-safe way to hit the API without exposing the token if this runs entirely in browser.
// For now, Next.js process.env works in some client contexts, but ideally we'd proxy this through our /api/
// Given the current architecture, we'll try to use the same token pattern.

export async function searchMedia(query: string) {
  // Try to use a local API route to hide the token
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}
