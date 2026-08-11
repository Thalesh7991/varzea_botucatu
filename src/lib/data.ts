import configJson from "../../data/config.json";
import teamsJson from "../../data/teams.json";
import playersJson from "../../data/players.json";
import matchesJson from "../../data/matches.json";
import type { Config, Team, Player, Match } from "./types";

export const config = configJson as Config;
export const teams = teamsJson as Team[];
export const players = playersJson as Player[];
export const matches = matchesJson as Match[];

export function getTeam(teamId: string): Team | undefined {
  return teams.find((t) => t.id === teamId);
}

export function teamsInGroup(group: string): Team[] {
  return teams.filter((t) => t.group === group);
}

export function playersOfTeam(teamId: string): Player[] {
  return players.filter((p) => p.teamId === teamId);
}

export function matchesOfTeam(teamId: string): Match[] {
  return matches.filter((m) => m.homeTeamId === teamId || m.awayTeamId === teamId);
}
