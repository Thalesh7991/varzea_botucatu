import type { Match, Player, StandingsRow } from "./types";

function emptyRow(teamId: string): StandingsRow {
  return {
    teamId,
    pontos: 0,
    jogos: 0,
    vitorias: 0,
    empates: 0,
    derrotas: 0,
    golsPro: 0,
    golsContra: 0,
    saldoDeGols: 0,
    cartoesAmarelos: 0,
    cartoesVermelhos: 0,
  };
}

/** Calcula a classificação de um grupo a partir das partidas realizadas (fase de grupos). */
export function computeStandings(
  teamIds: string[],
  matches: Match[],
  players: Player[]
): StandingsRow[] {
  const rows = new Map<string, StandingsRow>();
  for (const id of teamIds) rows.set(id, emptyRow(id));

  const played = matches.filter(
    (m) =>
      m.stage === "grupos" &&
      m.status === "realizado" &&
      m.homeScore !== null &&
      m.awayScore !== null &&
      rows.has(m.homeTeamId) &&
      rows.has(m.awayTeamId)
  );

  for (const m of played) {
    const home = rows.get(m.homeTeamId)!;
    const away = rows.get(m.awayTeamId)!;
    const hs = m.homeScore as number;
    const as = m.awayScore as number;

    home.jogos += 1;
    away.jogos += 1;
    home.golsPro += hs;
    home.golsContra += as;
    away.golsPro += as;
    away.golsContra += hs;

    if (hs > as) {
      home.vitorias += 1;
      home.pontos += 3;
      away.derrotas += 1;
    } else if (hs < as) {
      away.vitorias += 1;
      away.pontos += 3;
      home.derrotas += 1;
    } else {
      home.empates += 1;
      away.empates += 1;
      home.pontos += 1;
      away.pontos += 1;
    }
  }

  for (const row of rows.values()) {
    row.saldoDeGols = row.golsPro - row.golsContra;
  }

  for (const p of players) {
    const row = rows.get(p.teamId);
    if (!row) continue;
    row.cartoesAmarelos += p.cartoesAmarelos;
    row.cartoesVermelhos += p.cartoesVermelhos;
  }

  return [...rows.values()].sort((a, b) => compareRows(a, b, played));
}

function headToHeadPoints(teamId: string, matches: Match[]): number {
  let pts = 0;
  for (const m of matches) {
    if (m.homeScore === null || m.awayScore === null) continue;
    if (m.homeTeamId === teamId) {
      if (m.homeScore > m.awayScore) pts += 3;
      else if (m.homeScore === m.awayScore) pts += 1;
    } else if (m.awayTeamId === teamId) {
      if (m.awayScore > m.homeScore) pts += 3;
      else if (m.awayScore === m.homeScore) pts += 1;
    }
  }
  return pts;
}

function compareRows(a: StandingsRow, b: StandingsRow, played: Match[]): number {
  if (b.pontos !== a.pontos) return b.pontos - a.pontos;
  if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
  if (b.saldoDeGols !== a.saldoDeGols) return b.saldoDeGols - a.saldoDeGols;
  if (b.golsPro !== a.golsPro) return b.golsPro - a.golsPro;

  const direct = played.filter(
    (m) =>
      (m.homeTeamId === a.teamId && m.awayTeamId === b.teamId) ||
      (m.homeTeamId === b.teamId && m.awayTeamId === a.teamId)
  );
  if (direct.length > 0) {
    const ptsA = headToHeadPoints(a.teamId, direct);
    const ptsB = headToHeadPoints(b.teamId, direct);
    if (ptsB !== ptsA) return ptsB - ptsA;
  }

  if (a.cartoesVermelhos !== b.cartoesVermelhos) return a.cartoesVermelhos - b.cartoesVermelhos;
  if (a.cartoesAmarelos !== b.cartoesAmarelos) return a.cartoesAmarelos - b.cartoesAmarelos;
  return a.teamId.localeCompare(b.teamId);
}
