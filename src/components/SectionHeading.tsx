import Link from "next/link";

export default function SectionHeading({
  title,
  href,
  linkLabel = "Ver tudo",
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      {href && (
        <Link
          href={href}
          className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
