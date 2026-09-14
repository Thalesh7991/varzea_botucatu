"use client";

import { useState } from "react";
import type { Team } from "@/lib/types";
import type { ProjectedMatch } from "@/lib/bracket";
import TeamBadge from "./TeamBadge";

type QfKey = "qf1" | "qf2" | "qf3" | "qf4";
type SfKey = "sf1" | "sf2";
const QF_KEYS: QfKey[] = ["qf1", "qf2", "qf3", "qf4"];

type Picks = Partial<Record<QfKey | SfKey | "final", string>>;

function SeedTag({ group, position }: { group: string; position: number }) {
  const isA = group === "A";
  return (
    <span
      className={`tnum inline-flex h-5 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${
        isA
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300"
          : "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300"
      }`}
    >
      {position}
      {group}
    </span>
  );
}

function RowContent({
  team,
  group,
  position,
  selected,
  faded,
}: {
  team: Team;
  group?: string;
  position?: number;
  selected?: boolean;
  faded?: boolean;
}) {
  return (
    <span className={`flex flex-1 items-center gap-1.5 overflow-hidden ${faded ? "opacity-50" : ""}`}>
      {group && position ? <SeedTag group={group} position={position} /> : <span className="w-7 shrink-0" />}
      <TeamBadge team={team} size="sm" />
      <span
        className={`truncate text-xs font-semibold ${
          selected
            ? "text-emerald-800 dark:text-emerald-300"
            : faded
              ? "text-neutral-400 line-through decoration-neutral-300 dark:text-neutral-500"
              : ""
        }`}
        title={team.name}
      >
        {team.name}
      </span>
      {selected && <span className="ml-auto shrink-0 text-xs text-emerald-600 dark:text-emerald-400">✓</span>}
    </span>
  );
}

function PickableTeamRow({
  team,
  group,
  position,
  selected,
  faded,
  onPick,
}: {
  team: Team;
  group?: string;
  position?: number;
  selected: boolean;
  faded: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={`flex w-full items-center gap-1.5 px-2 py-2 text-left transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.05] ${
        selected ? "bg-emerald-50 dark:bg-emerald-500/10" : ""
      }`}
    >
      <RowContent team={team} group={group} position={position} selected={selected} faded={faded} />
    </button>
  );
}

function PlaceholderRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-2 text-neutral-400 dark:text-neutral-500">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/5 text-xs font-bold dark:bg-white/10">
        ?
      </span>
      <span className="truncate text-[11px] font-medium">{label}</span>
    </div>
  );
}

function MatchBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[236px] shrink-0 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-neutral-900/60">
      {children}
    </div>
  );
}

function Slot({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-1 items-center">{children}</div>;
}

function Connector({ count }: { count: number }) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-1 items-stretch">
          <div className="relative w-6 sm:w-8">
            <span className="absolute left-0 top-1/4 h-px w-1/2 bg-black/15 dark:bg-white/15" />
            <span className="absolute bottom-1/4 left-0 h-px w-1/2 bg-black/15 dark:bg-white/15" />
            <span className="absolute bottom-1/4 left-1/2 top-1/4 w-px bg-black/15 dark:bg-white/15" />
            <span className="absolute left-1/2 top-1/2 h-px w-1/2 -translate-y-1/2 bg-black/15 dark:bg-white/15" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function KnockoutBracket({ quartas }: { quartas: ProjectedMatch[] }) {
  const [picks, setPicks] = useState<Picks>({});

  function teamById(id: string | undefined): Team | undefined {
    if (!id) return undefined;
    for (const m of quartas) {
      if (m.home.team.id === id) return m.home.team;
      if (m.away.team.id === id) return m.away.team;
    }
    return undefined;
  }

  function pickQf(slot: QfKey, teamId: string) {
    setPicks((prev) => {
      const next = { ...prev, [slot]: teamId };
      if (slot === "qf1" || slot === "qf2") {
        delete next.sf1;
      } else {
        delete next.sf2;
      }
      delete next.final;
      return next;
    });
  }

  function pickSf(slot: SfKey, teamId: string) {
    setPicks((prev) => {
      const next = { ...prev, [slot]: teamId };
      delete next.final;
      return next;
    });
  }

  function pickFinal(teamId: string) {
    setPicks((prev) => ({ ...prev, final: teamId }));
  }

  function reset() {
    setPicks({});
  }

  const sf1Home = teamById(picks.qf1);
  const sf1Away = teamById(picks.qf2);
  const sf2Home = teamById(picks.qf3);
  const sf2Away = teamById(picks.qf4);
  const finalHome = teamById(picks.sf1);
  const finalAway = teamById(picks.sf2);
  const champion = teamById(picks.final);
  const hasPicks = Object.keys(picks).length > 0;

  function semiBox(home: Team | undefined, away: Team | undefined, slot: SfKey, homeLabel: string, awayLabel: string) {
    return (
      <MatchBox>
        {home ? (
          <PickableTeamRow
            team={home}
            selected={picks[slot] === home.id}
            faded={Boolean(picks[slot]) && picks[slot] !== home.id}
            onPick={() => pickSf(slot, home.id)}
          />
        ) : (
          <PlaceholderRow label={homeLabel} />
        )}
        <div className="h-px bg-black/5 dark:bg-white/10" />
        {away ? (
          <PickableTeamRow
            team={away}
            selected={picks[slot] === away.id}
            faded={Boolean(picks[slot]) && picks[slot] !== away.id}
            onPick={() => pickSf(slot, away.id)}
          />
        ) : (
          <PlaceholderRow label={awayLabel} />
        )}
      </MatchBox>
    );
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500 dark:text-neutral-400">
        <span>👆 Clique em um time para avançá-lo na sua simulação</span>
        {hasPicks && (
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-black/5 px-3 py-1 font-semibold text-neutral-700 transition-colors hover:bg-black/10 dark:bg-white/10 dark:text-neutral-200 dark:hover:bg-white/15"
          >
            Limpar palpites
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-[960px] items-stretch py-2">
          <div className="flex flex-col">
            {quartas.map((m, i) => {
              const slot = QF_KEYS[i];
              return (
                <Slot key={m.id}>
                  <MatchBox>
                    <PickableTeamRow
                      team={m.home.team}
                      group={m.home.group}
                      position={m.home.position}
                      selected={picks[slot] === m.home.team.id}
                      faded={Boolean(picks[slot]) && picks[slot] !== m.home.team.id}
                      onPick={() => pickQf(slot, m.home.team.id)}
                    />
                    <div className="h-px bg-black/5 dark:bg-white/10" />
                    <PickableTeamRow
                      team={m.away.team}
                      group={m.away.group}
                      position={m.away.position}
                      selected={picks[slot] === m.away.team.id}
                      faded={Boolean(picks[slot]) && picks[slot] !== m.away.team.id}
                      onPick={() => pickQf(slot, m.away.team.id)}
                    />
                  </MatchBox>
                </Slot>
              );
            })}
          </div>

          <Connector count={2} />

          <div className="flex flex-col">
            <Slot>{semiBox(sf1Home, sf1Away, "sf1", "Vencedor QF1", "Vencedor QF2")}</Slot>
            <Slot>{semiBox(sf2Home, sf2Away, "sf2", "Vencedor QF3", "Vencedor QF4")}</Slot>
          </div>

          <Connector count={1} />

          <div className="flex flex-col">
            <Slot>
              <MatchBox>
                {finalHome ? (
                  <PickableTeamRow
                    team={finalHome}
                    selected={picks.final === finalHome.id}
                    faded={Boolean(picks.final) && picks.final !== finalHome.id}
                    onPick={() => pickFinal(finalHome.id)}
                  />
                ) : (
                  <PlaceholderRow label="Vencedor SF1" />
                )}
                <div className="h-px bg-black/5 dark:bg-white/10" />
                {finalAway ? (
                  <PickableTeamRow
                    team={finalAway}
                    selected={picks.final === finalAway.id}
                    faded={Boolean(picks.final) && picks.final !== finalAway.id}
                    onPick={() => pickFinal(finalAway.id)}
                  />
                ) : (
                  <PlaceholderRow label="Vencedor SF2" />
                )}
              </MatchBox>
            </Slot>
          </div>

          <Connector count={1} />

          <div className="flex flex-col">
            <Slot>
              <div className="flex w-[140px] shrink-0 flex-col items-center gap-1 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-50/60 px-3 py-4 text-center dark:bg-emerald-500/5">
                <span className="text-xl">🏆</span>
                <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                  Campeão
                </span>
                {champion ? (
                  <>
                    <TeamBadge team={champion} size="md" />
                    <span className="truncate text-xs font-bold text-emerald-900 dark:text-emerald-200" title={champion.name}>
                      {champion.name}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-black text-neutral-300 dark:text-neutral-600">?</span>
                )}
              </div>
            </Slot>
          </div>
        </div>
      </div>
    </div>
  );
}
