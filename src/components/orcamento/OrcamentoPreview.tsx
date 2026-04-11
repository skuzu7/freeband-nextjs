"use client";

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
    <div className="sticky top-4 flex flex-col gap-4">
      <div className="no-print flex items-center justify-between gap-3">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-text-muted">
          02 · Preview A4
        </span>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onPrint}
            className="cursor-pointer border border-border bg-bg-high px-6 py-3 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-text transition-colors hover:border-brand hover:text-brand"
          >
            Imprimir
          </button>
          {!pdfReady ? (
            <button
              type="button"
              onClick={() => setPdfReady(true)}
              className="cursor-pointer bg-brand px-6 py-3 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-ink-950 transition-colors hover:bg-brand-hot"
            >
              Gerar PDF
            </button>
          ) : (
            <OrcamentoDownloadButton data={data} />
          )}
        </div>
      </div>

      <div
        className="origin-top overflow-hidden border border-border bg-bg-high shadow-[0_20px_60px_-20px_color-mix(in_oklch,var(--color-paper-900)_35%,transparent)]"
        style={{ containerType: "inline-size" }}
      >
        <div
          className="w-[210mm] max-w-none origin-top-left"
          style={{
            transform: "scale(var(--preview-scale, 1))",
            transformOrigin: "top left",
            height: "calc(297mm * var(--preview-scale, 1))",
            // Scale the 210mm-wide document down to the container width.
            // JS-less via CSS container query units (cqw).
            ["--preview-scale" as string]: "min(1, calc(100cqw / 210mm))",
          }}
        >
          <PrintLayout data={data} />
        </div>
      </div>
    </div>
  );
}
