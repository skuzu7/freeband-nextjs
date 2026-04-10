"use client";

// src/components/orcamento/OrcamentoPage.tsx
// Client page shown inside the token-protected /orcamento/[token] route.
// Drives a split-pane editor: form on the left, scaled live preview on
// the right.
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
    <div className="min-h-screen bg-bg text-white">
      <div className="flex items-center justify-between border-b border-border bg-black px-8 py-6">
        <div>
          <div className="text-xs uppercase tracking-[0.15em] text-text-2">
            Internacional Freeband
          </div>
          <div className="font-display text-xl font-bold text-gold">
            Gerador de Proposta
          </div>
        </div>
        <a
          href="/"
          className="text-sm text-text-2 no-underline transition-colors hover:text-white"
        >
          &larr; Voltar ao site
        </a>
      </div>

      <div className="grid min-h-[calc(100vh-80px)] grid-cols-1 lg:grid-cols-2">
        <div className="max-h-[calc(100vh-80px)] overflow-y-auto border-r border-border">
          <OrcamentoForm data={data} onChange={setData} />
        </div>
        <div className="max-h-[calc(100vh-80px)] overflow-y-auto bg-bg-2 p-8">
          <OrcamentoPreview data={data} onPrint={handlePrint} />
        </div>
      </div>
    </div>
  );
}
