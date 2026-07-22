import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSimBySlug } from '@/content/sims';
import { getAccTrack, getAccTrackLeaderboard, getAccTrackTopTimes } from '@/lib/acc/tracks';
import { AccTrackHeader } from '@/components/AccTrackHeader';
import { AccTrackLeaderboard } from '@/components/AccTrackLeaderboard';

export const dynamic = 'force-dynamic';

export default async function AccTrackLeaderboardPage({
  params,
}: {
  params: Promise<{ sim: string; track: string }>;
}) {
  const { sim: slug, track: trackKey } = await params;
  const sim = getSimBySlug(slug);
  if (!sim || sim.game !== 'ACC') notFound();

  const track = await getAccTrack(trackKey);
  if (!track) notFound();

  const [leaderboardByCarGroup, topEntries] = await Promise.all([
    getAccTrackLeaderboard(trackKey),
    getAccTrackTopTimes(trackKey, 1),
  ]);

  return (
    <section className="max-w-[1280px] mx-auto px-7 pt-14 pb-24">
      <Link
        href={`/${sim.slug}/leaderboards`}
        className="inline-block font-mono text-[13px] tracking-[.2em] uppercase text-txt-3 hover:text-gold transition-colors mb-8"
      >
        ← All Tracks
      </Link>

      <AccTrackHeader track={track} fastestLap={topEntries[0] ?? null} />

      <AccTrackLeaderboard leaderboardByCarGroup={leaderboardByCarGroup} />
    </section>
  );
}
