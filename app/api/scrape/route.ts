import { NextRequest, NextResponse } from 'next/server';
import { embedSources } from '@/lib/constants';

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type');
  const idStr = req.nextUrl.searchParams.get('id');
  const season = req.nextUrl.searchParams.get('s') || '1';
  const episode = req.nextUrl.searchParams.get('e') || '1';

  if (!type || !idStr) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const id = parseInt(idStr, 10);
  
  // Get all possible server links for this media
  const sources = type === 'movie' 
    ? embedSources.movie(id) 
    : embedSources.tv(id, parseInt(season), parseInt(episode));

  // Try to fetch the HTML of each embed and search for an un-obfuscated .m3u8 or .mp4 link
  for (const src of sources.slice(0, 3)) { // Only try the first 3 to prevent hanging requests
    try {
      const resp = await fetch(src, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Referer': 'https://google.com'
        },
        signal: AbortSignal.timeout(3000) // 3 second timeout per source
      });

      if (resp.ok) {
        const text = await resp.text();
        
        // Very naive regex to find an exposed raw video url in the script tags
        // E.g. anything matching "https://.../something.m3u8" or ".mp4"
        const match = text.match(/https?:\/\/[^\s"'<>]+\.(?:m3u8|mp4)/i);
        
        if (match && match[0]) {
          return NextResponse.json({ url: match[0], serverHit: src });
        }
      }
    } catch (e) {
      // Ignore abort/fetch errors and move to next source
      continue;
    }
  }

  // If we reach here, all providers use encrypted/obfuscated JS to hide the real playlist URL (which is standard).
  return NextResponse.json(
    { error: 'Could not extract direct link. Servers are heavily obfuscated.' }, 
    { status: 404 }
  );
}
