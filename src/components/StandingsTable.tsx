import Link from "next/link";
import type { StandingsRow, Team } from "@/lib/types";
import TeamBadge from "./TeamBadge";

export default function StandingsTable({
  rows,
  teams,
  classificados,
  rebaixados = 0,
}: {
  rows: StandingsRow[];
  teams: Team[];
  classificados: number;
  rebaixados?: number;
}) {
  const teamById = new Map(teams.map((t) => [t.id, t]));

  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-neutral-900/60">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="bg-emerald-800 text-left text-emerald-50">
              <th className="px-2 py-2.5 text-center font-semibold">#</th>
              <th className="px-2 py-2.5 font-semibold">Time</th>
              <th className="px-2 py-2.5 text-center font-semibold">P</th>
              <th className="px-2 py-2.5 text-center font-semibold">J</th>
              <th className="px-2 py-2.5 text-center font-semibold">V</th>
              <th className="px-2 py-2.5 text-center font-semibold">E</th>
              <th className="px-2 py-2.5 text-center font-semibold">D</th>
              <th className="px-2 py-2.5 text-center font-semibold">GP</th>
              <th className="px-2 py-2.5 text-center font-semibold">GC</th>
              <th className="px-2 py-2.5 text-center font-semibold">SG</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const team = teamById.get(row.teamId);
              if (!team) return null;
              const classifica = i < classificados;
              const rebaixa = rebaixados > 0 && i >= rows.length - rebaixados;
              return (
                <tr
                  key={row.teamId}
                  className={`border-t border-black/5 dark:border-white/5 ${
                    i % 2 === 1 ? "bg-black/[0.015] dark:bg-white/[0.02]" : ""
                  } ${
                    classifica
                      ? "border-l-4 border-l-emerald-500"
                      : rebaixa
                        ? "border-l-4 border-l-red-500 bg-red-500/5"
                        : "border-l-4 border-l-transparent"
                  }`}
                >
                  <td className="px-2 py-2 text-center">
                    <span
                      className={`tnum inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        classifica
                          ? "bg-emerald-600 text-white"
                          : rebaixa
                            ? "bg-red-600 text-white"
                            : "bg-black/5 text-neutral-600 dark:bg-white/10 dark:text-neutral-300"
                      }`}
                    >
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <Link href={`/times/${team.id}`} className="flex items-center gap-2 hover:underline">
                      <TeamBadge team={team} size="sm" />
                      <span className="whitespace-nowrap font-medium">{team.name}</span>
                    </Link>
                  </td>
                  <td className="tnum px-2 py-2 text-center text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                    {row.pontos}
                  </td>
                  <td className="tnum px-2 py-2 text-center">{row.jogos}</td>
                  <td className="tnum px-2 py-2 text-center">{row.vitorias}</td>
                  <td className="tnum px-2 py-2 text-center">{row.empates}</td>
                  <td className="tnum px-2 py-2 text-center">{row.derrotas}</td>
                  <td className="tnum px-2 py-2 text-center">{row.golsPro}</td>
                  <td className="tnum px-2 py-2 text-center">{row.golsContra}</td>
                  <td className="tnum px-2 py-2 text-center font-medium">{row.saldoDeGols}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {(classificados > 0 || rebaixados > 0) && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-black/10 px-3 py-2 text-xs text-neutral-500 dark:border-white/10">
          {classificados > 0 && (
            <p>
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald-500 align-middle" />{" "}
              Zona de classificação para o mata-mata
            </p>
          )}
          {rebaixados > 0 && (
            <p>
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-red-500 align-middle" /> Zona
              de rebaixamento
            </p>
          )}
        </div>
      )}
    </div>
  );
}
