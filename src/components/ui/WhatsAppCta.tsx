// src/components/ui/WhatsAppCta.tsx
// Gold-gradient WhatsApp call-to-action with the sweeping shine hover,
// shared by Hero and AtoV_Contato (previously duplicated byte for byte).
//
// The gradient runs gold-light → gold (not gold → gold-deep) so ink text
// clears 4.5:1 across the whole sweep: white on gold was 2.5:1, and dark
// text on gold-deep is only 4.1:1. Ink on this ramp is 10.3:1 → 8.4:1.
import type { ReactNode } from "react";

interface WhatsAppCtaProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function WhatsAppCta({ href, children, className = "" }: WhatsAppCtaProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-md bg-gradient-to-r from-gold-light to-gold px-8 py-4 font-sans text-sm font-bold tracking-widest text-void-950 glow-gold transition-all hover:scale-105 hover:glow-gold-strong ${className}`.trim()}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.45),transparent)] -skew-x-12 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </a>
  );
}
