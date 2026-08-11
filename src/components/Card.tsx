export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-neutral-900/60 ${className}`}
    >
      {children}
    </div>
  );
}
