"use client";

import { useMemo, useState } from "react";
import { config, matches, players, teamsInGroup, getTeam } from "@/lib/data";
import { computeStandings } from "@/lib/standings";
import { formatDateWeekday } from "@/lib/format";
import StandingsTable from "@/components/StandingsTable";
import TeamBadge from "@/components/TeamBadge";
import Card from "@/components/Card";
import type { Match } from "@/lib/types";

type Placar = { home: number; away: number };

export default function SimulacaoPage() {
  const [overrides, setOverrides] = useState<Record<string, Placar>>({});

  const scheduled = useMemo(
    () =>
      matches
        .filter((m) => m.status === "agendado")
        .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? "")),
    []
  );
  const simulando = Object.keys(overrides).length > 0;

  const effectiveMatches: Match[] = useMemo(
    () =>
      matches.map((m) => {
        const o = overrides[m.id];
        if (!o) return m;
        return { ...m, homeScore: o.home, awayScore: o.away, status: "realizado" as const };
      }),
    [overrides]
  );

  function setScore(matchId: string, field: "home" | "away", value: string) {
    const n = value === "" ? 0 : Math.max(0, parseInt(value, 10) || 0);
    setOverrides((prev) => ({
      ...prev,
      [matchId]: { home: field === "home" ? n : prev[matchId]?.home ?? 0, away: field === "away" ? n : prev[matchId]?.away ?? 0 },
    }));
  }

  function reset() {
    setOverrides({});
  }

  const groupedFixtures = useMemo(() => {
    const order: string[] = [];
    const byDate = new Map<string, Match[]>();
    for (const m of scheduled) {
      const key = m.date ?? "sem-data";
      if (!byDate.has(key)) {
        byDate.set(key, []);
        order.push(key);
      }
      byDate.get(key)!.push(m);
    }
    return order.map((date) => ({ date, fixtures: byDate.get(date)! }));
  }, [scheduled]);

  return (
    <div className="flex flex-col gap-8">
      <div className="pitch-hero -mx-3 flex flex-wrap items-center justify-between gap-3 px-5 py-6 text-white shadow-md sm:mx-0 sm:rounded-3xl sm:px-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Simulação</h1>
          <p className="mt-1 text-sm text-emerald-50/90">
            Preencha placares hipotéticos e veja a classificação mudar em tempo real. Não altera os
            dados reais.
          </p>
        </div>
        {simulando && (
          <button
            onClick={reset}
            className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-900 shadow-sm transition-colors hover:bg-emerald-50"
          >
            Limpar simulação
          </button>
        )}
      </div>

      {groupedFixtures.map(
        ({ date, fixtures }) =>
          fixtures.length > 0 && (
            <section key={date}>
              <h2 className="mb-2.5 font-bold tracking-tight">
                Rodada de {date === "sem-data" ? "data a definir" : formatDateWeekday(date)}
                {fixtures.every((f) => f.group === fixtures[0].group) ? ` — Grupo ${fixtures[0].group}` : ""}
              </h2>
              <div className="flex flex-col gap-2.5">
                {fixtures.map((m) => {
                  const home = getTeam(m.homeTeamId)!;
                  const away = getTeam(m.awayTeamId)!;
                  const o = overrides[m.id];
                  const active = Boolean(o);
                  return (
                    <Card
                      key={m.id}
                      className={`flex items-center justify-between gap-3 px-3 py-3 ${
                        active ? "border-emerald-500/50 ring-1 ring-emerald-500/30" : ""
                      }`}
                    >
                      <div className="flex flex-1 items-center gap-2 overflow-hidden">
                        <TeamBadge team={home} size="sm" />
                        <span className="truncate text-sm font-medium">{home.name}</span>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          value={o?.home ?? ""}
                          onChange={(e) => setScore(m.id, "home", e.target.value)}
                          placeholder="0"
                          className="tnum w-12 rounded-lg border border-black/15 bg-transparent px-1 py-1.5 text-center font-semibold focus:border-emerald-500 focus:outline-none dark:border-white/20"
                        />
                        <span className="text-neutral-400">x</span>
                        <input
                          type="number"
                          min={0}
                          value={o?.away ?? ""}
                          onChange={(e) => setScore(m.id, "away", e.target.value)}
                          placeholder="0"
                          className="tnum w-12 rounded-lg border border-black/15 bg-transparent px-1 py-1.5 text-center font-semibold focus:border-emerald-500 focus:outline-none dark:border-white/20"
                        />
                      </div>
                      <div className="flex flex-1 items-center justify-end gap-2 overflow-hidden">
                        <span className="truncate text-right text-sm font-medium">{away.name}</span>
                        <TeamBadge team={away} size="sm" />
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          )
      )}

      <div className="flex flex-col gap-8">
        <h2 className="text-xl font-bold tracking-tight">
          Classificação {simulando ? "simulada" : ""}
        </h2>
        {config.grupos.map((group) => {
          const groupTeams = teamsInGroup(group);
          const rows = computeStandings(
            groupTeams.map((t) => t.id),
            effectiveMatches,
            players
          );
          return (
            <section key={group}>
              <h3 className="mb-2.5 font-semibold">Grupo {group}</h3>
              <StandingsTable
                rows={rows}
                teams={groupTeams}
                classificados={config.classificadosPorGrupo}
                rebaixados={config.rebaixadosPorGrupo}
              />
            </section>
          );
        })}
      </div>
    </div>
  );
}
