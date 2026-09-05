// src/components/pdf/portfolio/About.tsx
// Page 2. The release in full, the four numbers, the line-up, the values.
import { Text, View } from '@react-pdf/renderer';
import { bandLineup, release } from '@/data/band';
import { portfolio } from '@/data/copy/portfolio';
import { PhotoPdf } from '../motifs';
import { pdfColors, pdfStyles } from '../theme';
import { Fact, PdfPage } from './chrome';
import { pdfPhotos } from './images';

const c = portfolio.pdf.about;
const paragraphs = release.full.split(/\n\s*\n/).map((p) => p.trim());

export function About() {
  return (
    <PdfPage n={2} label={c.title} title={release.slogan}>
      <View style={{ flexDirection: 'row', gap: 24 }}>
        <View style={{ width: 290 }}>
          {paragraphs.map((p) => (
            <Text key={p.slice(0, 32)} style={{ ...pdfStyles.body, marginBottom: 8 }}>
              {p}
            </Text>
          ))}
        </View>

        <View style={{ flex: 1, gap: 14 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {release.highlights.map((h) => (
              <View key={h.label} style={{ ...pdfStyles.card, width: 97 }}>
                <Text style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.5, color: pdfColors.led }}>{h.value}</Text>
                <Text style={{ ...pdfStyles.caption, marginTop: 3 }}>{h.label}</Text>
              </View>
            ))}
          </View>

          <View>
            <PhotoPdf frame={pdfPhotos.bandaCompleta} width={200} />
            <Text style={{ ...pdfStyles.caption, marginTop: 4 }}>{c.photoCaption}</Text>
          </View>

          <View>
            <Text style={pdfStyles.label}>{c.lineupLabel}</Text>
            <View style={{ marginTop: 6, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {bandLineup.roles.map((r) => (
                <View key={r.role} style={{ flexDirection: 'row', alignItems: 'baseline', gap: 3 }}>
                  <Text style={{ fontSize: 12, fontWeight: 600, color: pdfColors.led }}>{r.count}</Text>
                  <Text style={{ fontSize: 8, color: pdfColors.inkMuted }}>{r.role}</Text>
                </View>
              ))}
            </View>
          </View>

          <Fact label={c.valuesTitle} value={release.values.join(' · ')} />
        </View>
      </View>
    </PdfPage>
  );
}
