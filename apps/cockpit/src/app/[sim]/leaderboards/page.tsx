import { notFound } from 'next/navigation';
import { getSimBySlug } from '@/content/sims';
import { CHAMPIONSHIPS } from '@/content/championships';
import { ChampionshipLeaderboardsBody } from '@/components/ChampionshipLeaderboardsBody';
import { AccTrackList } from '@/components/AccTrackList';
import { GameLabel } from '@/components/GameLabel';
import { getAccTracks, getAccTrackTopTimes, getAccTrackStats } from '@/lib/acc/tracks';

export const dynamic = 'force-dynamic';

export default async function SimLeaderboardsPage({
  params,
}: {
  params: Promise<{ sim: string }>;
}) {
  const { sim: slug } = await params;
  const sim = getSimBySlug(slug);
  if (!sim) notFound();

  // ACC's leaderboards are a track list (acc_tracks/acc_hotlap_leaderboard),
  // not tied to a championship's round schedule the way AC Evo's are below.
  if (sim.game === 'ACC') {
    const baseTracks = await getAccTracks();
    const tracks = await Promise.all(
      baseTracks.map(async (track) => {
        const [topTimes, stats] = await Promise.all([
          getAccTrackTopTimes(track.trackKey),
          getAccTrackStats(track.trackKey),
        ]);
        return { ...track, topTimes, ...stats };
      }),
    );
    return (
      <section className="max-w-[1280px] mx-auto px-7 pt-14 pb-24">
        <span
          className="block font-mono text-[15px] tracking-[.3em] uppercase mb-5"
          style={{ color: 'var(--sim-accent)' }}
        >
          — <GameLabel game={sim.game} /> Leaderboards
        </span>
        <h1 className="font-display font-black text-[clamp(44px,6vw,80px)] uppercase leading-[.9] tracking-[-1px] text-txt mb-16">
          Leaderboards
        </h1>
        <AccTrackList tracks={tracks} simSlug={sim.slug} />
      </section>
    );
  }

  const champ = CHAMPIONSHIPS.find((c) => c.game === sim.game && c.emperorChampionshipId);

  return (
    <section className="max-w-[1280px] mx-auto px-7 pt-14 pb-24">
      <span
        className="block font-mono text-[15px] tracking-[.3em] uppercase mb-5"
        style={{ color: 'var(--sim-accent)' }}
      >
        — <GameLabel game={sim.game} /> Leaderboards
      </span>
      <h1 className="font-display font-black text-[clamp(44px,6vw,80px)] uppercase leading-[.9] tracking-[-1px] text-txt mb-16">
        Leaderboards
      </h1>

      {champ ? (
        <ChampionshipLeaderboardsBody champ={champ} accentColor={sim.accentColor} />
      ) : (
        <div className="border border-line/50 bg-carbon-2 px-8 py-12 text-center">
          <p className="font-mono text-[15px] tracking-[.2em] uppercase text-txt-3">
            Coming soon
          </p>
        </div>
      )}
    </section>
  );
}
