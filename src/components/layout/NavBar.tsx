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
    "fixed inset-x-0 top-0 z-50 transition-all duration-300",
    scrolled
      ? "border-b border-border bg-bg/95 backdrop-blur-md"
      : "border-b border-transparent bg-transparent",
  ].join(" ");

  return (
    <header className={headerClasses}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="#"
          className="font-display text-base font-bold tracking-widest text-gold md:text-lg"
        >
          Internacional Freeband
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-widest text-text-2 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contato"
            className="bg-gold px-5 py-2 text-xs font-bold uppercase tracking-widest text-bg transition-colors hover:bg-gold-light"
          >
            Agendar
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="text-2xl text-white md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? "\u2715" : "\u2630"}
        </button>
      </div>

      {open ? (
        <div className="flex flex-col gap-4 bg-bg/98 px-6 pb-6 pt-2 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-base tracking-wide text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contato"
            onClick={() => setOpen(false)}
            className="mt-2 bg-gold px-5 py-3 text-center text-sm font-bold uppercase tracking-widest text-bg"
          >
            Agendar Show
          </a>
        </div>
      ) : null}
    </header>
  );
}
