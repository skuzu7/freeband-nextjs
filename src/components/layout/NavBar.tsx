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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloquear scroll quando menu aberto
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [open]);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${
        scrolled || open ? "bg-bg/90 backdrop-blur-md py-3 shadow-lg border-b border-white/5" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex flex-col group">
          <span className="text-[0.6rem] uppercase tracking-[0.4em] text-text-muted transition-colors group-hover:text-gold">Internacional</span>
          <span className="text-lg font-bold uppercase tracking-[0.2em] text-gold">Freeband</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[0.7rem] uppercase tracking-[0.2em] font-medium text-text-muted hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contato"
            className="bg-gold px-6 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-bg hover:bg-gold-light transition-all"
          >
            Agendar
          </a>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 z-50 p-2"
          aria-label="Menu"
        >
          <div className={`h-0.5 w-6 bg-gold transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
          <div className={`h-0.5 w-6 bg-gold transition-all ${open ? "opacity-0" : ""}`} />
          <div className={`h-0.5 w-6 bg-gold transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-bg transition-transform duration-500 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-2xl font-bold uppercase tracking-[0.3em] text-gold hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contato"
            onClick={() => setOpen(false)}
            className="mt-4 bg-gold px-12 py-4 text-sm font-bold uppercase tracking-[0.3em] text-bg"
          >
            Agendar Agora
          </a>
        </div>
      </div>
    </nav>
  );
}
