// src/components/pdf/portfolio/Timeline.tsx
// Page 3, on paper: the five eras on an axis — the timeline of /historia,
// printed. A rail of dots runs down the left and stops at today; an era is a dot
// of that rail switched on, with its year on the 5×7 matrix beside it. The
// first node is the founding chapter, the only sepia in the document, with
// the founders' portrait; the other four carry their archive photographs,
// every one whole (an era with two artefacts shows them as a plate).
//
// The blocks have fixed heights (./eras.ts) because the rail is drawn to the
// list's height before react-pdf lays the text out: a description that grows
// past its block has to grow the block there.
import { Text, View } from '@react-pdf/renderer';
import { bandInfo, timeline, type Era } from '@/data/band';
import { portfolio } from '@/data/copy/portfolio';
import { ratioOf } from '@/data/media/paths';
import { DotRailPdf, LedNumberPdf, PhotoPdf, PlateRowPdf, RAIL_WIDTH } from '../motifs';
import { CONTENT_WIDTH, pdfGround, pdfTones, pdfType } from '../theme';
import { PdfPage } from './chrome';
import { ERA_LAYOUT, NODE_OFFSET, eraDigits, eraTops, erasHeight } from './eras';

const c = portfolio.pdf.timeline;
const paper = pdfTones.paper;
const sepia = pdfTones.sepia;

const THIS_YEAR = bandInfo.founded + bandInfo.yearsActive;

/** Rail, then a gutter, then the eras. */
const GUTTER = 14;
const LIST_WIDTH = CONTENT_WIDTH - RAIL_WIDTH - GUTTER;
const COLUMN_GAP = 16;
/** The column that holds a year on the matrix: "80 90" at this height is 91pt wide. */
const YEAR_WIDTH = 96;
const YEAR_HEIGHT = 22;
/** Height of an era's photograph, and the column it sits in: two square posters side by side fit. */
const PHOTO_HEIGHT = 74;
const PHOTO_GAP = 4;
const PHOTO_COLUMN = PHOTO_HEIGHT * 2 + PHOTO_GAP;
const PANEL_PAD = 18;

const tops = eraTops(timeline.length);

function Founding({ era }: { era: Era }) {
  const type = pdfType.sepia;
  // The portrait takes the panel's height, less its caption.
  const photoHeight = ERA_LAYOUT.founding - PANEL_PAD * 2 - 14;
  return (
    <View
      style={{
        height: ERA_LAYOUT.founding,
        backgroundColor: sepia.surface,
        padding: PANEL_PAD,
        flexDirection: 'row',
        gap: COLUMN_GAP,
      }}
    >
      <View style={{ width: 124 }}>
        <Text style={type.label}>{c.chapter}</Text>
        <View style={{ marginTop: 14 }}>
          <LedNumberPdf value={eraDigits(era.year, THIS_YEAR)} height={34} color={sepia.led} dimColor={sepia.ledDim} />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.3, lineHeight: 1.15, color: sepia.ink }}>{era.title}</Text>
        <Text style={{ ...type.body, marginTop: 6 }}>{era.description}</Text>
        <View style={{ marginTop: 12 }}>
          <Text style={type.labelMuted}>{c.founderLabel}</Text>
          <Text style={{ marginTop: 3, fontSize: 10, color: sepia.ink }}>{c.founder}</Text>
        </View>
      </View>
      <View>
        <PhotoPdf frame={era.lead[0]} width={photoHeight * ratioOf(era.lead[0].aspect)} />
        <Text style={{ ...type.caption, marginTop: 5 }}>{era.lead[0].caption}</Text>
      </View>
    </View>
  );
}

function EraRow({ era }: { era: Era }) {
  const type = pdfType.paper;
  const digits = eraDigits(era.year, THIS_YEAR);
  // The era's own photographs; the album of /historia stays on the site.
  const frames = era.lead;
  const photosWidth = frames.reduce((sum, f) => sum + PHOTO_HEIGHT * ratioOf(f.aspect), 0) + PHOTO_GAP * (frames.length - 1);
  return (
    <View style={{ height: ERA_LAYOUT.era, flexDirection: 'row', gap: COLUMN_GAP }}>
      <View style={{ width: YEAR_WIDTH }}>
        {/* Lit cells only: on paper the unlit ones blur a figure this small. */}
        <LedNumberPdf value={digits} height={YEAR_HEIGHT} color={paper.led} dimColor={null} />
        {/* The matrix shows digits only: an era named in words keeps its name under them. */}
        {digits !== era.year && <Text style={{ ...type.label, marginTop: 7 }}>{era.year}</Text>}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={type.h2}>{era.title}</Text>
        <Text style={{ ...type.body, marginTop: 4 }}>{era.description}</Text>
      </View>
      {/* The caption has the whole column, not the photograph's width: a portrait is narrower than its words. */}
      <View style={{ width: PHOTO_COLUMN, alignItems: 'flex-end' }}>
        <PlateRowPdf frames={frames} width={photosWidth} gap={PHOTO_GAP} />
        <Text style={{ ...type.caption, marginTop: 4, width: PHOTO_COLUMN, textAlign: 'right' }}>
          {frames.map((f) => f.caption).join(' · ')}
        </Text>
      </View>
    </View>
  );
}

export function Timeline() {
  const [founding, ...later] = timeline;
  return (
    <PdfPage n={3} label={c.title} title={c.lead}>
      <View style={{ height: erasHeight(timeline.length) }}>
        <View style={{ position: 'absolute', left: 0, top: 0 }}>
          <DotRailPdf nodes={tops.map((top) => top + NODE_OFFSET)} color={paper.led} nodeColor={paper.led} surface={pdfGround.paper} />
        </View>
        <View style={{ marginLeft: RAIL_WIDTH + GUTTER, width: LIST_WIDTH, gap: ERA_LAYOUT.gap }}>
          <Founding era={founding} />
          {later.map((era) => (
            <EraRow key={era.year} era={era} />
          ))}
        </View>
      </View>
    </PdfPage>
  );
}
