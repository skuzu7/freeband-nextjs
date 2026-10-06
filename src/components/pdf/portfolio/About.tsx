// src/components/pdf/portfolio/About.tsx
// Page 2, on paper. The four figures on the dot matrix, as a scoreboard across
// the page; the release in full; the whole band, and the line-up counted in
// lit dots — eleven of them, one per person on stage.
import { Path, Svg, Text, View } from '@react-pdf/renderer';
import { bandLineup, paragraphsOf, release } from '@/data/band';
import { portfolio } from '@/data/copy/portfolio';
import { dotsPath } from '@/lib/led/svg';
import { DotLinePdf, LedNumberPdf, PhotoPdf } from '../motifs';
import { CONTENT_WIDTH, DOT_PITCH, pdfTones, pdfType } from '../theme';
import { PdfPage } from './chrome';
import { pdfPhotos } from './images';

const c = portfolio.pdf.about;
const t = pdfTones.paper;
const type = pdfType.paper;
const paragraphs = paragraphsOf(release.full);

const GAP = 24;
const SIDE_WIDTH = 190;
const TEXT_WIDTH = CONTENT_WIDTH - SIDE_WIDTH - GAP;
/** Room for the largest head count in the line-up, in dots. */
const COUNT_WIDTH = Math.max(...bandLineup.roles.map((r) => r.count)) * DOT_PITCH;

/** `count` lit dots in a row: people, not a figure. */
function Heads({ count }: { count: number }) {
  const d = dotsPath(Array.from({ length: count }, (_, i) => [i * DOT_PITCH + 2, 2] as const));
  return (
    <Svg width={COUNT_WIDTH} height={4} viewBox={`0 0 ${COUNT_WIDTH} 4`}>
      <Path d={d} fill="none" stroke={t.led} strokeWidth={3.4} strokeLinecap="round" />
    </Svg>
  );
}

export function About() {
  return (
    <PdfPage n={2} label={c.title} title={release.slogan}>
      <View style={{ flexDirection: 'row', marginBottom: 14 }}>
        {release.highlights.map((h) => (
          <View key={h.label} style={{ width: CONTENT_WIDTH / release.highlights.length }}>
            <LedNumberPdf value={h.value} height={26} color={t.led} dimColor={t.ledDim} />
            <Text style={{ ...type.caption, marginTop: 7 }}>{h.label}</Text>
          </View>
        ))}
      </View>
      <DotLinePdf width={CONTENT_WIDTH} color={t.ledDim} />

      <View style={{ marginTop: 20, flexDirection: 'row', gap: GAP }}>
        <View style={{ width: TEXT_WIDTH }}>
          {paragraphs.map((p, i) => (
            <Text
              key={p.slice(0, 32)}
              style={i === 0 ? { ...type.lead, color: t.ink, marginBottom: 10 } : { ...type.body, marginBottom: 8 }}
            >
              {p}
            </Text>
          ))}
        </View>

        <View style={{ width: SIDE_WIDTH, gap: 16 }}>
          <View>
            <PhotoPdf frame={pdfPhotos.bandaCompleta} width={SIDE_WIDTH} />
            <Text style={{ ...type.caption, marginTop: 5 }}>{c.photoCaption}</Text>
          </View>

          <View>
            <Text style={type.label}>{c.lineupLabel}</Text>
            <View style={{ marginTop: 8, gap: 4 }}>
              {bandLineup.roles.map((r) => (
                <View key={r.role} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Heads count={r.count} />
                  <Text style={{ fontSize: 9, color: t.ink }}>
                    {r.count} {r.role}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View>
            <Text style={type.labelMuted}>{c.valuesTitle}</Text>
            {/* One to a line: joined, the three run a few points past the column. */}
            <View style={{ marginTop: 4, gap: 1 }}>
              {release.values.map((value) => (
                <Text key={value} style={{ fontSize: 10, color: t.ink }}>
                  {value}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </View>
    </PdfPage>
  );
}
