"use client";

// src/app/portfolio/page.tsx
// Public portfolio download route. The @react-pdf/renderer bundle is
// isolated behind PortfolioDownloadButton + dynamic(ssr:false), keeping the
// PDF toolkit out of this route's app-ssr module graph.
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { images } from "@/data/images";
import { Wordmark } from "@/components/ui/Wordmark";

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
    <div className="relative isolate flex min-h-screen flex-col items-center justify-center bg-bg px-6">
      {/* The download page was a dark rectangle with a heading on it. One
          photograph, scrimmed hard, is enough to make it feel like the band's
          page rather than a file drop. */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={images.vocalEspelhado}
          alt=""
          fill
          sizes="100vw"
          className="grade-live object-cover opacity-40"
          style={{ objectPosition: "center 25%" }}
        />
        <div aria-hidden className="absolute inset-0 bg-bg/75" />
      </div>

      <div className="max-w-lg text-center">
        <div className="mb-6 flex flex-col items-center gap-2">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.4em] text-text-muted">
            Internacional
          </span>
          <Wordmark className="h-8 w-auto text-logo-red" title="Internacional Freeband" />
        </div>
        <h1 className="mb-4 font-display text-4xl font-bold text-gold">
          Portfólio Digital
        </h1>
        <p className="mb-10 leading-relaxed text-text-muted">
          Baixe nosso portfólio completo com história, galeria, serviços e
          informações de contato.
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
          <Link
            href="/"
            className="text-sm text-text-muted no-underline transition-colors hover:text-white"
          >
            &larr; Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  );
}
