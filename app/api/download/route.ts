import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  const filename = request.nextUrl.searchParams.get('filename') || 'video.mp4';

  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        // Pretend we are a normal browser to avoid blocks
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*¹,
        'Connection': 'keep-alive'
      }
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch video: ${response.statusText}`, { status: response.status });
    }

    // Force the browser to download the file instead of playing it
    const headers = new Headers(response.headers);
    headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    headers.set('Content-Type', 'application/octet-stream'); // Force download behavior

    return new NextResponse(response.body, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Download proxy error:', error);
    return new NextResponse('Internal Server Error while brokering download', { status: 500 });
  }
}
