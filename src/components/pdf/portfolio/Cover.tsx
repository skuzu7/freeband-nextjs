// src/components/pdf/portfolio/Cover.tsx
// Page 1, on night. The top of the page is the backdrop: a wall of LED dots,
// bled to the edges, lighting the name, and the red acrylic in front of it.
// Under it the band in front of that same wall, whole, and the year in dots.
import { Page, Text, View } from '@react-pdf/renderer';
import { bandInfo } from '@/data/band';
import { contact } from '@/data/contact';
import { portfolio } from '@/data/copy/portfolio';
import { LedWallPdf, wallPitch, wallSize } from '../LedWallPdf';
import { DotLinePdf, LedNumberPdf, PhotoPdf } from '../motifs';
import { A4, CONTENT_WIDTH, pdfGround, pdfStyles, pdfTones, pdfType } from '../theme';
import type { WallPad } from '../wall';
import { pdfPhotos } from './images';

const c = portfolio.pdf.cover;
const t = pdfTones.night;
const type = pdfType.night;

/** Where the mark's box starts, from the top of the page. */
const MARK_TOP = 116;
/** Where the photograph starts: clear of the wall's fading tail. */
const PHOTO_TOP = 312;

// The wall is laid out in whole dots around a mark as wide as the content
// column: enough columns either side to pass the page's edges, enough rows
// above to pass its top, and a tail below that fades into the night.
const pitch = wallPitch(CONTENT_WIDTH);
const side = Math.ceil(A4.margin / pitch);
const PAD: WallPad = { left: side, right: side, top: Math.ceil(MARK_TOP / pitch) + 1, bottom: 22 };
const FADE = { bottom: 14 };
const wall = wallSize(CONTENT_WIDTH, PAD);

const caps = { fontSize: 7.5, letterSpacing: 1.6, textTransform: 'uppercase' } as const;

export function Cover() {
  return (
    <Page size="A4" style={{ ...pdfStyles.page, backgroundColor: pdfGround.night, color: t.ink, paddingTop: 0, paddingBottom: 0 }}>
      {/* The wall, placed so the mark lands on the content column. */}
      <View style={{ position: 'absolute', left: A4.margin - wall.markLeft, top: MARK_TOP - wall.markTop }}>
        <LedWallPdf width={CONTENT_WIDTH} pad={PAD} fade={FADE} />
      </View>

      <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ ...caps, fontWeight: 600, color: t.ledText }}>{c.badge}</Text>
        <Text style={{ ...caps, color: t.inkMuted }}>{c.since(bandInfo.founded)}</Text>
      </View>

      {/* The brand line sits on the wall, above the f, as it does on the backdrop. */}
      <View style={{ position: 'absolute', left: A4.margin, top: MARK_TOP - 21 }}>
        <Text style={{ fontSize: 8.5, fontWeight: 600, letterSpacing: 2.4, textTransform: 'uppercase', color: t.ink }}>
          {c.brandLine}
        </Text>
      </View>

      <View style={{ position: 'absolute', left: A4.margin, top: PHOTO_TOP }}>
        <PhotoPdf frame={pdfPhotos.capa} width={CONTENT_WIDTH} />
        <Text style={{ ...type.caption, marginTop: 5 }}>{c.photoCredit}</Text>
      </View>

      <View
        style={{
          position: 'absolute',
          left: A4.margin,
          right: A4.margin,
          bottom: 92,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <View style={{ maxWidth: 340 }}>
          <Text style={{ fontSize: 26, fontWeight: 600, letterSpacing: -0.7, lineHeight: 1.1 }}>{c.kicker}</Text>
          <Text style={{ marginTop: 8, fontSize: 10, color: t.inkMuted, lineHeight: 1.45 }}>{bandInfo.taglineLong}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <LedNumberPdf value={String(bandInfo.founded)} height={34} color={t.led} dimColor={t.ledDim} />
          <Text style={{ ...type.caption, marginTop: 7 }}>{c.numberLabel}</Text>
        </View>
      </View>

      {/* Where the inner pages sign with the mark and count, the cover says where to find the band. */}
      <View style={{ ...pdfStyles.footer, bottom: 40, flexDirection: 'column', alignItems: 'stretch' }}>
        <DotLinePdf width={CONTENT_WIDTH} color={t.ledDim} />
        <View style={{ marginTop: 9, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ ...caps, color: t.inkMuted }}>{contact.website}</Text>
          <Text style={{ ...caps, color: t.inkMuted }}>{contact.phone}</Text>
        </View>
      </View>
    </Page>
  );
}
