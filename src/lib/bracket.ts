import type { Team } from "./types";

export interface BracketSeed {
  team: Team;
  group: string;
  position: number;
}

export interface ProjectedMatch {
  id: string;
  home: BracketSeed;
  away: BracketSeed;
}

/**
 * Cruzamento em X entre os 4 primeiros de cada grupo: 1ºA x 4ºB, 2ºA x 3ºB,
 * 1ºB x 4ºA, 2ºB x 3ºA. `topA`/`topB` já devem vir ordenados pela classificação
 * (posição 0 = líder) e com pelo menos 4 times cada.
 */
export function projectedQuarterfinals(topA: Team[], topB: Team[]): ProjectedMatch[] {
  const seed = (team: Team, group: string, position: number): BracketSeed => ({
    team,
    group,
    position,
  });

  return [
    { id: "p-qf1", home: seed(topA[0], "A", 1), away: seed(topB[3], "B", 4) },
    { id: "p-qf2", home: seed(topA[1], "A", 2), away: seed(topB[2], "B", 3) },
    { id: "p-qf3", home: seed(topB[0], "B", 1), away: seed(topA[3], "A", 4) },
    { id: "p-qf4", home: seed(topB[1], "B", 2), away: seed(topA[2], "A", 3) },
  ];
}
