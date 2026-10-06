// src/components/pdf/portfolio/Gallery.tsx
// Page 5, on night — stage photographs are lit subjects on a dark ground, and
// paper around them greys the blacks. Three plate rows, one per act of /palco
// and under the same names, every frame whole.
import { Text, View } from '@react-pdf/renderer';
import { portfolio } from '@/data/copy/portfolio';
import { PlateRowPdf } from '../motifs';
import { CONTENT_WIDTH, pdfType } from '../theme';
import { PdfPage } from './chrome';
import { pdfGalleryActs } from './images';

const c = portfolio.pdf.gallery;
const type = pdfType.night;

export function Gallery() {
  return (
    <PdfPage n={5} label={c.title} title={c.lead} tone="night" compact>
      <View style={{ gap: 10 }}>
        {pdfGalleryActs.map(({ act, frames }) => (
          <View key={act}>
            <Text style={{ ...type.label, marginBottom: 4 }}>{c.acts[act]}</Text>
            <PlateRowPdf frames={frames} width={CONTENT_WIDTH} />
          </View>
        ))}
      </View>
      <Text style={{ ...type.caption, marginTop: 6 }}>{c.photoCredit}</Text>
    </PdfPage>
  );
}
