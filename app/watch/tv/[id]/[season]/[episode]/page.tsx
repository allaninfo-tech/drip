import { getTVDetails } from '@/lib/tmdb';
import { embedSources } from '@/lib/constants';
import WatchClient from './WatchClient';

interface Props {
  params: Promise<{ id: string; season: string; episode: string }>;
}

export default async function WatchTVPage({ params }: Props) {
  const { id, season, episode } = await params;
  const show = await getTVDetails(Number(id));
  const sources = embedSources.tv(Number(id), Number(season), Number(episode));
  const totalSeasons = show.number_of_seasons ?? 1;
  const episodeCounts = show.seasons
    ?.filter((s) => s.season_number > 0)
    .map((s) => s.episode_count) ?? [];

  return (
    <WatchClient
      sources={sources}
      title={show.name}
      type="tv"
      mediaId={Number(id)}
      initialSeason={Number(season)}
      initialEpisode={Number(episode)}
      totalSeasons={totalSeasons}
      episodeCounts={episodeCounts}
      backdropPath={show.backdrop_path}
      overview={show.overview}
    />
  );
}
