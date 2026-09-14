import { config, matches, players, getTeam, teamsInGroup } from "@/lib/data";
import { computeStandings } from "@/lib/standings";
import { projectedQuarterfinals } from "@/lib/bracket";
import MatchCard from "@/components/MatchCard";
import KnockoutBracket from "@/components/KnockoutBracket";
import Card from "@/components/Card";

export const metadata = { title: `Mata-mata — ${config.nome}` };

const STAGES: { key: "quartas" | "semi" | "final"; label: string }[] = [
  { key: "quartas", label: "Quartas de final" },
  { key: "semi", label: "Semifinal" },
  { key: "final", label: "Final" },
];

export default function MataMataPage() {
  const knockout = matches.filter((m) => m.stage !== "grupos");

  const [groupA, groupB] = config.grupos;
  const canProject =
    knockout.length === 0 && config.grupos.length === 2 && config.classificadosPorGrupo === 4;

  const quartas = canProject
    ? projectedQuarterfinals(
        computeStandings(teamsInGroup(groupA).map((t) => t.id), matches, players)
          .slice(0, config.classificadosPorGrupo)
          .map((r) => getTeam(r.teamId)!),
        computeStandings(teamsInGroup(groupB).map((t) => t.id), matches, players)
          .slice(0, config.classificadosPorGrupo)
          .map((r) => getTeam(r.teamId)!)
      )
    : null;

  return (
    <div className="flex flex-col gap-8">
      <div className="pitch-hero -mx-3 px-5 py-6 text-white shadow-md sm:mx-0 sm:rounded-3xl sm:px-8">
        <h1 className="text-2xl font-extrabold tracking-tight">Fase eliminatória</h1>
        <p className="mt-1 text-sm text-emerald-50/90">
          Os {config.classificadosPorGrupo} melhores de cada grupo avançam para o mata-mata.
        </p>
      </div>

      {knockout.length === 0 ? (
        <>
          {quartas && (
            <section>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-bold tracking-tight">Projeção do mata-mata</h2>
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
                  Fase de grupos em andamento — cruzamento pode mudar
                </span>
              </div>
              <KnockoutBracket quartas={quartas} />
              <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                Cruzamento com base na classificação atual: 1º do Grupo A x 4º do Grupo B, 2º x 3º,
                e o mesmo invertido entre os grupos. As quartas ainda podem mudar até o fim da fase
                de grupos — semifinais e final seguem em aberto.
              </p>
            </section>
          )}
          <Card className="border-dashed p-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
            🏆 O chaveamento oficial ainda não foi definido pela organização — os jogos aparecerão
            aqui assim que a fase de grupos terminar.
          </Card>
        </>
      ) : (
        STAGES.map(
          ({ key, label }) =>
            knockout.some((m) => m.stage === key) && (
              <section key={key}>
                <h2 className="mb-2.5 font-bold tracking-tight">{label}</h2>
                <div className="flex flex-col gap-2.5">
                  {knockout
                    .filter((m) => m.stage === key)
                    .map((m) => (
                      <MatchCard key={m.id} match={m} homeTeam={getTeam(m.homeTeamId)!} awayTeam={getTeam(m.awayTeamId)!} />
                    ))}
                </div>
              </section>
            )
        )
      )}
    </div>
  );
}
