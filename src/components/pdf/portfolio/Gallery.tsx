// src/components/pdf/portfolio/Gallery.tsx
// Page 5. Three plate rows of the band's own show photography, every frame
// whole.
import { View } from '@react-pdf/renderer';
import { portfolio } from '@/data/copy/portfolio';
import { PlateRowPdf } from '../motifs';
import { CONTENT_WIDTH } from '../theme';
import { PdfPage } from './chrome';
import { pdfGalleryRows } from './images';

const c = portfolio.pdf.gallery;

export function Gallery() {
  return (
    <PdfPage n={5} label={c.title} title={c.lead}>
      <View style={{ gap: 6 }}>
        {pdfGalleryRows.map((row) => (
          <PlateRowPdf key={row.map((f) => f.src).join()} frames={row} width={CONTENT_WIDTH} />
        ))}
      </View>
    </PdfPage>
  );
}
