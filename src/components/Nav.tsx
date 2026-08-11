"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/classificacao", label: "Classificação" },
  { href: "/resultados", label: "Resultados" },
  { href: "/artilharia", label: "Artilharia" },
  { href: "/cartoes", label: "Cartões" },
  { href: "/mata-mata", label: "Mata-mata" },
  { href: "/simulacao", label: "Simulação" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 pitch-hero text-white shadow-md">
      <div className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-3 py-3 text-sm">
        <Link href="/" className="mr-3 flex shrink-0 items-center gap-2 font-extrabold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-base shadow-inner">
            ⚽
          </span>
          <span className="hidden sm:inline">Várzea Botucatu</span>
        </Link>
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-full px-3 py-1.5 font-medium transition-colors ${
                active
                  ? "bg-white text-emerald-900 shadow-sm"
                  : "text-emerald-50/90 hover:bg-white/15"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
