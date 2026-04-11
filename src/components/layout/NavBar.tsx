"use client";

import { useEffect, useState } from "react";

const links = [
  { label: "Sobre", href: "#sobre" },
  { label: "História", href: "#historia" },
  { label: "Galeria", href: "#galeria" },
  { label: "Serviços", href: "#servicos" },
  { label: "Contato", href: "#contato" },
];

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerClasses = [
    "fixed inset-x-0 top-0 z-50 transition-all duration-500",
    scrolled
      ? "translate-y-0 border-b border-black/5 bg-white/90 backdrop-blur-md"
      : "-translate-y-full bg-transparent",
  ].join(" ");

  return (
    <header className={headerClasses}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="#"
          className="font-display text-base font-bold tracking-widest text-slate-900 md:text-lg"
        >
          Internacional Freeband
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-widest text-slate-600 transition-colors hover:text-black"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contato"
            className="rounded-full bg-gold px-5 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-gold-light"
          >
            Agendar
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="text-2xl text-slate-900 md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? "\u2715" : "\u2630"}
        </button>
      </div>

      {open ? (
        <div className="flex flex-col gap-4 bg-white px-6 pb-6 pt-2 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-base tracking-wide text-slate-900"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contato"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-gold px-5 py-3 text-center text-sm font-bold uppercase tracking-widest text-white"
          >
            Agendar Show
          </a>
        </div>
      ) : null}
    </header>
  );
}
