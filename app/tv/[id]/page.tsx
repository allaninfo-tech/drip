import { getTVDetails, getTVCredits, getSimilarTV } from '@/lib/tmdb';
import TVDetailClient from './TVDetailClient';
import type { Metadata } from 'next';
import { imgUrl } from '@/lib/constants';

export const revalidate = 3600;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const show = await getTVDetails(Number(id));
    return {
      title: `${show.name} — Drip`,
      description: show.overview,
      openGraph: {
        images: show.backdrop_path ? [imgUrl.backdrop(show.backdrop_path)] : [],
      },
    };
  } catch {
    return { title: 'TV Show — Drip' };
  }
}

export default async function TVShowPage({ params }: Props) {
  const { id } = await params;
  const [show, credits, similar] = await Promise.all([
    getTVDetails(Number(id)),
    getTVCredits(Number(id)),
    getSimilarTV(Number(id)),
  ]);

  return <TVDetailClient show={show} credits={credits} similar={similar.results} />;
}
