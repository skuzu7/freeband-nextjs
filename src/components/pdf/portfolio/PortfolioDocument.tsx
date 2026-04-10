// src/components/pdf/portfolio/PortfolioDocument.tsx
// Root @react-pdf/renderer document wiring up the seven portfolio pages.
import { Document } from "@react-pdf/renderer";
import { PdfCover } from "./PdfCover";
import { PdfAbout } from "./PdfAbout";
import { PdfTimeline } from "./PdfTimeline";
import { PdfPartners } from "./PdfPartners";
import { PdfGallery } from "./PdfGallery";
import { PdfServices } from "./PdfServices";
import { PdfContact } from "./PdfContact";

export function PortfolioDocument() {
  return (
    <Document
      title="Internacional Freeband - Portfolio & Servicos"
      author="Internacional Freeband"
      subject="Portfolio profissional da banda Internacional Freeband"
    >
      <PdfCover />
      <PdfAbout />
      <PdfTimeline />
      <PdfPartners />
      <PdfGallery />
      <PdfServices />
      <PdfContact />
    </Document>
  );
}
