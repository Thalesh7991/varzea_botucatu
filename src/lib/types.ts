export type Stage = "grupos" | "quartas" | "semi" | "terceiro" | "final";
export type MatchStatus = "agendado" | "realizado" | "adiado";

export interface Team {
  id: string;
  name: string;
  shortCode: string;
  group: string;
  logo: string | null;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  gols: number;
  cartoesAmarelos: number;
  cartoesVermelhos: number;
  observacao?: string;
}

export interface Match {
  id: string;
  stage: Stage;
  group: string | null;
  date: string | null;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
}

export interface Config {
  nome: string;
  serie: string;
  temporada: number;
  cidade: string;
  organizador: string;
  ultimoBoletim: { numero: number; data: string };
  grupos: string[];
  classificadosPorGrupo: number;
  rebaixadosPorGrupo: number;
  criteriosDesempate: string[];
  regraSuspensao: { amarelosParaSuspensao: number; descricao: string };
}

export interface StandingsRow {
  teamId: string;
  pontos: number;
  jogos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  golsPro: number;
  golsContra: number;
  saldoDeGols: number;
  cartoesAmarelos: number;
  cartoesVermelhos: number;
}
