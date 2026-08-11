import { config, teams, matches, players, teamsInGroup } from "@/lib/data";
import { computeStandings } from "@/lib/standings";
import StandingsTable from "@/components/StandingsTable";

export const metadata = { title: `Classificação — ${config.nome}` };

export default function ClassificacaoPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold tracking-tight">Classificação</h1>
      {config.grupos.map((group) => {
        const groupTeams = teamsInGroup(group);
        const rows = computeStandings(
          groupTeams.map((t) => t.id),
          matches,
          players
        );
        return (
          <section key={group}>
            <h2 className="mb-2 font-semibold">Grupo {group}</h2>
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
  );
}
