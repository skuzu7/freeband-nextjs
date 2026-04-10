"use client";

// src/components/pdf/portfolio/PortfolioDownloadButton.tsx
// Isolates @react-pdf/renderer behind a dynamic() boundary. The route page
// only references this wrapper with { ssr: false }, so Turbopack never
// pulls the PDF toolkit into the app-ssr module graph.
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PortfolioDocument } from "./PortfolioDocument";

const className =
  "inline-block bg-gold px-10 py-4 text-sm font-bold uppercase tracking-[0.15em] text-bg no-underline transition-colors hover:bg-gold-light";

export function PortfolioDownloadButton() {
  return (
    <PDFDownloadLink
      document={<PortfolioDocument />}
      fileName="Internacional-Freeband-Portfolio.pdf"
      className={className}
    >
      {({ loading }) => (loading ? "Gerando PDF..." : "Baixar Portfolio PDF")}
    </PDFDownloadLink>
  );
}
