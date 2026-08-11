import { config, matches, getTeam } from "@/lib/data";
import MatchCard from "@/components/MatchCard";
import Card from "@/components/Card";

export const metadata = { title: `Mata-mata — ${config.nome}` };

const STAGES: { key: "quartas" | "semi" | "final"; label: string }[] = [
  { key: "quartas", label: "Quartas de final" },
  { key: "semi", label: "Semifinal" },
  { key: "final", label: "Final" },
];

export default function MataMataPage() {
  const knockout = matches.filter((m) => m.stage !== "grupos");

  return (
    <div className="flex flex-col gap-8">
      <div className="pitch-hero -mx-3 px-5 py-6 text-white shadow-md sm:mx-0 sm:rounded-3xl sm:px-8">
        <h1 className="text-2xl font-extrabold tracking-tight">Fase eliminatória</h1>
        <p className="mt-1 text-sm text-emerald-50/90">
          Os {config.classificadosPorGrupo} melhores de cada grupo avançam para o mata-mata.
        </p>
      </div>

      {knockout.length === 0 ? (
        <Card className="border-dashed p-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
          🏆 O chaveamento ainda não foi definido pela organização — os jogos aparecerão aqui assim
          que a fase de grupos terminar.
        </Card>
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
