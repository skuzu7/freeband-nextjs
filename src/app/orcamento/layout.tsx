// src/app/orcamento/layout.tsx
// The internal editor lives on paper: the same tokens, re-pointed by the
// theme attribute. Access control is in src/proxy.ts; this segment is never
// indexed.
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function OrcamentoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="paper" className="min-h-dvh bg-surface text-ink">
      {children}
    </div>
  );
}
