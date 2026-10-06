// src/components/pdf/portfolio/Partners.tsx
// Page 4, on paper. The names the band has shared a stage with run on a sign:
// a night panel between two rows of dots, a lit dot between one name and the
// next — the site's running sign, stopped. Under it the clubs that keep
// booking the band and three flyers from the archive, whole.
import { Text, View } from '@react-pdf/renderer';
import { artists, partners } from '@/data/band';
import { portfolio } from '@/data/copy/portfolio';
import { ratioOf } from '@/data/media/paths';
import { posters } from '@/data/media/posters';
import { DotLinePdf, PlateRowPdf, plateHeight } from '../motifs';
import { CONTENT_WIDTH, pdfTones, pdfType } from '../theme';
import { PdfPage } from './chrome';
import { pdfPhotos } from './images';

const c = portfolio.pdf.partners;
const paper = pdfTones.paper;
const night = pdfTones.night;
const type = pdfType.paper;

const SIGN_PAD = 22;
const SIGN_WIDTH = CONTENT_WIDTH - SIGN_PAD * 2;

const flyers = [pdfPhotos.barraBonita, pdfPhotos.nautico, pdfPhotos.cosmopolitano];
const FLYER_GAP = 6;
const flyerHeight = plateHeight(flyers, CONTENT_WIDTH, FLYER_GAP);
// What each flyer is, from the archive's own record of it.
const flyerCaptions = flyers.map((frame) => {
  const poster = posters.find((p) => p.src === frame.src);
  return { frame, text: poster ? `${poster.town} · ${poster.event}` : '' };
});

export function Partners() {
  return (
    <PdfPage n={4} label={c.title} title={c.artistsLabel}>
      <View style={{ backgroundColor: night.surface, padding: SIGN_PAD, gap: 16 }}>
        <DotLinePdf width={SIGN_WIDTH} color={night.led} />
        {/* Each name is one box with its dot, so a line breaks between names
            and never inside one. */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 18, rowGap: 5 }}>
          {artists.map((name) => (
            <View key={name} style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
              <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: night.led }} />
              <Text style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.3, lineHeight: 1.3, color: night.ink }}>{name}</Text>
            </View>
          ))}
        </View>
        <DotLinePdf width={SIGN_WIDTH} color={night.ledDim} />
      </View>

      <View style={{ marginTop: 24 }}>
        <Text style={type.label}>{c.partnersLabel}</Text>
        <View style={{ marginTop: 8, flexDirection: 'row', flexWrap: 'wrap' }}>
          {partners.map((name) => (
            <View key={name} style={{ width: CONTENT_WIDTH / 2, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: paper.led }} />
              <Text style={{ fontSize: 11.5, color: paper.ink }}>{name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ marginTop: 22 }}>
        <Text style={type.label}>{c.archiveLabel}</Text>
        <Text style={{ ...type.body, marginTop: 4, marginBottom: 10, maxWidth: 400 }}>{c.archiveNote}</Text>
        <PlateRowPdf frames={flyers} width={CONTENT_WIDTH} gap={FLYER_GAP} />
        <View style={{ marginTop: 5, flexDirection: 'row', gap: FLYER_GAP }}>
          {flyerCaptions.map(({ frame, text }) => (
            <Text key={frame.src} style={{ ...type.caption, width: flyerHeight * ratioOf(frame.aspect) }}>
              {text}
            </Text>
          ))}
        </View>
      </View>
    </PdfPage>
  );
}
