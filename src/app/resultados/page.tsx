import { config, matches, getTeam } from "@/lib/data";
import { formatDateWeekday } from "@/lib/format";
import MatchCard from "@/components/MatchCard";

export const metadata = { title: `Resultados — ${config.nome}` };

export default function ResultadosPage() {
  const groups = new Map<string, typeof matches>();
  const order: string[] = [];

  const sorted = [...matches].sort((a, b) => {
    if (a.status === "agendado" && b.status !== "agendado") return 1;
    if (a.status !== "agendado" && b.status === "agendado") return -1;
    return (a.date ?? "").localeCompare(b.date ?? "");
  });

  for (const m of sorted) {
    const key = m.date ?? "sem-data";
    if (!groups.has(key)) {
      groups.set(key, []);
      order.push(key);
    }
    groups.get(key)!.push(m);
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold tracking-tight">Resultados</h1>
      {order.map((key) => (
        <section key={key}>
          <h2 className="mb-2.5 text-sm font-bold uppercase tracking-wide text-neutral-500">
            {key === "sem-data" ? "Rodada de abertura (data não registrada no BID)" : formatDateWeekday(key)}
          </h2>
          <div className="flex flex-col gap-2.5">
            {groups.get(key)!.map((m) => (
              <MatchCard key={m.id} match={m} homeTeam={getTeam(m.homeTeamId)!} awayTeam={getTeam(m.awayTeamId)!} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
