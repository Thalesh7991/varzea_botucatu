import type { Player } from "./types";
import { config } from "./data";

export function topScorers(players: Player[], limit = 20): Player[] {
  return [...players]
    .filter((p) => p.gols > 0)
    .sort((a, b) => b.gols - a.gols || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export function topCards(players: Player[], limit = 20): Player[] {
  return [...players]
    .filter((p) => p.cartoesAmarelos > 0 || p.cartoesVermelhos > 0)
    .sort(
      (a, b) =>
        b.cartoesVermelhos - a.cartoesVermelhos ||
        b.cartoesAmarelos - a.cartoesAmarelos ||
        a.name.localeCompare(b.name)
    )
    .slice(0, limit);
}

/** Jogadores pendurados (a 1 cartão da suspensão automática) ou já suspensos. */
export function suspensosEPendurados(players: Player[]) {
  const limite = config.regraSuspensao.amarelosParaSuspensao;
  const suspensos = players.filter(
    (p) => p.cartoesVermelhos > 0 || p.cartoesAmarelos >= limite || p.observacao?.toLowerCase().includes("suspenso")
  );
  const pendurados = players.filter(
    (p) => p.cartoesAmarelos === limite - 1 && p.cartoesVermelhos === 0 && !suspensos.includes(p)
  );
  return { suspensos, pendurados };
}
