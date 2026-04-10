"use client";

// src/components/pdf/orcamento/OrcamentoDownloadButton.tsx
// Isolates @react-pdf/renderer behind a dynamic() boundary. The preview
// only references this wrapper with { ssr: false }, so Turbopack never
// pulls the PDF toolkit into the app-ssr module graph of the route page.
import { PDFDownloadLink } from "@react-pdf/renderer";
import { OrcamentoPdf } from "./OrcamentoPdf";
import type { OrcamentoData } from "@/types/orcamento";

interface OrcamentoDownloadButtonProps {
  data: OrcamentoData;
}

const className =
  "inline-block rounded-sm bg-gold px-8 py-3 text-sm font-bold uppercase tracking-wider text-black no-underline transition-colors hover:bg-gold-light";

export function OrcamentoDownloadButton({
  data,
}: OrcamentoDownloadButtonProps) {
  return (
    <PDFDownloadLink
      document={<OrcamentoPdf data={data} />}
      fileName={`Proposta-Freeband-${data.contratante || "cliente"}.pdf`}
      className={className}
    >
      {({ loading }) => (loading ? "Gerando..." : "Baixar PDF")}
    </PDFDownloadLink>
  );
}
