'use client';

import { useEffect, useState } from 'react';
import { contact, bandInfo } from '@/data/content';
import { MessageCircle, ArrowUp } from 'lucide-react';

export function FloatingQuoteBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 500px and not at the very bottom
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const isNearBottom = scrollY + windowHeight >= docHeight - 300;

      setVisible(scrollY > 500 && !isNearBottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <aside
      aria-label="Barra de orçamento rápido"
      className="fixed bottom-6 inset-x-0 z-[150] flex justify-center px-4 pointer-events-none transition-all duration-500 animate-in fade-in slide-in-from-bottom-6"
    >
      <div className="pointer-events-auto flex items-center justify-between gap-3 md:gap-6 border border-brand/50 bg-void-950/90 p-2 md:py-2.5 md:px-5 shadow-2xl backdrop-blur-md ring-1 ring-brand/30 glow-gold-soft max-w-xl w-full">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand"></span>
          </span>
          <div className="flex flex-col">
            <span className="font-mono text-[0.65rem] md:text-xs font-semibold uppercase tracking-wider text-text">
              Agenda Aberta {new Date().getFullYear()}
            </span>
            <span className="hidden md:inline font-mono text-[0.58rem] text-text-muted">
              {bandInfo.name} · {bandInfo.yearsActive} anos de estrada
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={contact.whatsappQuoteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gold px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider text-void-950 transition-all hover:bg-gold-light hover:glow-gold cursor-pointer"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Pedir Orçamento</span>
          </a>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Voltar ao topo"
            className="hidden sm:inline-flex h-8 w-8 items-center justify-center border border-border bg-bg-high text-text-muted transition-colors hover:border-brand hover:text-brand"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
