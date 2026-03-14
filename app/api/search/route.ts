import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const TMDB_URL = 'https://api.themoviedb.org/3';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q');
  
  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const res = await axios.get(`${TMDB_URL}/search/multi`, {
      params: { 
        query,
        include_adult: false,
        language: 'en-US',
      },
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    });

    return NextResponse.json(res.data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}
