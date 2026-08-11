import type { Match, Team } from "@/lib/types";
import { formatDateWeekday } from "@/lib/format";
import TeamBadge from "./TeamBadge";

export default function MatchCard({
  match,
  homeTeam,
  awayTeam,
}: {
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
}) {
  const jogado = match.status === "realizado";

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-black/5 bg-white px-3 py-3 shadow-sm dark:border-white/10 dark:bg-neutral-900/60">
      <div className="flex flex-1 items-center gap-2 overflow-hidden">
        <TeamBadge team={homeTeam} size="sm" />
        <span className="truncate text-sm font-medium">{homeTeam.name}</span>
      </div>

      <div className="shrink-0 text-center">
        {jogado ? (
          <span className="tnum inline-block min-w-[64px] rounded-lg bg-emerald-50 px-2.5 py-1 text-base font-extrabold text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
            {match.homeScore} – {match.awayScore}
          </span>
        ) : (
          <span className="inline-block whitespace-nowrap rounded-lg bg-black/5 px-2.5 py-1 text-xs font-semibold text-neutral-600 dark:bg-white/10 dark:text-neutral-300">
            {match.status === "adiado" ? "Adiado" : formatDateWeekday(match.date)}
          </span>
        )}
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 overflow-hidden">
        <span className="truncate text-right text-sm font-medium">{awayTeam.name}</span>
        <TeamBadge team={awayTeam} size="sm" />
      </div>
    </div>
  );
}
