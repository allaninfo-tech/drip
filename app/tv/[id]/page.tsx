import {
  getTVDetails,
  getTVCredits,
  getSimilarTV,
  getMediaVideos,
} from '@/lib/tmdb';
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
    const title = `${show.name} — Watch Free on dripTV`;
    return {
      title: show.name,
      description: show.overview,
      openGraph: {
        title,
        description: show.overview,
        images: show.backdrop_path ? [imgUrl.backdrop(show.backdrop_path, 'w1280')] : [],
        type: 'video.tv_show',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: show.overview,
        images: show.backdrop_path ? [imgUrl.backdrop(show.backdrop_path, 'w780')] : [],
      }
    };
  } catch {
    return { title: 'TV Show' };
  }
}

export default async function TVShowPage({ params }: Props) {
  const { id } = await params;
  const [show, credits, similar, videos] = await Promise.all([
    getTVDetails(Number(id)),
    getTVCredits(Number(id)),
    getSimilarTV(Number(id)),
    getMediaVideos(Number(id), 'tv'),
  ]);

  return <TVDetailClient show={show} credits={credits} similar={similar.results} videos={videos} />;
}
