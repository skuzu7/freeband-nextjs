"use client";

// src/components/orcamento/OrcamentoPreview.tsx
// Right-hand pane of the proposal builder: scaled HTML preview plus
// Print / Gerar PDF actions. The @react-pdf/renderer bundle is isolated
// behind OrcamentoDownloadButton + dynamic(ssr:false), keeping the PDF
// toolkit out of this module's app-ssr graph.
import dynamic from "next/dynamic";
import { useState } from "react";
import { PrintLayout } from "./PrintLayout";
import type { OrcamentoData } from "@/types/orcamento";

const OrcamentoDownloadButton = dynamic(
  () =>
    import("@/components/pdf/orcamento/OrcamentoDownloadButton").then(
      (mod) => mod.OrcamentoDownloadButton,
    ),
  { ssr: false },
);

interface OrcamentoPreviewProps {
  data: OrcamentoData;
  onPrint: () => void;
}

export function OrcamentoPreview({ data, onPrint }: OrcamentoPreviewProps) {
  const [pdfReady, setPdfReady] = useState(false);

  return (
    <div className="sticky top-8">
      <div className="mb-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={onPrint}
          className="cursor-pointer rounded-sm border-none bg-border px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-bg-card"
        >
          Imprimir
        </button>
        {!pdfReady ? (
          <button
            type="button"
            onClick={() => setPdfReady(true)}
            className="cursor-pointer rounded-sm border-none bg-gold px-8 py-3 text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-gold-light"
          >
            Gerar PDF
          </button>
        ) : (
          <OrcamentoDownloadButton data={data} />
        )}
      </div>

      <div className="overflow-hidden border border-border shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="w-[117.6%] origin-top-left scale-[0.85]">
          <PrintLayout data={data} />
        </div>
      </div>
    </div>
  );
}
