import { config, players, getTeam } from "@/lib/data";
import { topScorers } from "@/lib/stats";
import TeamBadge from "@/components/TeamBadge";
import Card from "@/components/Card";

export const metadata = { title: `Artilharia — ${config.nome}` };

const PODIUM_STYLE = [
  "border-amber-400/50 bg-gradient-to-br from-amber-50 to-white dark:from-amber-500/10 dark:to-transparent",
  "border-neutral-300/60 bg-gradient-to-br from-neutral-100 to-white dark:from-neutral-500/10 dark:to-transparent",
  "border-orange-400/40 bg-gradient-to-br from-orange-50 to-white dark:from-orange-500/10 dark:to-transparent",
];

export default function ArtilhariaPage() {
  const scorers = topScorers(players, 50);
  const podium = scorers.slice(0, 3);
  const rest = scorers.slice(3);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Artilharia</h1>

      {podium.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-3">
          {podium.map((p, i) => {
            const team = getTeam(p.teamId)!;
            return (
              <Card key={p.id} className={`p-4 ${PODIUM_STYLE[i]}`}>
                <div className="flex items-center gap-3">
                  <TeamBadge team={team} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="truncate text-xs text-neutral-500">{team.name}</p>
                  </div>
                </div>
                <p className="tnum mt-3 text-3xl font-extrabold">{p.gols}</p>
                <p className="text-xs text-neutral-500">gols</p>
              </Card>
            );
          })}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-neutral-900/60">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="bg-emerald-800 text-left text-emerald-50">
                <th className="px-3 py-2.5 text-center font-semibold">#</th>
                <th className="px-3 py-2.5 font-semibold">Jogador</th>
                <th className="px-3 py-2.5 font-semibold">Time</th>
                <th className="px-3 py-2.5 text-center font-semibold">Gols</th>
              </tr>
            </thead>
            <tbody>
              {rest.map((p, i) => {
                const team = getTeam(p.teamId)!;
                return (
                  <tr
                    key={p.id}
                    className={`border-t border-black/5 dark:border-white/5 ${
                      i % 2 === 1 ? "bg-black/[0.015] dark:bg-white/[0.02]" : ""
                    }`}
                  >
                    <td className="tnum px-3 py-2 text-center text-neutral-500">{i + 4}</td>
                    <td className="px-3 py-2 font-medium">{p.name}</td>
                    <td className="px-3 py-2">
                      <span className="flex items-center gap-2">
                        <TeamBadge team={team} size="sm" />
                        {team.name}
                      </span>
                    </td>
                    <td className="tnum px-3 py-2 text-center text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                      {p.gols}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
