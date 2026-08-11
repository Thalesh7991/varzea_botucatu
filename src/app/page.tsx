import Link from "next/link";
import { config, matches, players, teamsInGroup, getTeam } from "@/lib/data";
import { computeStandings } from "@/lib/standings";
import { topScorers } from "@/lib/stats";
import TeamBadge from "@/components/TeamBadge";
import MatchCard from "@/components/MatchCard";
import Card from "@/components/Card";
import SectionHeading from "@/components/SectionHeading";

export default function Home() {
  const proximos = matches
    .filter((m) => m.status === "agendado")
    .sort((a, b) => (a.date ?? "9999").localeCompare(b.date ?? "9999"))
    .slice(0, 4);

  const ultimos = matches
    .filter((m) => m.status === "realizado")
    .slice(-4)
    .reverse();

  const scorers = topScorers(players, 50);
  const maxGols = scorers[0]?.gols ?? 0;
  const artilheiros = scorers.filter((p) => p.gols === maxGols);

  return (
    <div className="flex flex-col gap-10">
      <section className="pitch-hero -mx-3 overflow-hidden px-5 py-8 text-white shadow-md sm:mx-0 sm:rounded-3xl sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-100/80">
          {config.cidade} · {config.serie}/{config.temporada}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{config.nome}</h1>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
          <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
            Boletim {config.ultimoBoletim.numero}/{config.temporada}
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
            {config.grupos.length} grupos
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
            {config.classificadosPorGrupo} classificados por grupo
          </span>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {config.grupos.map((group) => {
          const rows = computeStandings(
            teamsInGroup(group).map((t) => t.id),
            matches,
            players
          ).slice(0, 4);
          return (
            <Card key={group} className="p-4">
              <h2 className="mb-3 font-bold tracking-tight">Líderes — Grupo {group}</h2>
              <ol className="flex flex-col gap-2.5">
                {rows.map((row, i) => {
                  const team = getTeam(row.teamId)!;
                  return (
                    <li key={row.teamId} className="flex items-center gap-2.5 text-sm">
                      <span className="w-5 tnum text-neutral-500">{i + 1}º</span>
                      <TeamBadge team={team} size="sm" />
                      <span className="flex-1 font-medium">{team.name}</span>
                      <span className="tnum font-extrabold text-emerald-700 dark:text-emerald-400">
                        {row.pontos} pts
                      </span>
                    </li>
                  );
                })}
              </ol>
              <Link
                href="/classificacao"
                className="mt-4 inline-block text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
              >
                Ver tabela completa →
              </Link>
            </Card>
          );
        })}
      </section>

      {artilheiros.length > 0 && (
        <Card className="border-amber-400/40 bg-gradient-to-br from-amber-50 to-white p-4 dark:from-amber-500/10 dark:to-transparent">
          <h2 className="mb-3 font-bold tracking-tight text-amber-800 dark:text-amber-400">
            🏆 {artilheiros.length > 1 ? "Artilheiros do campeonato" : "Artilheiro do campeonato"}
          </h2>
          <div className="flex flex-col gap-3">
            {artilheiros.map((artilheiro) => {
              const artilheiroTeam = getTeam(artilheiro.teamId)!;
              return (
                <div key={artilheiro.id} className="flex items-center gap-3">
                  <TeamBadge team={artilheiroTeam} />
                  <div className="flex-1">
                    <p className="font-semibold">{artilheiro.name}</p>
                    <p className="text-sm text-neutral-500">{artilheiroTeam.name}</p>
                  </div>
                  <span className="tnum text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                    {artilheiro.gols}
                  </span>
                  <span className="text-sm text-neutral-500">gols</span>
                </div>
              );
            })}
          </div>
          <Link
            href="/artilharia"
            className="mt-4 inline-block text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
          >
            Ver artilharia completa →
          </Link>
        </Card>
      )}

      <section>
        <SectionHeading title="Últimos resultados" href="/resultados" />
        <div className="flex flex-col gap-2.5">
          {ultimos.map((m) => (
            <MatchCard key={m.id} match={m} homeTeam={getTeam(m.homeTeamId)!} awayTeam={getTeam(m.awayTeamId)!} />
          ))}
        </div>
      </section>

      {proximos.length > 0 && (
        <section>
          <SectionHeading title="Próximos jogos" href="/resultados" />
          <div className="flex flex-col gap-2.5">
            {proximos.map((m) => (
              <MatchCard key={m.id} match={m} homeTeam={getTeam(m.homeTeamId)!} awayTeam={getTeam(m.awayTeamId)!} />
            ))}
          </div>
        </section>
      )}

      <Card className="border-dashed p-5 text-sm text-neutral-600 dark:text-neutral-300">
        Quer testar como ficaria a classificação com resultados hipotéticos das próximas rodadas?{" "}
        <Link href="/simulacao" className="font-medium text-emerald-700 hover:underline dark:text-emerald-400">
          Vá para o simulador →
        </Link>
      </Card>
    </div>
  );
}
