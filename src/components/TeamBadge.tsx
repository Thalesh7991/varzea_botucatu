import Image from "next/image";
import type { Team } from "@/lib/types";
import { colorForTeam, initialsForTeam } from "@/lib/format";

const SIZES = { sm: 24, md: 32, lg: 48 } as const;

export default function TeamBadge({
  team,
  size = "md",
}: {
  team: Team;
  size?: keyof typeof SIZES;
}) {
  const px = SIZES[size];

  if (team.logo) {
    return (
      <span
        className="relative inline-block shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-black/10 dark:ring-white/15"
        style={{ width: px, height: px }}
      >
        <Image src={team.logo} alt={team.name} fill sizes={`${px}px`} className="object-cover" />
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-bold text-white shrink-0"
      style={{
        width: px,
        height: px,
        backgroundColor: colorForTeam(team.id),
        fontSize: px * 0.38,
      }}
    >
      {initialsForTeam(team.name)}
    </span>
  );
}
