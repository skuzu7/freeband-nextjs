// src/components/ui/WhatsAppCta.tsx
// Gold-gradient WhatsApp call-to-action with the sweeping shine hover,
// shared by Hero and AtoV_Contato (previously duplicated byte for byte).
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
      className={`group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-md bg-gradient-to-r from-gold to-gold-deep px-8 py-4 font-sans text-sm font-bold tracking-widest text-white glow-gold transition-all hover:scale-105 hover:glow-gold-strong ${className}`.trim()}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.2),transparent)] -skew-x-12 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </a>
  );
}
