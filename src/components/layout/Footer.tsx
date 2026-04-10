import { bandInfo } from "@/data/content";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-black py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 sm:px-6 lg:px-8">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-gold">
          Internacional Freeband
        </p>
        <p className="text-xs text-text-2">
          {"\u00A9"} {year} {bandInfo.name}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
