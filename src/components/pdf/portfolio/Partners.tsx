// src/components/pdf/portfolio/Partners.tsx
// Page 4. The names the band has shared a stage with, the clubs that keep
// booking it, and three flyers from the archive, whole.
import { Text, View } from '@react-pdf/renderer';
import { artists, partners } from '@/data/band';
import { portfolio } from '@/data/copy/portfolio';
import { PlateRowPdf } from '../motifs';
import { CONTENT_WIDTH, pdfColors, pdfStyles } from '../theme';
import { PdfPage } from './chrome';
import { pdfPhotos } from './images';

const c = portfolio.pdf.partners;

export function Partners() {
  return (
    <PdfPage n={4} label={c.title} title={c.artistsLabel}>
      <View style={{ flexDirection: 'row', gap: 24 }}>
        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {artists.map((name) => (
            <View key={name} style={{ ...pdfStyles.card, paddingVertical: 8, width: 158 }}>
              <Text style={{ fontSize: 10, fontWeight: 600, color: pdfColors.ink }}>{name}</Text>
            </View>
          ))}
        </View>
        <View style={{ width: 160 }}>
          <Text style={pdfStyles.label}>{c.partnersLabel}</Text>
          <View style={{ marginTop: 8, gap: 5 }}>
            {partners.map((name) => (
              <View key={name} style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-start' }}>
                <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: pdfColors.led, marginTop: 4.5 }} />
                <Text style={{ fontSize: 9.5, color: pdfColors.inkMuted }}>{name}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={{ marginTop: 28 }}>
        <Text style={pdfStyles.label}>{c.archiveLabel}</Text>
        <Text style={{ ...pdfStyles.body, marginTop: 4, marginBottom: 10, maxWidth: 380 }}>{c.archiveNote}</Text>
        <PlateRowPdf frames={[pdfPhotos.barraBonita, pdfPhotos.nautico, pdfPhotos.cosmopolitano]} width={CONTENT_WIDTH} />
      </View>
    </PdfPage>
  );
}
