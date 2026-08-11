export function withBasePath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path}`;
}

export function formatDate(iso: string | null): string {
  if (!iso) return "Data a definir";
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

export function formatDateWeekday(iso: string | null): string {
  if (!iso) return "Data a definir";
  const date = new Date(`${iso}T12:00:00`);
  const weekday = date.toLocaleDateString("pt-BR", { weekday: "short" });
  return `${formatDate(iso)} (${weekday})`;
}

const PALETTE = [
  "#16a34a",
  "#0d9488",
  "#2563eb",
  "#7c3aed",
  "#dc2626",
  "#d97706",
  "#0891b2",
  "#be185d",
  "#4d7c0f",
  "#9333ea",
];

export function colorForTeam(teamId: string): string {
  let hash = 0;
  for (let i = 0; i < teamId.length; i++) hash = (hash * 31 + teamId.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

export function initialsForTeam(name: string): string {
  const words = name.replace(/[º']/g, "").split(/\s+/).filter(Boolean);
  const relevant = words.filter((w) => !["de", "da", "do", "das", "dos"].includes(w.toLowerCase()));
  const pick = relevant.length > 0 ? relevant : words;
  return pick
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}
