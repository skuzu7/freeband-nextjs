// src/components/pdf/portfolio/PortfolioDocument.tsx
// The seven-page portfolio. Fonts are registered here, once, before any page
// asks for them.
import { Document } from '@react-pdf/renderer';
import { bandInfo } from '@/data/band';
import { portfolio } from '@/data/copy/portfolio';
import { registerPdfFonts } from '../theme';
import { Cover } from './Cover';
import { About } from './About';
import { Timeline } from './Timeline';
import { Partners } from './Partners';
import { Gallery } from './Gallery';
import { Services } from './Services';
import { Contact } from './Contact';

export function PortfolioDocument() {
  registerPdfFonts();
  return (
    <Document title={portfolio.pdf.docTitle} author={bandInfo.name} subject={portfolio.pdf.docSubject} language="pt-BR">
      <Cover />
      <About />
      <Timeline />
      <Partners />
      <Gallery />
      <Services />
      <Contact />
    </Document>
  );
}
