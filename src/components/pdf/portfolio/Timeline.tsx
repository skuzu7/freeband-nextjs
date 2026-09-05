// src/components/pdf/portfolio/Timeline.tsx
// Page 3. Five eras, each with its own archival photograph shown whole at a
// fixed height, so the row reads as a strip of prints.
import { Text, View } from '@react-pdf/renderer';
import { timeline } from '@/data/band';
import { portfolio } from '@/data/copy/portfolio';
import { ratioOf } from '@/data/media/paths';
import { PhotoPdf } from '../motifs';
import { pdfColors, pdfStyles } from '../theme';
import { PdfPage } from './chrome';

const c = portfolio.pdf.timeline;
// Five rows have to share ~640pt under the header; 72pt prints keep every row
// on the page with the captions.
const PHOTO_HEIGHT = 72;

export function Timeline() {
  return (
    <PdfPage n={3} label={c.title} title={c.lead}>
      <View style={{ gap: 12 }}>
        {timeline.map((era, i) => (
          <View
            key={era.year}
            wrap={false}
            style={{
              flexDirection: 'row',
              gap: 16,
              paddingBottom: 12,
              borderBottomWidth: i < timeline.length - 1 ? 0.75 : 0,
              borderBottomColor: pdfColors.line,
            }}
          >
            <View style={{ width: 70 }}>
              <Text style={pdfStyles.label}>{era.year}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={pdfStyles.h2}>{era.title}</Text>
              <Text style={{ ...pdfStyles.body, marginTop: 4, maxWidth: 260 }}>{era.description}</Text>
            </View>
            <View style={{ width: 150, alignItems: 'flex-end' }}>
              <PhotoPdf frame={era.image} width={Math.min(150, PHOTO_HEIGHT * ratioOf(era.image.aspect))} />
              <Text style={{ ...pdfStyles.caption, marginTop: 3, textAlign: 'right' }}>{era.image.caption}</Text>
            </View>
          </View>
        ))}
      </View>
    </PdfPage>
  );
}
