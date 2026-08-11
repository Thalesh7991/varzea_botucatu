import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import { config } from "@/lib/data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${config.nome} ${config.serie}/${config.temporada}`,
  description: `Classificação, resultados, artilharia, cartões e simulação do ${config.nome} — ${config.serie}/${config.temporada}, ${config.cidade}.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <Nav />
        <main className="mx-auto w-full max-w-5xl flex-1 px-3 py-6 sm:px-4">{children}</main>
        <footer className="border-t border-black/10 px-3 py-5 text-center text-xs text-neutral-500 dark:border-white/10">
          Dados extraídos dos boletins oficiais (BID) do {config.organizador}. Boletim mais
          recente: {config.ultimoBoletim.numero}/{config.temporada}.
        </footer>
      </body>
    </html>
  );
}
