// src/components/pdf/portfolio/Cover.tsx
// Page 1. Night ground, the wordmark in red, the full stage under the moving-
// head show shown whole, the year in dots.
import { Page, Text, View } from '@react-pdf/renderer';
import { bandInfo } from '@/data/band';
import { portfolio } from '@/data/copy/portfolio';
import { DotLinePdf, LedNumberPdf, PhotoPdf } from '../motifs';
import { A4, CONTENT_WIDTH, PDF_FONT, pdfColors } from '../theme';
import { WordmarkPdf } from '../WordmarkPdf';
import { pdfPhotos } from './images';

const c = portfolio.pdf.cover;

export function Cover() {
  return (
    <Page
      size="A4"
      style={{
        backgroundColor: pdfColors.night,
        color: pdfColors.inkOnNight,
        fontFamily: PDF_FONT,
        paddingTop: 56,
        paddingBottom: 44,
        paddingHorizontal: A4.margin,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text style={{ fontSize: 8, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: pdfColors.inkOnNightMuted }}>
          {c.brandLine}
        </Text>
        <View style={{ flex: 1 }}>
          <DotLinePdf width={CONTENT_WIDTH - 90} color={pdfColors.ledDim} />
        </View>
      </View>
      <View style={{ marginTop: 10 }}>
        <WordmarkPdf width={CONTENT_WIDTH} />
      </View>

      <View style={{ marginTop: 36 }}>
        <PhotoPdf frame={pdfPhotos.hero} width={CONTENT_WIDTH} />
      </View>

      <View style={{ marginTop: 28, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <View style={{ maxWidth: 300 }}>
          <Text style={{ fontSize: 22, fontWeight: 600, letterSpacing: -0.5, lineHeight: 1.1 }}>{c.kicker}</Text>
          <Text style={{ marginTop: 8, fontSize: 10, color: pdfColors.inkOnNightMuted, lineHeight: 1.45 }}>
            {bandInfo.taglineLong}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <LedNumberPdf value={String(bandInfo.founded)} height={30} />
          <Text style={{ marginTop: 6, fontSize: 7, letterSpacing: 1.6, textTransform: 'uppercase', color: pdfColors.inkOnNightMuted }}>
            {c.numberLabel}
          </Text>
        </View>
      </View>

      <View
        style={{
          position: 'absolute',
          left: A4.margin,
          right: A4.margin,
          bottom: 40,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopWidth: 0.75,
          borderTopColor: pdfColors.nightRaise,
          paddingTop: 10,
        }}
      >
        <Text style={{ fontSize: 7.5, fontWeight: 600, letterSpacing: 1.6, textTransform: 'uppercase', color: pdfColors.ledBright }}>
          {c.badge}
        </Text>
        <Text style={{ fontSize: 7.5, letterSpacing: 1.6, textTransform: 'uppercase', color: pdfColors.inkOnNightMuted }}>
          {c.since(bandInfo.founded)}
        </Text>
      </View>
    </Page>
  );
}
