'use client';

import { useEffect, useState } from 'react';
import { pageCopy } from '@/data/content';

const LINKS = pageCopy.nav.sections;

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 32);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-[100] transition-[padding,background,backdrop-filter] duration-500 ease-[var(--ease-stage)] ${
        scrolled || open ? 'bg-bg/85 py-3 backdrop-blur-xl' : 'bg-transparent py-6'
      }`}
      style={{
        borderBottom: scrolled || open ? '1px solid var(--color-border)' : '1px solid transparent',
      }}
    >
      <div className="max-w-container px-section mx-auto flex w-full items-center justify-between">
        <a
          href="#"
          className="group relative flex items-center gap-3 leading-none transition-transform active:scale-95"
          aria-label="Internacional Freeband — início"
        >
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold tracking-wide text-white transition-colors hover:text-[#C59E57]">
              Internacional Freeband
            </span>
          </div>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group text-xs font-bold uppercase tracking-widest text-white transition-colors hover:text-[#C59E57]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#servicos"
            className="group text-xs font-bold uppercase tracking-widest text-[#C59E57] transition-colors hover:text-white"
          >
            Serviços
          </a>
          <a
            href="#contato"
            className="inline-flex items-center justify-center bg-[#C59E57] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#b08b47]"
          >
            {pageCopy.nav.ctaLabel}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Menu"
          aria-expanded={open}
          className="relative z-[110] flex h-10 w-10 flex-col items-center justify-center gap-[6px] lg:hidden"
        >
          <span
            className={`h-[2px] w-7 bg-text transition-transform duration-300 ${
              open ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`h-[2px] w-7 bg-text transition-opacity duration-300 ${
              open ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`h-[2px] w-7 bg-text transition-transform duration-300 ${
              open ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[105] bg-bg transition-[clip-path] duration-[600ms] ease-[var(--ease-stage)] lg:hidden ${
          open ? '[clip-path:circle(150%_at_100%_0)]' : '[clip-path:circle(0%_at_100%_0)]'
        }`}
      >
        <div className="flex h-full flex-col justify-between px-8 pb-12 pt-32">
          <ul className="flex flex-col gap-4">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline gap-5 border-b border-border py-5"
                >
                  <span className="font-mono text-xs text-brand tabular-nums">{link.num}</span>
                  <span
                    className="font-display leading-none text-text group-hover:text-brand transition-colors"
                    style={{ fontSize: 'var(--text-4xl)' }}
                  >
                    {link.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-6">
            <a
              href="#contato"
              onClick={() => setOpen(false)}
              className="block bg-brand px-8 py-5 text-center font-mono text-xs font-semibold uppercase tracking-[0.3em] text-white"
            >
              {pageCopy.nav.ctaLabel}
            </a>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-text-muted">
              {pageCopy.nav.brandLine}
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
