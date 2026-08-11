import { config, players, getTeam } from "@/lib/data";
import { topCards, suspensosEPendurados } from "@/lib/stats";
import TeamBadge from "@/components/TeamBadge";
import Card from "@/components/Card";

export const metadata = { title: `Cartões — ${config.nome}` };

export default function CartoesPage() {
  const ranking = topCards(players, 50);
  const { suspensos, pendurados } = suspensosEPendurados(players);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold tracking-tight">Cartões</h1>

      {(suspensos.length > 0 || pendurados.length > 0) && (
        <section className="grid gap-4 sm:grid-cols-2">
          {suspensos.length > 0 && (
            <Card className="border-red-500/30 bg-gradient-to-br from-red-50 to-white p-4 dark:from-red-500/10 dark:to-transparent">
              <h2 className="mb-3 font-bold text-red-700 dark:text-red-400">🚫 Suspensos</h2>
              <ul className="flex flex-col gap-2 text-sm">
                {suspensos.map((p) => {
                  const team = getTeam(p.teamId)!;
                  return (
                    <li key={p.id} className="flex items-center gap-2.5">
                      <TeamBadge team={team} size="sm" />
                      <span className="font-medium">{p.name}</span>
                      <span className="text-neutral-500">({team.name})</span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}
          {pendurados.length > 0 && (
            <Card className="border-amber-500/30 bg-gradient-to-br from-amber-50 to-white p-4 dark:from-amber-500/10 dark:to-transparent">
              <h2 className="mb-3 font-bold text-amber-700 dark:text-amber-400">
                ⚠️ Pendurados (a 1 cartão da suspensão)
              </h2>
              <ul className="flex flex-col gap-2 text-sm">
                {pendurados.map((p) => {
                  const team = getTeam(p.teamId)!;
                  return (
                    <li key={p.id} className="flex items-center gap-2.5">
                      <TeamBadge team={team} size="sm" />
                      <span className="font-medium">{p.name}</span>
                      <span className="text-neutral-500">({team.name})</span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}
        </section>
      )}

      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-neutral-900/60">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[460px] border-collapse text-sm">
            <thead>
              <tr className="bg-emerald-800 text-left text-emerald-50">
                <th className="px-3 py-2.5 text-center font-semibold">#</th>
                <th className="px-3 py-2.5 font-semibold">Jogador</th>
                <th className="px-3 py-2.5 font-semibold">Time</th>
                <th className="px-3 py-2.5 text-center font-semibold">🟨</th>
                <th className="px-3 py-2.5 text-center font-semibold">🟥</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((p, i) => {
                const team = getTeam(p.teamId)!;
                return (
                  <tr
                    key={p.id}
                    className={`border-t border-black/5 dark:border-white/5 ${
                      i % 2 === 1 ? "bg-black/[0.015] dark:bg-white/[0.02]" : ""
                    }`}
                  >
                    <td className="tnum px-3 py-2 text-center text-neutral-500">{i + 1}</td>
                    <td className="px-3 py-2 font-medium">{p.name}</td>
                    <td className="px-3 py-2">
                      <span className="flex items-center gap-2">
                        <TeamBadge team={team} size="sm" />
                        {team.name}
                      </span>
                    </td>
                    <td className="tnum px-3 py-2 text-center font-semibold">{p.cartoesAmarelos || ""}</td>
                    <td className="tnum px-3 py-2 text-center font-semibold text-red-600 dark:text-red-400">
                      {p.cartoesVermelhos || ""}
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
