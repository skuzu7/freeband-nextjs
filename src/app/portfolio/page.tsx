"use client";

// src/app/portfolio/page.tsx
// Public portfolio download route. The @react-pdf/renderer bundle is
// isolated behind PortfolioDownloadButton + dynamic(ssr:false), keeping the
// PDF toolkit out of this route's app-ssr module graph.
import dynamic from "next/dynamic";
import { useState } from "react";

const PortfolioDownloadButton = dynamic(
  () =>
    import("@/components/pdf/portfolio/PortfolioDownloadButton").then(
      (mod) => mod.PortfolioDownloadButton,
    ),
  { ssr: false },
);

export default function PortfolioPage() {
  const [ready, setReady] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6">
      <div className="max-w-lg text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.15em] text-text-2">
          Internacional Freeband
        </div>
        <h1 className="mb-4 font-display text-4xl font-bold text-gold">
          Portfolio Digital
        </h1>
        <p className="mb-10 leading-relaxed text-text-2">
          Baixe nosso portfolio completo com historia, galeria, servicos e
          informacoes de contato.
        </p>

        {!ready ? (
          <button
            type="button"
            onClick={() => setReady(true)}
            className="cursor-pointer bg-gold px-10 py-4 text-sm font-bold uppercase tracking-[0.15em] text-bg transition-colors hover:bg-gold-light"
          >
            Preparar PDF
          </button>
        ) : (
          <PortfolioDownloadButton />
        )}

        <div className="mt-8">
          <a
            href="/"
            className="text-sm text-text-2 no-underline transition-colors hover:text-white"
          >
            &larr; Voltar ao site
          </a>
        </div>
      </div>
    </div>
  );
}
