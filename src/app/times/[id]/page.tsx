import { notFound } from "next/navigation";
import { teams, matches, players, getTeam, playersOfTeam, matchesOfTeam } from "@/lib/data";
import TeamBadge from "@/components/TeamBadge";
import MatchCard from "@/components/MatchCard";
import Card from "@/components/Card";
import SectionHeading from "@/components/SectionHeading";
import { topScorers, topCards } from "@/lib/stats";
import { colorForTeam } from "@/lib/format";

export function generateStaticParams() {
  return teams.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = getTeam(id);
  return { title: team ? `${team.name} — Elenco e jogos` : "Time não encontrado" };
}

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = getTeam(id);
  if (!team) notFound();

  const squad = playersOfTeam(team.id).sort((a, b) => a.name.localeCompare(b.name));
  const teamMatches = matchesOfTeam(team.id);
  const scorers = topScorers(squad, 10);
  const cards = topCards(squad, 10);

  return (
    <div className="flex flex-col gap-8">
      <div
        className="-mx-3 flex items-center gap-4 px-5 py-7 text-white shadow-md sm:mx-0 sm:rounded-3xl sm:px-8"
        style={{
          backgroundImage: `linear-gradient(135deg, ${colorForTeam(team.id)}, rgba(0,0,0,0.35))`,
        }}
      >
        <TeamBadge team={team} size="lg" />
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{team.name}</h1>
          <p className="text-sm text-white/80">Grupo {team.group}</p>
        </div>
      </div>

      {scorers.length > 0 && (
        <section>
          <SectionHeading title="Artilheiros do time" />
          <Card className="divide-y divide-black/5 p-1 dark:divide-white/5">
            {scorers.map((p) => (
              <div key={p.id} className="flex justify-between px-3 py-2 text-sm">
                <span className="font-medium">{p.name}</span>
                <span className="tnum font-extrabold text-emerald-700 dark:text-emerald-400">{p.gols}</span>
              </div>
            ))}
          </Card>
        </section>
      )}

      <section>
        <SectionHeading title="Jogos" />
        <div className="flex flex-col gap-2.5">
          {teamMatches.map((m) => (
            <MatchCard key={m.id} match={m} homeTeam={getTeam(m.homeTeamId)!} awayTeam={getTeam(m.awayTeamId)!} />
          ))}
        </div>
      </section>

      {cards.length > 0 && (
        <section>
          <SectionHeading title="Cartões do time" />
          <Card className="divide-y divide-black/5 p-1 dark:divide-white/5">
            {cards.map((p) => (
              <div key={p.id} className="flex justify-between px-3 py-2 text-sm">
                <span className="font-medium">{p.name}</span>
                <span className="tnum">
                  {p.cartoesAmarelos > 0 && <span className="mr-1.5">🟨 {p.cartoesAmarelos}</span>}
                  {p.cartoesVermelhos > 0 && <span>🟥 {p.cartoesVermelhos}</span>}
                </span>
              </div>
            ))}
          </Card>
        </section>
      )}

      <section>
        <SectionHeading title={`Elenco completo (${squad.length})`} />
        <Card className="p-4">
          <ul className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-2">
            {squad.map((p) => (
              <li key={p.id} className="truncate text-neutral-600 dark:text-neutral-400">
                {p.name}
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
