"use client";

// Client page shown inside the token-protected /orcamento/[token] route.
// Paper-themed split-pane proposal editor: form on the left, live A4
// preview on the right.
import Link from "next/link";
import { useState } from "react";
import { OrcamentoForm } from "./OrcamentoForm";
import { OrcamentoPreview } from "./OrcamentoPreview";
import { defaultOrcamento } from "@/types/orcamento";
import type { OrcamentoData } from "@/types/orcamento";

export function OrcamentoPage() {
  const [data, setData] = useState<OrcamentoData>(defaultOrcamento);

  function handlePrint() {
    window.print();
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="no-print relative flex items-center justify-between border-b border-border bg-bg-high px-[clamp(1.25rem,4vw,3rem)] py-6">
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent"
        />
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-text-muted">
            Internacional Freeband
          </span>
          <span
            className="font-display -tracking-[0.02em] text-text"
            style={{ fontSize: "var(--text-2xl)", lineHeight: 1 }}
          >
            Gerador de <span className="serif-italic text-brand">proposta</span>
          </span>
        </div>
        <Link
          href="/"
          className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-text-muted transition-colors hover:text-brand"
        >
          ← Voltar ao site
        </Link>
      </header>

      <div className="grid min-h-[calc(100vh-96px)] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="no-print max-h-[calc(100vh-96px)] overflow-y-auto border-r border-border bg-bg">
          <OrcamentoForm data={data} onChange={setData} />
        </div>
        <div className="max-h-[calc(100vh-96px)] overflow-y-auto bg-bg-raise p-[clamp(1.25rem,3vi,2.5rem)]">
          <OrcamentoPreview data={data} onPrint={handlePrint} />
        </div>
      </div>
    </div>
  );
}
